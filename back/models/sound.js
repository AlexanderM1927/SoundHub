'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sound extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Sound.init({
    user_id: DataTypes.INTEGER,
    sound_name: DataTypes.STRING,
    sound_file_url: DataTypes.STRING,
    sound_thumbnail_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sound',
  });
  return Sound;
};