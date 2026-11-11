const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./models');

const teamsRouter = require('./routes/teams');
const projectsRouter = require('./routes/projects');
const evaluationsRouter = require('./routes/evaluations');

//Server gestartet
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/teams', teamsRouter);
app.use('/projects', projectsRouter);
app.use('/evaluations', evaluationsRouter);

// unbekannte Route
app.use((req, res) => {
  res.status(404).json({ error: 'Route nicht gefunden' });
});

// zentrale Fehlerbehandlung (Express 5 leitet Fehler aus async-Handlern automatisch hierher)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Ungültiges JSON im Request-Body' });
  }
  console.error(err);
  res.status(500).json({ error: 'Interner Serverfehler' });
});

db.sequelize.authenticate()
  .then(() => {
    app.listen(PORT, () => console.log(`API läuft auf http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Keine Verbindung zur Datenbank:', err.message);
    process.exit(1);
  });
