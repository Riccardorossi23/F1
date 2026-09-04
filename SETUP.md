# Guida all'installazione — Progetto F1

Questa guida spiega come far partire il progetto da zero su un'altra
macchina, con database già pronto (niente più `Errore accesso negato`
o tabelle mancanti).

## Opzione rapida: Docker (consigliata se qualcuno deve solo "provare" il sito)

Se hai Docker installato, non serve installare né Node né MySQL:
tutto parte con un comando solo, e il database viene creato e
popolato in automatico al primo avvio.

```bash
docker compose up --build
```

Poi apri **http://localhost:3000**. Per fermare tutto: `Ctrl+C` e poi
`docker compose down` (aggiungi `-v` se vuoi anche cancellare i dati
del database e ripartire da zero al prossimo avvio).

Questa è l'opzione più adatta se metti il link del repo nel CV: chi
lo valuta deve solo avere Docker Desktop e lanciare un comando,
senza configurare nulla a mano. Salta pure alle sezioni successive
se preferisci invece l'installazione manuale (utile in fase di
sviluppo, per modificare il codice).

## Installazione manuale

## 1. Requisiti

- Node.js 18 o superiore
- MySQL (o MariaDB) installato e avviato

## 2. Copiare i file nel progetto

Copia le cartelle/file di questo pacchetto dentro il repository
`F1`, mantenendo la struttura:

```
F1/
├── database/
│   ├── schema.sql      <-- nuovo
│   └── seed.sql        <-- nuovo
├── server/
│   ├── .env.example    <-- nuovo
│   ├── sync-f1-data.js <-- nuovo
│   ├── package.json    <-- sostituito
│   └── server.js       <-- sostituito (usa variabili d'ambiente)
├── public/              (invariato)
└── ...
```

## 3. Creare il database

```bash
mysql -u root -p < database/schema.sql
```

Questo crea il database `f1` e tutte le tabelle usate dal sito
(Utenti, BigliettiF1, AcquistiBiglietti, Piloti, Costruttori,
Circuiti, ClassificaPiloti2025, ClassificaCostruttori2025,
RisultatiGare).

## 4. Popolare i dati — due strade possibili

### Strada A — Dati statici di esempio (più semplice, sempre offline)

```bash
mysql -u root -p f1 < database/seed.sql
```

Inserisce 10 team, 20 piloti, classifiche e alcuni Gran Premi/biglietti
di esempio: il sito è subito utilizzabile, senza bisogno di internet.

### Strada B — Dati F1 reali via API gratuita (aggiornati automaticamente)

Al posto (o oltre) di `seed.sql`, puoi popolare Piloti, Costruttori,
Circuiti, Classifiche e RisultatiGare con i dati reali della stagione,
usando l'API pubblica e **gratuita** [Jolpica-F1](https://github.com/jolpica/jolpica-f1)
(il successore mantenuto della vecchia Ergast API, nessuna API key richiesta):

```bash
cd server
npm install
npm run sync-f1            # sincronizza la stagione corrente
npm run sync-f1 -- 2024    # oppure una stagione specifica
```

Puoi rilanciare il comando quando vuoi per aggiornare classifiche e
risultati (es. dopo ogni Gran Premio). Lo script non tocca Utenti,
BigliettiF1 e AcquistiBiglietti: quelle restano gestite dal sito.

> Nota: le tabelle Piloti/Costruttori/Circuiti hanno una colonna
> `CodiceEsterno` che collega ogni riga all'id usato dall'API,
> in modo che rilanciare la sincronizzazione aggiorni le righe
> esistenti invece di duplicarle.

## 5. Configurare le credenziali del database

```bash
cd server
cp .env.example .env
```

Apri `.env` e inserisci le tue credenziali MySQL:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=la_tua_password
DB_NAME=f1
PORT=3000
```

Se non crei il file `.env`, il server usa `root` senza password su
`localhost`, database `f1` — utile in locale ma da configurare per
qualunque altro ambiente.

## 6. Installare le dipendenze e avviare il server

```bash
cd server
npm install
npm start
```

Il sito sarà raggiungibile su `http://localhost:3000` (o sulla porta
scelta in `.env`).

## Login di prova

- **Admin**: `admin@f1.com` / `admin1234` (gestito via codice, non nel DB)
- **Utente di esempio** (solo se hai eseguito `seed.sql`):
  `mario.rossi@example.com` / `password123`

## Nota sulla sicurezza

Le password degli utenti sono salvate in chiaro nella tabella
`Utenti`, così come nel codice originale del progetto. Va bene per un
progetto scolastico/dimostrativo, ma **non va usato in produzione**:
per un sito reale andrebbero hashate (es. con `bcrypt`) prima di
salvarle e confrontarle.
