'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Evaluation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Evaluation.belongsTo(models.Project, { foreignKey: 'projectId' });
      Evaluation.belongsTo(models.Criterion, { foreignKey: 'criterionId' });
      Evaluation.belongsTo(models.Juror, { foreignKey: 'jurorId' });
    }
  }
  Evaluation.init({
    score: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    projectId: DataTypes.INTEGER,
    criterionId: DataTypes.INTEGER,
    jurorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Evaluation',
  });
  return Evaluation;
};