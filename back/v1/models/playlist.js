module.exports = (sequelize, DateType) => {
  const Playlist = sequelize.define("playlists", {
    playlist_id: {
      type: DateType.INTEGER,
      primaryKey: true
    },
    user_id: {
      type: DateType.INTEGER
    },
    playlist_name: {
      type: DateType.STRING
    },
    created_at: {
      type: DateType.DATE
    }
  });

  return Playlist;
};