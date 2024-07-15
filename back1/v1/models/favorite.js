module.exports = (sequelize, DateType) => {
  const Favorite = sequelize.define("favorites", {
    favorite_id: {
      type: DateType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DateType.INTEGER
    },
    playlist_id: {
      type: DateType.INTEGER
    },
    sound_id: {
      type: DateType.INTEGER
    }
  });

  return Favorite;
};