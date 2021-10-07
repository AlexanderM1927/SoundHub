module.exports = (sequelize, DateType) => {
  const View = sequelize.define("views", {
    view_id: {
      type: DateType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    playlist_id: {
      type: DateType.INTEGER
    },
    sound_id: {
      type: DateType.STRING
    },
    view_type: {
      type: DateType.STRING
    }
  });

  return View;
};