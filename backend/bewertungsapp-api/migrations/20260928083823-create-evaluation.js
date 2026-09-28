'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Evaluations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      score: {
        type: Sequelize.INTEGER
      },
      comment: {
        type: Sequelize.TEXT
      },
      projectId: {
        type: Sequelize.INTEGER
      },
      criterionId: {
        type: Sequelize.INTEGER
      },
      jurorId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('Evaluations', {
      fields: ['projectId', 'criterionId', 'jurorId'],
      type: 'unique',
      name: 'unique_evaluation_per_juror_criterion_project'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'Evaluations',
      'unique_evaluation_per_juror_criterion_project'
    );
    await queryInterface.dropTable('Evaluations');
  }
};