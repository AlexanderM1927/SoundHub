import { Model } from 'sequelize'
export default (sequelize: any, DataTypes: any) => {
  class Favorite extends Model {
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
      
      this.belongsTo(models.sound, {
        foreignKey: { 
          name: "sound_id",
          allowNull: true
        }
      });
      
      this.belongsTo(models.playlist, {
        foreignKey: { 
          name: "playlist_id",
          allowNull: true
        }
      });
    }
  }
  Favorite.init({
    favorite_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    playlist_id: DataTypes.INTEGER,
    sound_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'favorite',
  });
  return Favorite;
};