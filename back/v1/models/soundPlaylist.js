module.exports = (sequelize, DateType) => {
  const soundPlaylist = sequelize.define("sounds_playlist", {
    sound_playlist_id: {
      type: DateType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    youtube_id: {
      type: DateType.STRING
    }
  });

  return soundPlaylist;
};