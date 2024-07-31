'use strict';
export default (sequelize: any, DataTypes: any) => {
  const Favorite = sequelize.define("favorites", {
    favorite_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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

  return Favorite;
};