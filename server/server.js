const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname,'..', 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Inter2307!',
    database: 'f1'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connesso al database f1');
});

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// === API ENDPOINTS UTENTI ===

// Login utente (con supporto admin)
app.post('/login', (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).json({ error: 'Email e Password sono obbligatori' });
    }

    // Controllo per admin
    if (Email === 'admin@f1.com' && Password === 'admin1234') {
        return res.json({
            message: 'Login amministratore effettuato con successo',
            user: {
                CartaIdentitàID: 'ADMIN001',
                Nome: 'Admin',
                Cognome: 'System',
                Email: 'admin@f1.com',
                Ruolo: 'admin'
            }
        });
    }

    const query = `SELECT * FROM Utenti WHERE Email = ? AND Password = ?`;

    db.query(query, [Email, Password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenziali non valide' });
        }

        const user = results[0];
        res.json({
            message: 'Login effettuato con successo',
            user: {
                CartaIdentitàID: user.CartaIdentitàID,
                Nome: user.Nome,
                Cognome: user.Cognome,
                Email: user.Email,
                Ruolo: user.Ruolo || 'user'
            }
        });
    });
});

// Registrazione utente
app.post('/utenti', (req, res) => {
    const { Nome, Cognome, Email, Password, CartaIdentitàID } = req.body;

    if (!Nome || !Cognome || !Email || !Password || !CartaIdentitàID) {
        return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    const dataRegistrazione = new Date();

    const query = `
        INSERT INTO Utenti (CartaIdentitàID, Nome, Cognome, Email, Password, DataRegistrazione)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [CartaIdentitàID, Nome, Cognome, Email, Password, dataRegistrazione], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Codice Carta o Email già registrati' });
            }
            console.error('Errore registrazione:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Utente registrato con successo', codiceCarta: CartaIdentitàID });
    });
});

// === API ENDPOINTS BIGLIETTI ===

// Ottieni tutti i biglietti disponibili per circuito (endpoint generico)
app.get('/biglietti/circuito/:CircuitoID', (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT b.*, c.Nome AS NomeCircuito, c.Nazione, c.Giorno
        FROM BigliettiF1 b
        JOIN Circuiti c ON b.GranPremioID = c.CircuitoID
        WHERE b.GranPremioID = ? AND c.Giorno = (
            SELECT MAX(Giorno) FROM Circuiti WHERE CircuitoID = ?
        )
        ORDER BY 
            CASE b.TipoPosto
                WHEN 'Paddock' THEN 1 
                WHEN 'Gradinate' THEN 2 
                WHEN 'Prato' THEN 3 
            END
    `;

    db.query(query, [id, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Endpoint specifico per biglietti F1 (con compatibilità TipoPosto)
app.get('/bigliettiF1/circuito/:CircuitoID', (req, res) => {
    const { CircuitoID } = req.params;

    const query = `
        SELECT b.*, c.Nome AS NomeCircuito, c.Nazione, c.Giorno
        FROM BigliettiF1 b
        JOIN Circuiti c ON b.GranPremioID = c.CircuitoID
        WHERE b.GranPremioID = ? AND c.Giorno = (
            SELECT MAX(Giorno) FROM Circuiti WHERE CircuitoID = ?
        )
        ORDER BY 
            CASE b.TipoPosto
                WHEN 'Paddock' THEN 1 
                WHEN 'Gradinate' THEN 2 
                WHEN 'Prato' THEN 3 
            END
    `;

    db.query(query, [CircuitoID, CircuitoID], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // Aggiungi il campo TipoPosto per compatibilità con il frontend
        const resultsWithTipoPosto = results.map(ticket => ({
            ...ticket,
            TipoPosto: ticket.TipoPosto
        }));

        res.json(resultsWithTipoPosto);
    });
});

// Ottieni tutti i biglietti (per admin)
app.get('/biglietti', (req, res) => {
    const query = `
        SELECT b.*, c.Nome AS NomeCircuito, c.Nazione, c.Giorno
        FROM BigliettiF1 b
        JOIN (
            SELECT CircuitoID, Nome, Nazione, Giorno
            FROM Circuiti
            WHERE (CircuitoID, Giorno) IN (
                SELECT CircuitoID, MAX(Giorno)
                FROM Circuiti
                GROUP BY CircuitoID
            )
        ) c ON b.GranPremioID = c.CircuitoID
        ORDER BY c.Giorno ASC, b.GranPremioID ASC, 
            CASE b.TipoPosto
                WHEN 'Paddock' THEN 1 
                WHEN 'Gradinate' THEN 2 
                WHEN 'Prato' THEN 3 
            END
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Endpoint per ottenere tutti i biglietti con info complete (per admin)
app.get('/admin/biglietti-completi', (req, res) => {
    const query = `
    SELECT 
    b.BigliettoID,
    b.GranPremioID,
    b.TipoPosto,
    b.Prezzo,
    b.Disponibilita,
    c.Nome AS NomeCircuito,
    c.Nazione,
    c.Giorno,
    CASE 
        WHEN c.Giorno < CURDATE() THEN 'passata'
        WHEN c.Giorno = CURDATE() THEN 'oggi'
        ELSE 'futura'
    END as StatoGara
FROM BigliettiF1 b
JOIN (
    SELECT CircuitoID, Nome, Nazione, Giorno
    FROM Circuiti
    WHERE (CircuitoID, Giorno) IN (
        SELECT CircuitoID, MAX(Giorno)
        FROM Circuiti
        GROUP BY CircuitoID
    )
) c ON b.GranPremioID = c.CircuitoID
ORDER BY c.Giorno ASC, b.GranPremioID ASC, 
    CASE b.TipoPosto 
        WHEN 'Paddock' THEN 1 
        WHEN 'Gradinate' THEN 2 
        WHEN 'Prato' THEN 3 
    END
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Acquista biglietti (endpoint generico)
app.post('/acquista-biglietti', (req, res) => {
    const { CartaIdentitàID, BigliettoID, Quantita, NumeroCarta } = req.body;

    if (!CartaIdentitàID || !BigliettoID || !Quantita || !NumeroCarta) {
        return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    if (NumeroCarta.length !== 9) {
        return res.status(400).json({ error: 'Il numero di carta deve essere di 9 cifre' });
    }

    // Verifica disponibilità e ottieni prezzo
    const checkQuery = `SELECT * FROM BigliettiF1 WHERE BigliettoID = ?`;

    db.query(checkQuery, [BigliettoID], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ error: 'Biglietto non trovato' });
        }

        const biglietto = results[0];

        if (biglietto.Disponibilita < Quantita) {
            return res.status(400).json({ error: 'Biglietti non sufficienti disponibili' });
        }

        const totaleSpeso = biglietto.Prezzo * Quantita;

        // Inizia transazione
        db.beginTransaction((err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Inserisci acquisto
            const insertQuery = `
                INSERT INTO AcquistiBiglietti (CartaIdentitàID, BigliettoID, Quantita, NumeroCarta, TotaleSpeso)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(insertQuery, [CartaIdentitàID, BigliettoID, Quantita, NumeroCarta, totaleSpeso], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: err.message });
                    });
                }

                // Aggiorna disponibilità
                const updateQuery = `
                    UPDATE BigliettiF1
                    SET Disponibilita = Disponibilita - ? 
                    WHERE BigliettoID = ?
                `;

                db.query(updateQuery, [Quantita, BigliettoID], (err, updateResult) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: err.message });
                        });
                    }

                    // Aggiorna numero carta utente
                    const updateUserQuery = `
                        UPDATE Utenti 
                        SET NumeroCarta = ? 
                        WHERE CartaIdentitàID = ?
                    `;

                    db.query(updateUserQuery, [NumeroCarta, CartaIdentitàID], (err, userResult) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ error: err.message });
                            });
                        }

                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ error: err.message });
                                });
                            }

                            res.json({
                                message: 'Acquisto completato con successo',
                                acquistoId: result.insertId,
                                totaleSpeso: totaleSpeso
                            });
                        });
                    });
                });
            });
        });
    });
});

// Endpoint specifico per acquisto biglietti F1
app.post('/acquista-bigliettiF1', (req, res) => {
    const { CartaIdentitàID, BigliettoID, Quantita, NumeroCarta } = req.body;

    if (!CartaIdentitàID || !BigliettoID || !Quantita || !NumeroCarta) {
        console.warn('⚠️  Campi mancanti nella richiesta');
        return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    if (NumeroCarta.length !== 9) {
        console.warn('⚠️  NumeroCarta non è di 9 cifre');
        return res.status(400).json({ error: 'Il numero di carta deve essere di 9 cifre' });
    }

    const checkQuery = `SELECT * FROM BigliettiF1 WHERE BigliettoID = ?`;

    db.query(checkQuery, [BigliettoID], (err, results) => {
        if (err) {
            console.error('❌ Errore query SELECT BigliettiF1:', err);
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            console.warn('⚠️  Biglietto non trovato con ID:', BigliettoID);
            return res.status(404).json({ error: 'Biglietto non trovato' });
        }

        const biglietto = results[0];

        if (biglietto.Disponibilita < Quantita) {
            console.warn('⚠️  Disponibilità insufficiente. Richiesta:', Quantita, 'Disponibili:', biglietto.Disponibilita);
            return res.status(400).json({ error: 'Biglietti non sufficienti disponibili' });
        }

        const totaleSpeso = biglietto.Prezzo * Quantita;

        db.beginTransaction((err) => {
            if (err) {
                console.error('❌ Errore inizializzazione transazione:', err);
                return res.status(500).json({ error: err.message });
            }

            const insertQuery = `
                INSERT INTO AcquistiBiglietti (CartaIdentitàID, BigliettoID, Quantita, NumeroCarta, TotaleSpeso)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(insertQuery, [CartaIdentitàID, BigliettoID, Quantita, NumeroCarta, totaleSpeso], (err, result) => {
                if (err) {
                    console.error('❌ Errore inserimento acquisto:', err);
                    return db.rollback(() => {
                        res.status(500).json({ error: err.message });
                    });
                }

                const updateQuery = `
                    UPDATE BigliettiF1
                    SET Disponibilita = Disponibilita - ? 
                    WHERE BigliettoID = ?
                `;

                db.query(updateQuery, [Quantita, BigliettoID], (err) => {
                    if (err) {
                        console.error('❌ Errore aggiornamento disponibilità:', err);
                        return db.rollback(() => {
                            res.status(500).json({ error: err.message });
                        });
                    }

                    const updateUserQuery = `
                        UPDATE Utenti 
                        SET NumeroCarta = ? 
                        WHERE CartaIdentitàID = ?
                    `;

                    db.query(updateUserQuery, [NumeroCarta, CartaIdentitàID], (err) => {
                        if (err) {
                            console.error('❌ Errore aggiornamento utente:', err);
                            return db.rollback(() => {
                                res.status(500).json({ error: err.message });
                            });
                        }

                        db.commit((err) => {
                            if (err) {
                                console.error('❌ Errore commit transazione:', err);
                                return db.rollback(() => {
                                    res.status(500).json({ error: err.message });
                                });
                            }
                            res.json({
                                message: 'Acquisto completato con successo',
                                acquistoId: result.insertId,
                                totaleSpeso: totaleSpeso
                            });
                        });
                    });
                });
            });
        });
    });
});

// === API ADMIN BIGLIETTI ===

// Modifica biglietto (admin)
app.put('/admin/biglietti/:id', (req, res) => {
    const { id } = req.params;
    const { TipoPosto, Prezzo, Disponibilita } = req.body;

    // Se sono forniti tutti i campi, aggiorna tutto
    if (TipoPosto !== undefined && Prezzo !== undefined && Disponibilita !== undefined) {
        const query = `
            UPDATE BigliettiF1
            SET TipoPosto = ?, Prezzo = ?, Disponibilita = ?
            WHERE BigliettoID = ?
        `;

        db.query(query, [TipoPosto, Prezzo, Disponibilita, id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Biglietto non trovato' });
            res.json({ message: 'Biglietto modificato con successo' });
        });
    }
    // Altrimenti aggiorna solo prezzo e disponibilità (per compatibilità)
    else if (Prezzo !== undefined && Disponibilita !== undefined) {
        const query = `
            UPDATE BigliettiF1
            SET Prezzo = ?, Disponibilita = ?
            WHERE BigliettoID = ?
        `;

        db.query(query, [Prezzo, Disponibilita, id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Biglietto non trovato' });
            res.json({ message: 'Biglietto modificato con successo' });
        });
    }
    else {
        return res.status(400).json({ error: 'Almeno Prezzo e Disponibilità sono obbligatori' });
    }
});

// Elimina biglietto (admin)
app.delete('/admin/biglietti/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM BigliettiF1 WHERE BigliettoID = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Biglietto non trovato' });
        res.json({ message: 'Biglietto eliminato con successo' });
    });
});

