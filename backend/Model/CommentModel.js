const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');
const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  PostId: {
    type: DataTypes.INTEGER,
    allowNull:false,
  },
  name:{
    type: DataTypes.TEXT,
    allowNull: false,
  }
});
module.exports = Comment;
