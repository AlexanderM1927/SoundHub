'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ban extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ban.init({
    user_id: DataTypes.INTEGER,
    responsable_user_id: DataTypes.INTEGER,
    ban_reason: DataTypes.STRING,
    ban_expires: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Ban',
  });
  return Ban;
};