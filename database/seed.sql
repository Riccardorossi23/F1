-- ============================================================
--  SEED DATA - dati di esempio pronti all'uso
--  Eseguire dopo schema.sql:
--      mysql -u root -p f1 < database/seed.sql
--
--  Nota: se preferisci dati F1 sempre aggiornati invece di
--  questo set statico, salta questo file e lancia
--  "npm run sync-f1" dentro /server (vedi README).
-- ============================================================

USE f1;

-- ------------------------------------------------------------
-- COSTRUTTORI
-- ------------------------------------------------------------
INSERT INTO Costruttori (CostruttoreID, Nome, Nazionalita, CodiceEsterno) VALUES
(1,  'Red Bull Racing', 'Austria',        'red_bull'),
(2,  'Ferrari',         'Italia',         'ferrari'),
(3,  'Mercedes',        'Germania',       'mercedes'),
(4,  'McLaren',         'Regno Unito',    'mclaren'),
(5,  'Aston Martin',    'Regno Unito',    'aston_martin'),
(6,  'Alpine',          'Francia',        'alpine'),
(7,  'Williams',        'Regno Unito',    'williams'),
(8,  'Racing Bulls',    'Italia',         'rb'),
(9,  'Haas',            'Stati Uniti',    'haas'),
(10, 'Kick Sauber',     'Svizzera',       'sauber')
ON DUPLICATE KEY UPDATE Nome = VALUES(Nome);

-- ------------------------------------------------------------
-- PILOTI (2 per team)
-- ------------------------------------------------------------
INSERT INTO Piloti (PilotaID, Nome, Cognome, Nazionalita, Numero, CodiceEsterno) VALUES
(1,  'Max',        'Verstappen', 'Paesi Bassi',   1,  'max_verstappen'),
(2,  'Yuki',       'Tsunoda',    'Giappone',      22, 'tsunoda'),
(3,  'Charles',    'Leclerc',    'Monaco',        16, 'leclerc'),
(4,  'Lewis',      'Hamilton',   'Regno Unito',   44, 'hamilton'),
(5,  'George',     'Russell',    'Regno Unito',   63, 'russell'),
(6,  'Kimi',       'Antonelli',  'Italia',        12, 'antonelli'),
(7,  'Lando',      'Norris',     'Regno Unito',   4,  'norris'),
(8,  'Oscar',      'Piastri',    'Australia',     81, 'piastri'),
(9,  'Fernando',   'Alonso',     'Spagna',        14, 'alonso'),
(10, 'Lance',      'Stroll',     'Canada',        18, 'stroll'),
(11, 'Pierre',     'Gasly',      'Francia',       10, 'gasly'),
(12, 'Franco',     'Colapinto',  'Argentina',     43, 'colapinto'),
(13, 'Alexander',  'Albon',      'Thailandia',    23, 'albon'),
(14, 'Carlos',     'Sainz',      'Spagna',        55, 'sainz'),
(15, 'Liam',       'Lawson',     'Nuova Zelanda', 30, 'lawson'),
(16, 'Isack',      'Hadjar',     'Francia',       6,  'hadjar'),
(17, 'Esteban',    'Ocon',       'Francia',       31, 'ocon'),
(18, 'Oliver',     'Bearman',    'Regno Unito',   87, 'bearman'),
(19, 'Nico',       'Hulkenberg', 'Germania',      27, 'hulkenberg'),
(20, 'Gabriel',    'Bortoleto',  'Brasile',       5,  'bortoleto')
ON DUPLICATE KEY UPDATE Nome = VALUES(Nome);

-- ------------------------------------------------------------
-- CLASSIFICA COSTRUTTORI 2025 (ordine di esempio)
-- ------------------------------------------------------------
INSERT INTO ClassificaCostruttori2025 (CostruttoreID, Posizione, PuntiTotali, Vittorie) VALUES
(4,  1, 640.0, 8),
(2,  2, 505.0, 4),
(1,  3, 480.0, 5),
(3,  4, 410.0, 2),
(5,  5, 120.0, 0),
(8,  6, 95.0,  0),
(6,  7, 65.0,  0),
(7,  8, 55.0,  0),
(9,  9, 40.0,  0),
(10, 10, 20.0, 0)
ON DUPLICATE KEY UPDATE Posizione = VALUES(Posizione);

