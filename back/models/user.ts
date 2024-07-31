'use strict';
export default (sequelize: any, DataTypes: any) => {
  const User = sequelize.define("users", {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_identify: {
      type: DataTypes.STRING
    },
    user_email: {
      type: DataTypes.STRING
    },
    user_password: {
      type: DataTypes.STRING
    },
    user_name: {
      type: DataTypes.STRING
    },
    user_country: {
      type: DataTypes.STRING
    },
    user_phone: {
      type: DataTypes.STRING
    },
    role_id: {
      type: DataTypes.INTEGER
    }
  });

  return User;
};