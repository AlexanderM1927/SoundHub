module.exports = (sequelize, DateType) => {
  const Ban = sequelize.define("bans", {
    ban_id: {
      type: DateType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DateType.INTEGER
    },
    responsable_user_id: {
      type: DateType.INTEGER
    },
    ban_reason: {
      type: DateType.STRING
    },
    ban_expires: {
      type: DateType.DATE
    }
  });

  return Ban;
};