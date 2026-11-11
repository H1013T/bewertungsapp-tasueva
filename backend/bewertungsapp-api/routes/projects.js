const express = require('express');
const router = express.Router();
const { fn, col } = require('sequelize');
const db = require('../models');
const { Project, Team, Evaluation, Criterion, Juror } = db;
///CRUD

// alle Projekte inkl. Team
router.get('/', async (req, res) => {
  const projects = await Project.findAll({ include: Team });
  res.json(projects);
});

// ein Projekt per ID inkl. Team und Bewertungen
router.get('/:id', async (req, res) => {
  const project = await Project.findByPk(req.params.id, {
    include: [Team, { model: Evaluation, include: [Criterion, { model: Juror, attributes: ['id', 'name'] }] }]
  });
  if (!project) return res.status(404).json({ error: 'Projekt nicht gefunden' });
  res.json(project);
});

// Durchschnittspunktzahl eines Projekts, gruppiert nach Kriterium
router.get('/:id/statistik', async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ error: 'Projekt nicht gefunden' });

  const ergebnis = await Evaluation.findAll({
    where: { projectId: project.id },
    attributes: [
      'criterionId',
      [col('Criterion.name'), 'kriterium'],
      [col('Criterion.maxScore'), 'maxScore'],
      [fn('AVG', col('score')), 'durchschnitt'],
      [fn('COUNT', col('Evaluation.id')), 'anzahlBewertungen']
    ],
    include: { model: Criterion, attributes: [] },
    group: ['criterionId', 'Criterion.id', 'Criterion.name', 'Criterion.maxScore'],
    raw: true
  });

  res.json({
    projectId: project.id,
    titel: project.titel,
    kriterien: ergebnis.map(e => ({
      criterionId: e.criterionId,
      kriterium: e.kriterium,
      maxScore: e.maxScore,
      durchschnitt: Number(e.durchschnitt),
      anzahlBewertungen: Number(e.anzahlBewertungen)
    }))
  });
});

// neues Projekt anlegen
router.post('/', async (req, res) => {
  const { titel, beschreibung, praesentiertAm, teamId } = req.body ?? {};
  if (!titel || !teamId) {
    return res.status(400).json({ error: 'titel und teamId sind Pflichtfelder' });
  }
  const team = await Team.findByPk(teamId);
  if (!team) return res.status(404).json({ error: `Team mit id ${teamId} nicht gefunden` });
  const project = await Project.create({ titel, beschreibung, praesentiertAm, teamId });
  res.status(201).json(project);
});

// Projekt aktualisieren
router.put('/:id', async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ error: 'Projekt nicht gefunden' });
  const { titel, beschreibung, praesentiertAm, teamId } = req.body ?? {};
  if (titel !== undefined && !titel) {
    return res.status(400).json({ error: 'titel darf nicht leer sein' });
  }
  if (teamId !== undefined) {
    const team = await Team.findByPk(teamId);
    if (!team) return res.status(404).json({ error: `Team mit id ${teamId} nicht gefunden` });
  }
  await project.update({ titel, beschreibung, praesentiertAm, teamId });
  res.json(project);
});

// Projekt löschen (inkl. zugehöriger Bewertungen)
router.delete('/:id', async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ error: 'Projekt nicht gefunden' });
  await db.sequelize.transaction(async (t) => {
    await Evaluation.destroy({ where: { projectId: project.id }, transaction: t });
    await project.destroy({ transaction: t });
  });
  res.status(204).send();
});

module.exports = router;
