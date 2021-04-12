module.exports = (sequelize, DateType) => {
  const Comment = sequelize.define("comments", {
    comment_id: {
      type: DateType.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    }
  });

  return Comment;
};