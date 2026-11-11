# Bewertungsapp – Hava Tasueva

Klasse: 4aAPC

## Setup

Backend:
```
cd backend
npm install
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm start
```

Frontend:
```
cd frontend
npm install
ionic serve
```

Eigene `config/config.json` lokal aus `config/config.example.json` ableiten, nicht committen.

## Einheit 1: Installation

- [X] Screenshot Toolchain (`node --version`, `ionic --version`, laufendes DB-Tool bzw. Docker-Container)
- [X] Antworten auf die vier Verständnisfragen: `docs/screenshots/einheit1-fragen.md`

## Einheit 2: Datenmodell anlegen

- [X] Ausgefüllte Planungsvorlage: `docs/diagramm/planungsvorlage.html`
- [X] Verwendete `model:generate`-Befehle dokumentiert
- [X] Screenshot der angelegten Tabellen im DB-Tool: `docs/screenshots/`

## Einheit 3: Assoziationen und weitere Modelle

- [X] Alle Modelle (Team, Member, Project, Criterion, Juror, Evaluation) mit ausgefüllten `associate`-Methoden
- [X] Unique-Constraint auf (projectId, criterionId, jurorId) bei Evaluation
- [X] Mindestens ein Seeder mit Testdaten

## Einheit 4: Backend-Routen

- [X] CRUD für Team und Project
- [X] POST-Route für Evaluation inkl. Validierung
- [X] Aggregations-Route: Durchschnitt der Punktzahl pro Projekt und Kriterium
- [X] Kurze Endpunkt-Dokumentation (Methode, Pfad, Body, Rückgabe) unten in diesem README oder in `docs/`

## Einheit 5: Postman-Test

- [ ] Collection: `docs/postman/bewertungsapp.postman_collection.json`
- [ ] Environment: `docs/postman/bewertungsapp.postman_environment.json`
- [ ] Mindestens zwei dokumentierte Negativtests
- [ ] Testbericht: `docs/postman/testbericht.md`

## Einheit 6: IONIC-Frontend

- [X] Projektliste mit Team-Zuordnung
- [X] Detailansicht eines Projekts mit bisherigen Bewertungen
- [X] API-Service vollständig an eigenes Backend angebunden

Umsetzung (Ionic 9 / Angular 22, Standalone-Komponenten, benötigt Node ≥ 22.22.3, getestet mit Node 24):

- API-Service: `frontend/src/app/services/api.service.ts` (Teams, Projekte inkl. Statistik, Bewertungen), Backend-URL in `src/environments/environment.ts`
- Listenansicht `/projekte`: `frontend/src/app/pages/projekte-liste/` – alle Projekte mit Team-Badge, Pull-to-Refresh
- Detailansicht `/projekt-detail/:id`: `frontend/src/app/pages/projekt-detail/` – Projektdaten, Team, Durchschnitt pro Kriterium und alle bisherigen Bewertungen (Kriterium, Juror, Punkte, Kommentar)
- Demodaten: Seeder `20261028080000-demo-teams-projekte.js` (2 Teams, 2 Projekte, 2 Juroren, 5 Bewertungen)

## Einheit 7: Login und Endabgabe

- [ ] Bewertungsformular (Projekt, Kriterium, Punktzahl, Kommentar) mit Validierung
- [ ] Auswertungsseite mit Durchschnittswerten
- [ ] Juror-Login, Token-Storage mit `@capacitor/preferences`
- [ ] Nachweis: geschützte Route liefert ohne Token 401, mit gültigem Token die erwartete Antwort

## Endpunkt-Dokumentation (laufend ergänzen)

Basis-URL: `http://localhost:3000`, alle Bodies als JSON (`Content-Type: application/json`).

### Teams (`routes/teams.js`)

