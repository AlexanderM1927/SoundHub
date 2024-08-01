import { Model } from 'sequelize'
export default (sequelize: any, DataTypes: any) => {
  class SoundPlaylist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      this.belongsTo(models.sound, {
        foreignKey: { 
          name: "sound_id",
          allowNull: true
        }
      })
      
      this.belongsTo(models.playlist, {
        foreignKey: { 
          name: "playlist_id",
          allowNull: false
        }
      })
    }
  }
  SoundPlaylist.init({
    sound_playlist_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    sound_id: DataTypes.INTEGER,
    youtube_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'sounds_playlist',
  });
  return SoundPlaylist;
};