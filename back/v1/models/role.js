module.exports = (sequelize, DateType) => {
  const Role = sequelize.define("roles", {
    role_id: {
      type: DateType.INTEGER,
      primaryKey: true
    },
    role_name: {
      type: DateType.STRING
    },
    created_at: {
      type: DateType.DATE
    }
  });

  return Role;
};