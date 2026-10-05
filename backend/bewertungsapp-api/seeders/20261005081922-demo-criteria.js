'use strict';
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Criteria', [
      { name: 'Inhalt', maxScore: 10, weight: 1.0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Präsentationstechnik', maxScore: 10, weight: 1.0, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Technische Umsetzung', maxScore: 10, weight: 1.5, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Criteria', null, {});
  }
};