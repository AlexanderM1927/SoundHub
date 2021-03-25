const config = require("../../src/conex.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    port: config.PORT,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.js")(sequelize, Sequelize);
db.role = require("../models/role.js")(sequelize, Sequelize);
db.ban = require("../models/ban.js")(sequelize, Sequelize);
db.sound = require("../models/sound.js")(sequelize, Sequelize);

db.user.belongsTo(db.role, {
  foreignKey: { 
    name: "role_id",
    allowNull: true
  }
});

db.ban.belongsTo(db.user, {
  foreignKey: { 
    name: "user_id",
    allowNull: true
  }
});

db.sound.belongsTo(db.user, {
  foreignKey: { 
    name: "user_id",
    allowNull: true
  }
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;