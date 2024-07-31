'use strict';
export default (sequelize: any, DataTypes: any) => {
  const View = sequelize.define("views", {
    view_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    playlist_id: {
      type: DataTypes.INTEGER
    },
    sound_id: {
      type: DataTypes.STRING
    },
    view_type: {
      type: DataTypes.STRING
    }
  });

  return View;
};