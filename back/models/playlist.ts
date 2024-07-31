'use strict';
export default (sequelize: any, DataTypes: any) => {
  const Playlist = sequelize.define("playlists", {
    playlist_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    playlist_name: {
      type: DataTypes.STRING
    }
  });

  return Playlist;
};