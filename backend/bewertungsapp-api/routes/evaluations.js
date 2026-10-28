const express = require('express');
const router = express.Router();
const db = require('../models');
const { Evaluation, Project, Criterion, Juror } = db;

// alle Bewertungen, optional gefiltert per ?projectId=
router.get('/', async (req, res) => {
  const where = {};
  if (req.query.projectId) where.projectId = req.query.projectId;
  const evaluations = await Evaluation.findAll({ where, include: [Project, Criterion, Juror] });
  res.json(evaluations);
});

// neue Bewertung abspeichern
router.post('/', async (req, res) => {
  const { score, comment, projectId, criterionId, jurorId } = req.body ?? {};
  if (score === undefined || score === null || !projectId || !criterionId || !jurorId) {
    return res.status(400).json({
      error: 'score, projectId, criterionId und jurorId sind Pflichtfelder'
    });
  }
  if (!Number.isInteger(score)) {
    return res.status(400).json({ error: 'score muss eine ganze Zahl sein' });
  }

  const [project, criterion, juror] = await Promise.all([
    Project.findByPk(projectId),
    Criterion.findByPk(criterionId),
    Juror.findByPk(jurorId)
  ]);
  if (!project) return res.status(404).json({ error: `Projekt mit id ${projectId} nicht gefunden` });
  if (!criterion) return res.status(404).json({ error: `Kriterium mit id ${criterionId} nicht gefunden` });
  if (!juror) return res.status(404).json({ error: `Juror mit id ${jurorId} nicht gefunden` });

  if (score < 0 || score > criterion.maxScore) {
    return res.status(400).json({
      error: `score muss zwischen 0 und ${criterion.maxScore} liegen`
    });
  }

  const vorhanden = await Evaluation.findOne({ where: { projectId, criterionId, jurorId } });
  if (vorhanden) {
    return res.status(409).json({
      error: 'Dieser Juror hat dieses Projekt für dieses Kriterium bereits bewertet'
    });
  }

  const evaluation = await Evaluation.create({ score, comment, projectId, criterionId, jurorId });
  res.status(201).json(evaluation);
});

module.exports = router;
