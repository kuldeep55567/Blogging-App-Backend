const {DataTypes } = require('sequelize');
const sequelize = require('../Config/db');
const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  PostId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = Like;
