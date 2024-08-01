import { Model } from 'sequelize'
export default (sequelize: any, DataTypes: any) => {
  class View extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      this.belongsTo(models.playlist, {
        foreignKey: { 
          name: "playlist_id",
          allowNull: true
        }
      });
    }
  }
  View.init({
    view_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    playlist_id: DataTypes.INTEGER,
    sound_id: DataTypes.STRING,
    view_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'view',
  });
  return View;
};