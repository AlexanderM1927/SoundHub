import { Model } from 'sequelize'
export default (sequelize: any, DataTypes: any) => {
  class Ban extends Model {
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
      
      this.belongsTo(models.user, {
        foreignKey: { 
          name: "responsable_user_id",
          allowNull: false
        }
      });
    }
  }
  Ban.init({
    ban_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    responsable_user_id: DataTypes.INTEGER,
    ban_reason: DataTypes.STRING,
    ban_expires: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ban',
  });
  return Ban;
};