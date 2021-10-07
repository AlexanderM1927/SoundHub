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
    // dialectOptions: {
    //   ssl: {
    //     require: false,
    //     rejectUnauthorized: false
    //   }
    // },
    operatorsAliases: 0,
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
db.playlist = require("../models/playlist.js")(sequelize, Sequelize);
db.comment = require("../models/comment.js")(sequelize, Sequelize);
db.like = require("../models/like.js")(sequelize, Sequelize);
db.favorite = require("../models/favorite.js")(sequelize, Sequelize);
db.view = require("../models/view.js")(sequelize, Sequelize);
db.soundPlaylist = require("../models/soundPlaylist.js")(sequelize, Sequelize);

db.user.belongsTo(db.role, {
  foreignKey: { 
    name: "role_id",
    allowNull: false
  }
});

db.ban.belongsTo(db.user, {
  foreignKey: { 
    name: "user_id",
    allowNull: false
  }
});

db.ban.belongsTo(db.user, {
  foreignKey: { 
    name: "responsable_user_id",
    allowNull: false
  }
});

db.sound.belongsTo(db.user, {
  foreignKey: { 
    name: "user_id",
    allowNull: false
  }
});

db.playlist.belongsTo(db.user, {
  foreignKey: { 
    name: "user_id",
    allowNull: false
  }
});

db.sound.belongsToMany(db.playlist, {
  through: db.soundPlaylist,
  as: "playlists",
  foreignKey: "sound_id",
});

db.playlist.belongsToMany(db.sound, {
  through: db.soundPlaylist,
  as: "sounds",
  foreignKey: "playlist_id",
});

db.comment.belongsTo(db.user, {
  foreignKey: { 
    name: "user_id",
    allowNull: false
  }
});

db.comment.belongsTo(db.sound, {
  foreignKey: { 
    name: "sound_id",
    allowNull: true
  }
});

db.comment.belongsTo(db.playlist, {
  foreignKey: { 
    name: "playlist_id",
    allowNull: true
  }
});

db.like.belongsTo(db.user, {
  foreignKey: { 
    name: "user_id",
    allowNull: false
  }
});

db.like.belongsTo(db.sound, {
  foreignKey: { 
    name: "sound_id",
    allowNull: true
  }
});

db.like.belongsTo(db.playlist, {
  foreignKey: { 
    name: "playlist_id",
    allowNull: true
  }
});

db.like.belongsTo(db.comment, {
  foreignKey: { 
    name: "comment_id",
    allowNull: true
  }
});

db.favorite.belongsTo(db.user, {
  foreignKey: { 
    name: "user_id",
    allowNull: false
  }
});

db.favorite.belongsTo(db.sound, {
  foreignKey: { 
    name: "sound_id",
    allowNull: true
  }
});

db.favorite.belongsTo(db.playlist, {
  foreignKey: { 
    name: "playlist_id",
    allowNull: true
  }
});

db.view.belongsTo(db.playlist, {
  foreignKey: { 
    name: "playlist_id",
    allowNull: true
  }
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;