| Methode | Pfad | Body | Rückgabe |
|---|---|---|---|
| GET | /teams | – | 200, Liste aller Teams inkl. `Members` und `Projects` |
| GET | /teams/:id | – | 200, ein Team inkl. `Members` und `Projects` · 404 wenn nicht vorhanden |
| POST | /teams | `{ "name": "Team A", "klasse": "4aAPC" }` (`name` Pflicht) | 201, angelegtes Team · 400 wenn `name` fehlt |
| PUT | /teams/:id | `{ "name"?, "klasse"? }` | 200, aktualisiertes Team · 400 wenn `name` leer · 404 wenn nicht vorhanden |
| DELETE | /teams/:id | – | 204 · 404 wenn nicht vorhanden · 409 wenn das Team noch Projekte hat |

### Projekte (`routes/projects.js`)

| Methode | Pfad | Body | Rückgabe |
|---|---|---|---|
| GET | /projects | – | 200, Liste aller Projekte inkl. `Team` |
| GET | /projects/:id | – | 200, ein Projekt inkl. `Team` und `Evaluations` (mit `Criterion` und `Juror`) · 404 |
| POST | /projects | `{ "titel": "Bewertungsapp", "beschreibung": "...", "praesentiertAm": "2026-11-12T10:00:00Z", "teamId": 1 }` (`titel`, `teamId` Pflicht) | 201, angelegtes Projekt · 400 wenn Pflichtfeld fehlt · 404 wenn `teamId` nicht existiert |
| PUT | /projects/:id | `{ "titel"?, "beschreibung"?, "praesentiertAm"?, "teamId"? }` | 200, aktualisiertes Projekt · 400 wenn `titel` leer · 404 wenn Projekt oder `teamId` nicht existiert |
| DELETE | /projects/:id | – | 204, löscht auch die Bewertungen des Projekts · 404 |
| GET | /projects/:id/statistik | – | 200, Durchschnitt der Punktzahl pro Kriterium (siehe unten) · 404 |

Beispielantwort `GET /projects/1/statistik`:

```json
{
  "projectId": 1,
  "titel": "Bewertungsapp",
  "kriterien": [
    { "criterionId": 1, "kriterium": "Inhalt", "maxScore": 10, "durchschnitt": 7.5, "anzahlBewertungen": 2 },
    { "criterionId": 3, "kriterium": "Technische Umsetzung", "maxScore": 10, "durchschnitt": 9, "anzahlBewertungen": 2 }
  ]
}
```

Umsetzung mit `fn('AVG', col('score'))` und `group: ['criterionId', ...]`, erzeugtes SQL:
`SELECT criterionId, Criterion.name, AVG(score), COUNT(Evaluation.id) FROM Evaluations LEFT JOIN Criteria ... WHERE projectId = 1 GROUP BY criterionId, ...`

### Bewertungen (`routes/evaluations.js`)

| Methode | Pfad | Body | Rückgabe |
|---|---|---|---|
| GET | /evaluations | – (optional Query `?projectId=1`) | 200, Liste der Bewertungen inkl. `Project`, `Criterion`, `Juror` |
| POST | /evaluations | `{ "score": 8, "comment": "Gut", "projectId": 1, "criterionId": 1, "jurorId": 1 }` (alle außer `comment` Pflicht) | 201, gespeicherte Bewertung (siehe Fehlerfälle unten) |

### Statuscodes und Fehlermeldungen

Alle Fehler kommen als `{ "error": "<Meldung>" }` zurück.

| Code | Wann |
|---|---|
| 400 | Pflichtfeld fehlt/leer, `score` keine ganze Zahl oder außerhalb `0..maxScore` des Kriteriums, ungültiges JSON |
| 404 | ID im Pfad existiert nicht, oder eine referenzierte ID im Body (`teamId`, `projectId`, `criterionId`, `jurorId`) existiert nicht, oder unbekannte Route |
| 409 | Juror hat dieses Projekt für dieses Kriterium schon bewertet (Unique-Constraint), oder Team mit Projekten soll gelöscht werden |
| 500 | Unerwarteter Server-/Datenbankfehler |

## Bekannte Einschränkungen

<hier eintragen, was noch fehlt oder bekannt fehlerhaft ist>