// === API ENDPOINTS F1 DATA ===

// Classifica Piloti 2025
app.get('/ClassificaPiloti2025', (req, res) => {
    const query = `
        SELECT cp.*, p.Nome, p.Cognome, p.Nazionalita, c.Nome AS NomeCostruttore
        FROM ClassificaPiloti2025 cp
        JOIN Piloti p ON cp.PilotaID = p.PilotaID
        JOIN Costruttori c ON cp.CostruttoreID = c.CostruttoreID
        ORDER BY cp.Posizione ASC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Classifica Costruttori 2025
app.get('/ClassificaCostruttori2025', (req, res) => {
    const query = `
        SELECT c2025.ClassificaCostruttoriID, c2025.CostruttoreID, c2025.Posizione, c2025.PuntiTotali, c2025.Vittorie,
               c.Nome AS NomeCostruttore, c.Nazionalita
        FROM ClassificaCostruttori2025 c2025
        JOIN Costruttori c ON c2025.CostruttoreID = c.CostruttoreID
        ORDER BY c2025.Posizione ASC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Tutti i Piloti
app.get('/Piloti', (req, res) => {
    db.query('SELECT * FROM Piloti ORDER BY Cognome, Nome', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Tutti i Costruttori
app.get('/Costruttori', (req, res) => {
    db.query('SELECT * FROM Costruttori ORDER BY Nome', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Risultati Gare - con filtri
app.get('/RisultatiGare', (req, res) => {
    const circuitoFiltro = req.query.circuito;

    let query;
    let queryParams = [];

    if (circuitoFiltro) {
        query = `
        SELECT rg.*, 
            p.Nome AS NomePilota, 
            p.Cognome, 
            p.Nazionalita AS NazionalitaPilota,
            c.Nome AS Team, 
            cir.Nome AS NomeCircuito, 
            cir.Nazione AS Nazione, 
            cir.Giorno AS Data     
        FROM RisultatiGare rg
        JOIN Piloti p ON rg.PilotaID = p.PilotaID
        JOIN Costruttori c ON rg.CostruttoreID = c.CostruttoreID
        JOIN (
            SELECT * 
            FROM Circuiti
            WHERE (CircuitoID, Giorno) IN (
                SELECT CircuitoID, MAX(Giorno)
                FROM Circuiti
                GROUP BY CircuitoID
            )
        ) AS cir ON rg.CircuitoID = cir.CircuitoID
        WHERE rg.CircuitoID = ?
        ORDER BY 
            CASE WHEN rg.PosizioneFinale IS NULL THEN 1 ELSE 0 END,
            rg.PosizioneFinale ASC
        `;
        queryParams = [circuitoFiltro];
    } else {
        query = `
            SELECT rg.*, 
                   p.Nome AS NomePilota, 
                   p.Cognome, 
                   p.Nazionalita AS NazionalitaPilota,
                   c.Nome AS Team, 
                   cir.Nome AS NomeCircuito, 
                   cir.Nazione AS Nazione, 
                   cir.Giorno AS Data     
            FROM RisultatiGare rg
            JOIN Piloti p ON rg.PilotaID = p.PilotaID
            JOIN Costruttori c ON rg.CostruttoreID = c.CostruttoreID
            JOIN (
                SELECT * 
                FROM Circuiti
                WHERE (CircuitoID, Giorno) IN (
                    SELECT CircuitoID, MAX(Giorno)
                    FROM Circuiti
                    GROUP BY CircuitoID
                )
            ) AS cir ON rg.CircuitoID = cir.CircuitoID
            WHERE rg.PosizioneFinale = 1
            ORDER BY cir.Giorno ASC
        `;
    }

    db.query(query, queryParams, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Circuiti disponibili
app.get('/Circuiti', (req, res) => {
    const query = `
        SELECT DISTINCT c.CircuitoID, c.Nome, c.Nazione, c.Giorno
        FROM Circuiti c
        WHERE (c.CircuitoID, c.Giorno) IN (
            SELECT CircuitoID, MAX(Giorno)
            FROM Circuiti
            GROUP BY CircuitoID
        )
        ORDER BY c.CircuitoID
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Middleware per gestire errori 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint non trovato' });
});

// Middleware per gestire errori generali
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Errore interno del server' });
});

app.listen(3000, () => {
    console.log('✅ Server Node.js in ascolto su http://localhost:3000');
});
