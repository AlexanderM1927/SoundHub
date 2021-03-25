module.exports = (sequelize, DateType) => {
  const Ban = sequelize.define("bans", {
    ban_id: {
      type: DateType.INTEGER,
      primaryKey: true
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
    },
    created_at: {
      type: DateType.DATE
    }
  });

  return Ban;
};