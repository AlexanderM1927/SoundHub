module.exports = (sequelize, DateType) => {
  const Comment = sequelize.define("comments", {
    comment_id: {
      type: DateType.INTEGER,
      primaryKey: true
    },
    comment_msg: {
      type: DateType.STRING
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

  return Comment;
};