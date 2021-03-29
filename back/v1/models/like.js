module.exports = (sequelize, DateType) => {
  const Like = sequelize.define("likes", {
    like_id: {
      type: DateType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DateType.INTEGER
    },
    comment_id: {
      type: DateType.INTEGER
    },
    playlist_id: {
      type: DateType.INTEGER
    },
    sound_id: {
      type: DateType.INTEGER
    }
  });

  return Like;
};