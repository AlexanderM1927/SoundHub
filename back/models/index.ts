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

const db: any = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = userModel(sequelize, Sequelize);
db.role = roleModel(sequelize, Sequelize);
db.ban = banModel(sequelize, Sequelize);
db.sound = soundModel(sequelize, Sequelize);
db.playlist = playlistModel(sequelize, Sequelize);
db.comment = commentModel(sequelize, Sequelize);
db.like = likeModel(sequelize, Sequelize);
db.favorite = favoriteModel(sequelize, Sequelize);
db.view = viewModel(sequelize, Sequelize);
db.soundPlaylist = soundPlaylistModel(sequelize, Sequelize);

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

db.soundPlaylist.belongsTo(db.sound, {
  foreignKey: { 
    name: "sound_id",
    allowNull: false
  }
})

db.soundPlaylist.belongsTo(db.playlist, {
  foreignKey: { 
    name: "playlist_id",
    allowNull: false
  }
})

db.sound.belongsToMany(db.playlist, {
  through: db.soundPlaylist,
  foreignKey: "sound_id",
});

db.playlist.belongsToMany(db.sound, {
  through: db.soundPlaylist,
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

db.ROLES = ["user", "admin", "moderator"]

export default db;