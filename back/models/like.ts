'use strict';
export default (sequelize: any, DataTypes: any) => {
  const Like = sequelize.define("likes", {
    like_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    comment_id: {
      type: DataTypes.INTEGER
    },
    playlist_id: {
      type: DataTypes.INTEGER
    },
    sound_id: {
      type: DataTypes.INTEGER
    }
  });

  return Like;
};