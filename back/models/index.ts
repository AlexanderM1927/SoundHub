import { Dialect, Sequelize } from 'sequelize'
import userModel from "./user";
import roleModel from "./role";
import banModel from "./ban";
import soundModel from "./sound";
import playlistModel from "./playlist";
import commentModel from "./comment";
import likeModel from "./like";
import favoriteModel from "./favorite";
import viewModel from "./view";
import soundPlaylistModel from "./soundplaylist";
import { config } from '../config/config'

const sequelize = new Sequelize(
  config.DB as string,
  config.USER as string,
  config.PASSWORD as string,
  {
    host: config.HOST,
    port: parseInt(config.PORT as string),
    dialect: config.dialect as Dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {
  Sequelize,
  sequelize,
  user: userModel(sequelize, Sequelize),
  role: roleModel(sequelize, Sequelize),
  ban: banModel(sequelize, Sequelize),
  sound: soundModel(sequelize, Sequelize),
  playlist: playlistModel(sequelize, Sequelize),
  comment: commentModel(sequelize, Sequelize),
  like: likeModel(sequelize, Sequelize),
  favorite: favoriteModel(sequelize, Sequelize),
  view: viewModel(sequelize, Sequelize),
  soundPlaylist: soundPlaylistModel(sequelize, Sequelize),
  ROLES: ["user", "admin", "moderator"]
};

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

export const { user, role, ban, sound, playlist, comment, like, favorite, view, soundPlaylist } = db;
export default db;