'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    //Beziehzungen
    static associate(models) {
      Project.belongsTo(models.Team, { foreignKey: 'teamId' });
      Project.hasMany(models.Evaluation, { foreignKey: 'projectId' });
    }
  }
  Project.init({
    titel: DataTypes.STRING,
    beschreibung: DataTypes.TEXT,
    praesentiertAm: DataTypes.DATE,
    teamId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};