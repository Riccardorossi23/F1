/**
 * sync-f1-data.js
 * ------------------------------------------------------------
 * Script FACOLTATIVO che riempie/aggiorna le tabelle "dati F1"
 * (Piloti, Costruttori, Circuiti, ClassificaPiloti2025,
 * ClassificaCostruttori2025, RisultatiGare) usando l'API
 * pubblica e gratuita Jolpica-F1 (https://api.jolpi.ca/ergast/f1/),
 * il successore mantenuto della vecchia Ergast API.
 *
 * Non serve nessuna API key.
 *
 * Uso:
 *   cd server
 *   npm install          (installa anche dotenv + node-fetch)
 *   npm run sync-f1       oppure: node sync-f1-data.js
 *
 * Puoi anche passare la stagione da sincronizzare:
 *   node sync-f1-data.js 2024
 *
 * Lo script NON tocca le tabelle Utenti, BigliettiF1 e
 * AcquistiBiglietti: quelle restano gestite dal sito.
 * ------------------------------------------------------------
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const SEASON = process.argv[2] || new Date().getFullYear();
const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Richiesta fallita (${res.status}) per ${url}`);
    }
    return res.json();
}

async function main() {
    console.log(`\n🏎️  Sincronizzazione dati F1 stagione ${SEASON} da Jolpica (Ergast-compatible)...\n`);

    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'f1'
    });

    try {
        await syncCostruttoriEPiloti(db);
        await syncClassificaPiloti(db);
        await syncClassificaCostruttori(db);
        await syncCircuitiERisultati(db);
        console.log('\n✅ Sincronizzazione completata con successo.\n');
    } finally {
        await db.end();
    }
}

// --------------------------------------------------------
// Costruttori + Piloti (elenco completo della stagione)
// --------------------------------------------------------
async function syncCostruttoriEPiloti(db) {
    const data = await fetchJson(`${BASE_URL}/${SEASON}/drivers/`);
    const drivers = data.MRData.DriverTable.Drivers;

    const constructorsData = await fetchJson(`${BASE_URL}/${SEASON}/constructors/`);
    const constructors = constructorsData.MRData.ConstructorTable.Constructors;

    for (const c of constructors) {
        await db.query(
            `INSERT INTO Costruttori (Nome, Nazionalita, CodiceEsterno)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE Nazionalita = VALUES(Nazionalita), CodiceEsterno = VALUES(CodiceEsterno)`,
            [c.name, c.nationality, c.constructorId]
        );
    }
    console.log(`   • ${constructors.length} costruttori sincronizzati`);

    for (const d of drivers) {
        await db.query(
            `INSERT INTO Piloti (Nome, Cognome, Nazionalita, Numero, DataNascita, CodiceEsterno)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE Nazionalita = VALUES(Nazionalita), Numero = VALUES(Numero)`,
            [d.givenName, d.familyName, d.nationality, d.permanentNumber || null, d.dateOfBirth || null, d.driverId]
        );
    }
    console.log(`   • ${drivers.length} piloti sincronizzati`);
}

// --------------------------------------------------------
// Classifica piloti
// --------------------------------------------------------
async function syncClassificaPiloti(db) {
    const data = await fetchJson(`${BASE_URL}/${SEASON}/driverstandings/`);
    const lists = data.MRData.StandingsTable.StandingsLists;
    if (lists.length === 0) {
        console.log('   • Nessuna classifica piloti disponibile per questa stagione');
        return;
    }

    for (const row of lists[0].DriverStandings) {
        const pilotaId = await getIdByCodiceEsterno(db, 'Piloti', 'PilotaID', row.Driver.driverId);
        const costruttoreId = await getIdByCodiceEsterno(db, 'Costruttori', 'CostruttoreID', row.Constructors[0].constructorId);
        if (!pilotaId || !costruttoreId) continue;

        await db.query(
            `INSERT INTO ClassificaPiloti2025 (PilotaID, CostruttoreID, Posizione, PuntiTotali, Vittorie)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE CostruttoreID = VALUES(CostruttoreID), Posizione = VALUES(Posizione),
                                     PuntiTotali = VALUES(PuntiTotali), Vittorie = VALUES(Vittorie)`,
            [pilotaId, costruttoreId, parseInt(row.position, 10), parseFloat(row.points), parseInt(row.wins, 10)]
        );
    }
    console.log(`   • Classifica piloti aggiornata (${lists[0].DriverStandings.length} righe)`);
}

// --------------------------------------------------------
// Classifica costruttori
// --------------------------------------------------------
async function syncClassificaCostruttori(db) {
    const data = await fetchJson(`${BASE_URL}/${SEASON}/constructorstandings/`);
    const lists = data.MRData.StandingsTable.StandingsLists;
    if (lists.length === 0) {
        console.log('   • Nessuna classifica costruttori disponibile per questa stagione');
        return;
    }

    for (const row of lists[0].ConstructorStandings) {
        const costruttoreId = await getIdByCodiceEsterno(db, 'Costruttori', 'CostruttoreID', row.Constructor.constructorId);
        if (!costruttoreId) continue;

        await db.query(
            `INSERT INTO ClassificaCostruttori2025 (CostruttoreID, Posizione, PuntiTotali, Vittorie)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE Posizione = VALUES(Posizione), PuntiTotali = VALUES(PuntiTotali),
                                     Vittorie = VALUES(Vittorie)`,
            [costruttoreId, parseInt(row.position, 10), parseFloat(row.points), parseInt(row.wins, 10)]
        );
    }
    console.log(`   • Classifica costruttori aggiornata (${lists[0].ConstructorStandings.length} righe)`);
}

// --------------------------------------------------------
// Circuiti + risultati di ogni gara disputata nella stagione
// --------------------------------------------------------
async function syncCircuitiERisultati(db) {
    const racesData = await fetchJson(`${BASE_URL}/${SEASON}/races/`);
    const races = racesData.MRData.RaceTable.Races;

    let raceCount = 0;
    let resultCount = 0;

    for (const race of races) {
        const circuitoId = await upsertCircuito(db, race);

        // Scarica i risultati solo se la gara è già stata disputata
        const resultsData = await fetchJson(`${BASE_URL}/${SEASON}/${race.round}/results/`);
        const resultsRaces = resultsData.MRData.RaceTable.Races;
        if (resultsRaces.length === 0) continue; // gara futura, nessun risultato ancora

        raceCount++;
        const results = resultsRaces[0].Results;

        for (const r of results) {
            const pilotaId = await getIdByCodiceEsterno(db, 'Piloti', 'PilotaID', r.Driver.driverId);
            const costruttoreId = await getIdByCodiceEsterno(db, 'Costruttori', 'CostruttoreID', r.Constructor.constructorId);
            if (!pilotaId || !costruttoreId || !circuitoId) continue;

            const posizioneFinale = r.positionText && /^\d+$/.test(r.positionText)
                ? parseInt(r.positionText, 10)
                : null; // es. "R" (ritirato), "DSQ", ecc. -> NULL come da schema

            // Evita duplicati se lo script viene rilanciato più volte
            const [existing] = await db.query(
                `SELECT RisultatoID FROM RisultatiGare WHERE PilotaID = ? AND CircuitoID = ?`,
                [pilotaId, circuitoId]
            );

            if (existing.length > 0) {
                await db.query(
                    `UPDATE RisultatiGare SET CostruttoreID = ?, PosizioneFinale = ?, PuntiOttenuti = ? WHERE RisultatoID = ?`,
                    [costruttoreId, posizioneFinale, parseFloat(r.points), existing[0].RisultatoID]
                );
            } else {
                await db.query(
                    `INSERT INTO RisultatiGare (PilotaID, CostruttoreID, CircuitoID, PosizioneFinale, PuntiOttenuti)
                     VALUES (?, ?, ?, ?, ?)`,
                    [pilotaId, costruttoreId, circuitoId, posizioneFinale, parseFloat(r.points)]
                );
            }
            resultCount++;
        }
    }

    console.log(`   • ${races.length} gare del calendario sincronizzate (circuiti)`);
    console.log(`   • ${raceCount} gare con risultati disputati, ${resultCount} righe di RisultatiGare aggiornate`);
}

async function upsertCircuito(db, race) {
    // Usiamo il round come CircuitoID numerico stabile per la stagione
    // sincronizzata, e la data della gara come Giorno dell'edizione.
    const circuitoId = parseInt(race.round, 10);
    const nome = race.raceName;
    const nazione = race.Circuit.Location.country;
    const giorno = race.date;
    const codiceEsterno = race.Circuit.circuitId;

    await db.query(
        `INSERT INTO Circuiti (CircuitoID, Nome, Nazione, Giorno, CodiceEsterno)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE Nome = VALUES(Nome), Nazione = VALUES(Nazione), CodiceEsterno = VALUES(CodiceEsterno)`,
        [circuitoId, nome, nazione, giorno, codiceEsterno]
    );

    return circuitoId;
}

async function getIdByCodiceEsterno(db, table, idColumn, codiceEsterno) {
    const [rows] = await db.query(
        `SELECT ${idColumn} AS id FROM ${table} WHERE CodiceEsterno = ? LIMIT 1`,
        [codiceEsterno]
    );
    return rows.length > 0 ? rows[0].id : null;
}

main().catch(err => {
    console.error('\n❌ Errore durante la sincronizzazione:', err.message);
    process.exit(1);
});
