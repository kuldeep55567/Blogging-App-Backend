const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');
const bcrypt = require("bcrypt")
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
    name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isBlocked:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});
User.getUserNameById = async function (userId) {
  try {
    const user = await this.findByPk(userId);
    if (!user) {
      return null;
    }
    return user.name;
  } catch (error) {
    console.error(error);
    return null;
  }
};
User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});
module.exports = User;
