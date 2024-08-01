import { Model } from 'sequelize'
export default (sequelize: any, DataTypes: any) => {
  class Playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      this.belongsTo(models.user, {
        foreignKey: { 
          name: "user_id",
          allowNull: false
        }
      });
      this.belongsToMany(models.sound, {
        through: models.sounds_playlist,
        foreignKey: "playlist_id",
      });
    }
  }
  Playlist.init({
    playlist_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    playlist_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'playlist',
  });
  return Playlist;
};