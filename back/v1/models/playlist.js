module.exports = (sequelize, DateType) => {
  const Playlist = sequelize.define("playlists", {
    playlist_id: {
      type: DateType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DateType.INTEGER
    },
    playlist_name: {
      type: DateType.STRING
    }
  });

  return Playlist;
};