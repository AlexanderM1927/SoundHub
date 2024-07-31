'use strict';
export default (sequelize: any, DataTypes: any) => {
  const Comment = sequelize.define("comments", {
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    comment_msg: {
      type: DataTypes.STRING
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    playlist_id: {
      type: DataTypes.INTEGER
    },
    sound_id: {
      type: DataTypes.INTEGER
    }
  });

  return Comment;
};