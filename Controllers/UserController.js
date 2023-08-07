const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/UserModel');
const Post = require('../Model/PostModel');
const {authMiddleWare} = require("../Middlewares/Authentication")
require("dotenv").config()
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
   return res.status(400).json({ message: 'User already Registered' });
  }
  try {
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: 'Signup successful!', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error signing up!' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: 'User not found!' });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign({ id: user.id },process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login successful!', token:token });
      } else {
        res.status(401).json({ message: 'Invalid password!' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in!' });
  }
};
const createBlog =  async(req, res) => {
  const { title, content } = req.body;
  // const userId = req.user.id;
  try {
    const newPost = await Post.create({ title, content});
    res.status(201).json({ message: 'Blog post created successfully!', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating blog post' });
  }
};
module.exports = {
  signup,
  login,
  createBlog
};
