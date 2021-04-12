module.exports = (sequelize, DateType) => {
  const User = sequelize.define("users", {
    user_id: {
      type: DateType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_identify: {
      type: DateType.STRING
    },
    user_email: {
      type: DateType.STRING
    },
    user_password: {
      type: DateType.STRING
    },
    user_name: {
      type: DateType.STRING
    },
    user_country: {
      type: DateType.STRING
    },
    user_phone: {
      type: DateType.STRING
    },
    role_id: {
      type: DateType.INTEGER
    }
  });

  return User;
};