-- ============================================================
--  SCHEMA DATABASE "f1"
--  Progetto: Riccardorossi23/F1
--
--  Questo file crea tutte le tabelle usate da server/server.js.
--  Eseguirlo UNA VOLTA su MySQL prima di avviare il server:
--
--      mysql -u root -p < database/schema.sql
--
--  Poi (facoltativo, per avere subito dei dati di prova):
--
--      mysql -u root -p f1 < database/seed.sql
--
--  In alternativa ai dati statici di seed.sql, puoi popolare le
--  tabelle "F1 Data" (Piloti, Costruttori, Circuiti, Classifiche,
--  RisultatiGare) con dati reali e aggiornati usando l'API
--  gratuita Jolpica (successore di Ergast):
--
--      cd server
--      npm run sync-f1
--
--  Vedi server/sync-f1-data.js e il README per i dettagli.
-- ============================================================

CREATE DATABASE IF NOT EXISTS f1
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE f1;

-- ------------------------------------------------------------
-- UTENTI: account dei clienti che acquistano i biglietti.
-- L'admin (admin@f1.com / admin1234) è gestito via codice in
-- server.js e non deve essere inserito qui.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Utenti (
    `CartaIdentitàID`  VARCHAR(20)  NOT NULL,
    Nome               VARCHAR(100) NOT NULL,
    Cognome            VARCHAR(100) NOT NULL,
    Email              VARCHAR(150) NOT NULL,
    Password           VARCHAR(255) NOT NULL,
    DataRegistrazione  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Ruolo              VARCHAR(20)  NOT NULL DEFAULT 'user',
    NumeroCarta        VARCHAR(9)   NULL,
    PRIMARY KEY (`CartaIdentitàID`),
    UNIQUE KEY uq_utenti_email (Email),
    UNIQUE KEY uq_utenti_numerocarta (NumeroCarta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- CIRCUITI: un Gran Premio (CircuitoID) può comparire più volte
-- con Giorno diverso (una riga per ogni edizione/anno). Il
-- server sceglie sempre l'edizione più recente per ogni
-- CircuitoID (MAX(Giorno)), quindi qui NON mettiamo un vincolo
-- di FK a singola colonna su CircuitoID dalle altre tabelle.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Circuiti (
    RowID       INT          NOT NULL AUTO_INCREMENT,
    CircuitoID  INT          NOT NULL,
    Nome        VARCHAR(150) NOT NULL,
    Nazione     VARCHAR(100) NOT NULL,
    Giorno      DATE         NOT NULL,
    CodiceEsterno VARCHAR(60) NULL COMMENT 'id circuito su Jolpica/Ergast, usato dallo script di sync',
    PRIMARY KEY (RowID),
    UNIQUE KEY uq_circuiti_id_giorno (CircuitoID, Giorno),
    KEY idx_circuiti_id (CircuitoID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- COSTRUTTORI (team / scuderie)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Costruttori (
    CostruttoreID INT          NOT NULL AUTO_INCREMENT,
    Nome          VARCHAR(100) NOT NULL,
    Nazionalita   VARCHAR(100) NOT NULL,
    CodiceEsterno VARCHAR(60)  NULL COMMENT 'constructorId su Jolpica/Ergast',
    PRIMARY KEY (CostruttoreID),
    UNIQUE KEY uq_costruttori_nome (Nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- PILOTI
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Piloti (
    PilotaID      INT          NOT NULL AUTO_INCREMENT,
    Nome          VARCHAR(100) NOT NULL,
    Cognome       VARCHAR(100) NOT NULL,
    Nazionalita   VARCHAR(100) NOT NULL,
    Numero        INT          NULL,
    DataNascita   DATE         NULL,
    CodiceEsterno VARCHAR(60)  NULL COMMENT 'driverId su Jolpica/Ergast',
    PRIMARY KEY (PilotaID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- CLASSIFICA PILOTI 2025
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ClassificaPiloti2025 (
    ClassificaPilotiID INT           NOT NULL AUTO_INCREMENT,
    PilotaID           INT           NOT NULL,
    CostruttoreID      INT           NOT NULL,
    Posizione          INT           NULL,
    PuntiTotali        DECIMAL(6,2)  NOT NULL DEFAULT 0,
    Vittorie           INT           NOT NULL DEFAULT 0,
    PRIMARY KEY (ClassificaPilotiID),
    UNIQUE KEY uq_classificapiloti_pilota (PilotaID),
    CONSTRAINT fk_cp_pilota FOREIGN KEY (PilotaID) REFERENCES Piloti(PilotaID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cp_costruttore FOREIGN KEY (CostruttoreID) REFERENCES Costruttori(CostruttoreID)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- CLASSIFICA COSTRUTTORI 2025
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ClassificaCostruttori2025 (
    ClassificaCostruttoriID INT          NOT NULL AUTO_INCREMENT,
    CostruttoreID           INT          NOT NULL,
    Posizione               INT          NULL,
    PuntiTotali             DECIMAL(6,2) NOT NULL DEFAULT 0,
    Vittorie                INT          NOT NULL DEFAULT 0,
    PRIMARY KEY (ClassificaCostruttoriID),
    UNIQUE KEY uq_classificacost_costruttore (CostruttoreID),
    CONSTRAINT fk_cc_costruttore FOREIGN KEY (CostruttoreID) REFERENCES Costruttori(CostruttoreID)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- RISULTATI GARE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS RisultatiGare (
    RisultatoID     INT           NOT NULL AUTO_INCREMENT,
    PilotaID        INT           NOT NULL,
    CostruttoreID   INT           NOT NULL,
    CircuitoID      INT           NOT NULL,
    PosizioneFinale INT           NULL COMMENT 'NULL = ritirato / DNF',
    PuntiOttenuti   DECIMAL(5,2)  NOT NULL DEFAULT 0,
    PRIMARY KEY (RisultatoID),
    KEY idx_rg_circuito (CircuitoID),
    CONSTRAINT fk_rg_pilota FOREIGN KEY (PilotaID) REFERENCES Piloti(PilotaID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rg_costruttore FOREIGN KEY (CostruttoreID) REFERENCES Costruttori(CostruttoreID)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- BIGLIETTI F1 (posti in vendita per un dato Gran Premio)
-- GranPremioID punta concettualmente a Circuiti.CircuitoID
-- (edizione più recente), coerente con le query di server.js.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS BigliettiF1 (
    BigliettoID   INT                                     NOT NULL AUTO_INCREMENT,
    GranPremioID  INT                                     NOT NULL,
    TipoPosto     ENUM('Paddock','Gradinate','Prato')     NOT NULL,
    Prezzo        DECIMAL(8,2)                            NOT NULL,
    Disponibilita INT                                     NOT NULL DEFAULT 0,
    PRIMARY KEY (BigliettoID),
    KEY idx_biglietti_granpremio (GranPremioID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- ACQUISTI BIGLIETTI
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS AcquistiBiglietti (
    AcquistoID       INT           NOT NULL AUTO_INCREMENT,
    `CartaIdentitàID`  VARCHAR(20) NOT NULL,
    BigliettoID      INT           NOT NULL,
    Quantita         INT           NOT NULL,
    NumeroCarta      VARCHAR(9)    NOT NULL,
    TotaleSpeso      DECIMAL(10,2) NOT NULL,
    DataAcquisto     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (AcquistoID),
    CONSTRAINT fk_ab_utente FOREIGN KEY (`CartaIdentitàID`) REFERENCES Utenti(`CartaIdentitàID`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ab_biglietto FOREIGN KEY (BigliettoID) REFERENCES BigliettiF1(BigliettoID)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
