const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');
const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull:true,
  }
});
module.exports = Post;
