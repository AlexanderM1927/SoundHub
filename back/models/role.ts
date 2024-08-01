import { Model } from 'sequelize'
export default (sequelize: any, DataTypes: any) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_models: any) {

    }
  }
  Role.init({
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    role_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'role',
  });
  return Role;
};