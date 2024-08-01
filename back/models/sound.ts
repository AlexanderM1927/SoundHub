import { Model } from 'sequelize'
export default (sequelize: any, DataTypes: any) => {
  class Sound extends Model {
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
      this.belongsToMany(models.playlist, {
        through: models.sounds_playlist,
        foreignKey: "sound_id",
      });
    }
  }
  Sound.init({
    sound_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    sound_name: DataTypes.STRING,
    sound_file_url: DataTypes.STRING,
    sound_thumbnail_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'sound',
  });
  return Sound;
};