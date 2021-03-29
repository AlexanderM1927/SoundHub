module.exports = (sequelize, DateType) => {
  const Role = sequelize.define("roles", {
    role_id: {
      type: DateType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role_name: {
      type: DateType.STRING
    }
  });

  return Role;
};