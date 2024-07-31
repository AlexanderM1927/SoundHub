'use strict';
export default (sequelize: any, DataTypes: any) => {
  const soundPlaylist = sequelize.define("sounds_playlist", {
    sound_playlist_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    youtube_id: {
      type: DataTypes.STRING
    }
  });

  return soundPlaylist;
};