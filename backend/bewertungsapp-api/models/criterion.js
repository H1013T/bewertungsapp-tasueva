'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Criterion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Criterion.init({
    name: DataTypes.STRING,
    maxScore: DataTypes.INTEGER,
    weight: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Criterion',
  });
  return Criterion;
};