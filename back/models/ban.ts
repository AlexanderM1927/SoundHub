'use strict';
export default (sequelize: any, DataTypes: any) => {
  const Ban = sequelize.define("bans", {
    ban_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    responsable_user_id: {
      type: DataTypes.INTEGER
    },
    ban_reason: {
      type: DataTypes.STRING
    },
    ban_expires: {
      type: DataTypes.DATE
    }
  });

  return Ban;
};