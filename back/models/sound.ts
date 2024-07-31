'use strict';
export default (sequelize: any, DataTypes: any) => {
  const Sound = sequelize.define("sounds", {
    sound_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    sound_name: {
      type: DataTypes.STRING
    },
    sound_file_url: {
      type: DataTypes.STRING
    },
    sound_thumbnail_url: {
      type: DataTypes.STRING
    }
  });

  return Sound;
};