module.exports = (sequelize, DateType) => {
  const Sound = sequelize.define("sounds", {
    sound_id: {
      type: DateType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DateType.INTEGER
    },
    sound_name: {
      type: DateType.STRING
    },
    sound_file_url: {
      type: DateType.STRING
    },
    sound_thumbnail_url: {
      type: DateType.STRING
    }
  });

  return Sound;
};