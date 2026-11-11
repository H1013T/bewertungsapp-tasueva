'use strict';
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('Teams', [
      { name: 'Team Alpha', klasse: '4aAPC', createdAt: now, updatedAt: now },
      { name: 'Team Beta', klasse: '4aAPC', createdAt: now, updatedAt: now }
    ]);
    const [teams] = await queryInterface.sequelize.query(
      "SELECT id, name FROM Teams WHERE name IN ('Team Alpha', 'Team Beta')"
    );
    const teamId = name => teams.find(t => t.name === name).id;

    await queryInterface.bulkInsert('Members', [
      { vorname: 'Lena', nachname: 'Huber', teamId: teamId('Team Alpha'), createdAt: now, updatedAt: now },
      { vorname: 'Jonas', nachname: 'Gruber', teamId: teamId('Team Alpha'), createdAt: now, updatedAt: now },
      { vorname: 'Sara', nachname: 'Wagner', teamId: teamId('Team Beta'), createdAt: now, updatedAt: now }
    ]);

    await queryInterface.bulkInsert('Projects', [
      { titel: 'Smart Garden', beschreibung: 'Bewässerungssteuerung mit Sensoren und App', praesentiertAm: new Date('2026-11-12T09:00:00'), teamId: teamId('Team Alpha'), createdAt: now, updatedAt: now },
      { titel: 'Mensa-Planer', beschreibung: 'Wochenplan und Vorbestellung für die Schulmensa', praesentiertAm: new Date('2026-11-12T10:30:00'), teamId: teamId('Team Beta'), createdAt: now, updatedAt: now }
    ]);
    const [projects] = await queryInterface.sequelize.query(
      "SELECT id, titel FROM Projects WHERE titel IN ('Smart Garden', 'Mensa-Planer')"
    );
    const projectId = titel => projects.find(p => p.titel === titel).id;

    await queryInterface.bulkInsert('Jurors', [
      { name: 'Prof. Maier', email: 'maier@schule.at', createdAt: now, updatedAt: now },
      { name: 'DI Berger', email: 'berger@schule.at', createdAt: now, updatedAt: now }
    ]);
    const [jurors] = await queryInterface.sequelize.query(
      "SELECT id, email FROM Jurors WHERE email IN ('maier@schule.at', 'berger@schule.at')"
    );
    const jurorId = email => jurors.find(j => j.email === email).id;

    const [criteria] = await queryInterface.sequelize.query('SELECT id, name FROM Criteria');
    const criterionId = name => criteria.find(c => c.name === name).id;

    const bewertung = (titel, kriterium, email, score, comment) => ({
      projectId: projectId(titel), criterionId: criterionId(kriterium), jurorId: jurorId(email),
      score, comment, createdAt: now, updatedAt: now
    });

    await queryInterface.bulkInsert('Evaluations', [
      bewertung('Smart Garden', 'Inhalt', 'maier@schule.at', 8, 'Gut durchdachtes Konzept'),
      bewertung('Smart Garden', 'Inhalt', 'berger@schule.at', 7, null),
      bewertung('Smart Garden', 'Technische Umsetzung', 'maier@schule.at', 9, 'Sensorik sauber umgesetzt'),
      bewertung('Smart Garden', 'Präsentationstechnik', 'berger@schule.at', 6, 'Etwas zu schnell vorgetragen'),
      bewertung('Mensa-Planer', 'Inhalt', 'maier@schule.at', 7, null)
    ]);
  },

  async down(queryInterface) {
    const [projects] = await queryInterface.sequelize.query(
      "SELECT id FROM Projects WHERE titel IN ('Smart Garden', 'Mensa-Planer')"
    );
    const projectIds = projects.map(p => p.id);
    if (projectIds.length) {
      await queryInterface.bulkDelete('Evaluations', { projectId: projectIds });
    }
    await queryInterface.bulkDelete('Projects', { titel: ['Smart Garden', 'Mensa-Planer'] });
    await queryInterface.bulkDelete('Jurors', { email: ['maier@schule.at', 'berger@schule.at'] });
    await queryInterface.bulkDelete('Members', { nachname: ['Huber', 'Gruber', 'Wagner'] });
    await queryInterface.bulkDelete('Teams', { name: ['Team Alpha', 'Team Beta'] });
  }
};
