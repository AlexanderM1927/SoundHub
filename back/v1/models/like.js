module.exports = (sequelize, DateType) => {
  const Like = sequelize.define("likes", {
    like_id: {
      type: DateType.INTEGER,
      primaryKey: true
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
    },
    created_at: {
      type: DateType.DATE
    }
  });

  return Like;
};