-- ------------------------------------------------------------
-- CLASSIFICA PILOTI 2025 (ordine di esempio)
-- ------------------------------------------------------------
INSERT INTO ClassificaPiloti2025 (PilotaID, CostruttoreID, Posizione, PuntiTotali, Vittorie) VALUES
(7,  4, 1,  350.0, 5),
(8,  4, 2,  290.0, 3),
(1,  1, 3,  280.0, 4),
(3,  2, 4,  260.0, 2),
(14, 2, 5,  245.0, 2),
(5,  3, 6,  220.0, 1),
(6,  3, 7,  190.0, 1),
(9,  5, 8,  70.0,  0),
(10, 5, 9,  50.0,  0),
(11, 8, 10, 48.0,  0),
(2,  1, 11, 45.0,  0),
(16, 8, 12, 40.0,  0),
(4,  3, 13, 35.0,  0),
(17, 6, 14, 34.0,  0),
(12, 6, 15, 31.0,  0),
(13, 7, 16, 30.0,  0),
(15, 7, 17, 25.0,  0),
(19, 9, 18, 22.0,  0),
(18, 9, 19, 18.0,  0),
(20, 10, 20, 12.0, 0)
ON DUPLICATE KEY UPDATE Posizione = VALUES(Posizione);

-- ------------------------------------------------------------
-- CIRCUITI 2025 (5 tappe di esempio, edizione più recente)
-- ------------------------------------------------------------
INSERT INTO Circuiti (CircuitoID, Nome, Nazione, Giorno, CodiceEsterno) VALUES
(1, 'Albert Park Grand Prix Circuit',  'Australia', '2025-03-16', 'albert_park'),
(2, 'Bahrain International Circuit',   'Bahrain',   '2025-04-13', 'bahrain'),
(3, 'Autodromo Enzo e Dino Ferrari',   'Italia',    '2025-05-18', 'imola'),
(4, 'Circuit de Monaco',               'Monaco',    '2025-05-25', 'monaco'),
(5, 'Autodromo Nazionale di Monza',    'Italia',    '2025-09-07', 'monza')
ON DUPLICATE KEY UPDATE Nome = VALUES(Nome);

-- ------------------------------------------------------------
-- RISULTATI GARE (podio di esempio per ogni circuito sopra)
-- ------------------------------------------------------------
INSERT INTO RisultatiGare (PilotaID, CostruttoreID, CircuitoID, PosizioneFinale, PuntiOttenuti) VALUES
(7, 4, 1, 1, 25.0), (1, 1, 1, 2, 18.0), (8, 4, 1, 3, 15.0),
(1, 1, 2, 1, 25.0), (7, 4, 2, 2, 18.0), (3, 2, 2, 3, 15.0),
(8, 4, 3, 1, 25.0), (7, 4, 3, 2, 18.0), (5, 3, 3, 3, 15.0),
(3, 2, 4, 1, 25.0), (14, 2, 4, 2, 18.0), (7, 4, 4, 3, 15.0),
(7, 4, 5, 1, 25.0), (1, 1, 5, 2, 18.0), (3, 2, 5, 3, 15.0);

-- ------------------------------------------------------------
-- UTENTE DI TEST (login: mario.rossi@example.com / password123)
-- L'utente ADMIN è già gestito via codice in server.js, non va
-- inserito qui.
-- ------------------------------------------------------------
INSERT INTO Utenti (`CartaIdentitàID`, Nome, Cognome, Email, Password, Ruolo) VALUES
('CI0000001', 'Mario', 'Rossi', 'mario.rossi@example.com', 'password123', 'user')
ON DUPLICATE KEY UPDATE Nome = VALUES(Nome);

-- ------------------------------------------------------------
-- BIGLIETTI DI ESEMPIO per Monza (CircuitoID = 5)
-- ------------------------------------------------------------
INSERT INTO BigliettiF1 (GranPremioID, TipoPosto, Prezzo, Disponibilita) VALUES
(5, 'Paddock',   1200.00, 20),
(5, 'Gradinate',  450.00, 150),
(5, 'Prato',      120.00, 500),
(4, 'Paddock',   2500.00, 10),
(4, 'Gradinate', 900.00,  80),
(4, 'Prato',     300.00,  200);
