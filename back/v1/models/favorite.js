module.exports = (sequelize, DateType) => {
  const Favorite = sequelize.define("favorites", {
    favorite_id: {
      type: DateType.INTEGER,
      primaryKey: true
    },
    user_id: {
      type: DateType.INTEGER
    },
    playlist_id: {
      type: DateType.INTEGER
    },
    sound_id: {
      type: DateType.INTEGER
    },
    created_at: {
      type: DateType.DATE
    }
  });

  return Favorite;
};