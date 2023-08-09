const express = require('express');
const postRouter = express.Router();
const Post = require('../Model/PostModel');
const { Op } = require('sequelize');
const User = require("../Model/UserModel")
const Like = require("../Model/LikeModel")
const Comment = require("../Model/CommentModel")
const { authMiddleWare } = require("../Middlewares/Authentication")

postRouter.get('/posts/:id?', async (req, res) => {
  const searchQuery = req.query.search;
  const { id } = req.params;
  try {
    if (id) {
      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const user = await User.findByPk(post.UserId);
      const postData = {
        ...post.toJSON(),
        userName: user ? user.name : null 
      }
      return res.json(postData);
    } else {
      let posts;

      if (searchQuery) {
        posts = await Post.findAll({
          where: {
            title: {
              [Op.like]: `%${searchQuery}%`,
            },
          },
        });
      } else {
        posts = await Post.findAll();
      }

      const postsData = [];

      for (const post of posts) {
        const user = await User.findByPk(post.UserId);

        postsData.push({
          ...post.toJSON(),
          userName: user ? user.name : null
        });
      }

      return res.json(postsData);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});
postRouter.get('/myblogs', authMiddleWare, async (req, res) => {
  const userId = req.user.id;
  try {
    const blogs = await Post.findAll({ where: { UserId: userId } });
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching blogs.' });
  }
});
postRouter.post("/create-blog", authMiddleWare, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  try {
    const newPost = await Post.create({ title, content, UserId: userId });
    res.status(201).json({ message: 'Blog post created successfully!', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating blog post' });
  }
})
postRouter.put("/edit-blog/:id", authMiddleWare, async (req, res) => {
  const { title, content } = req.body;
  const postId = req.params.id;
  try {
    const updatedPost = await Post.update(
      { title, content },
      { where: { id: postId, UserId: req.user.id } }
    );
    if (updatedPost[0] === 1) {
      res.status(200).json({ message: 'Blog post updated successfully!', updatedPost });
    } else {
      res.status(404).json({ message: 'Blog post not found or unauthorized' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating blog post' });
  }
});
postRouter.delete('/delete-blog/:id', authMiddleWare, async (req, res) => {
  const postId = req.params.id;
  try {
    const deletedPost = await Post.destroy({
      where: { id: postId, UserId: req.user.id },
    });
    if (deletedPost === 1) {
      res.status(200).json({ message: 'Blog post deleted successfully!' });
    } else {
      res.status(404).json({ message: 'Blog post not found or unauthorized' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting blog post' });
  }
});
postRouter.post('/post/:postId/comment', authMiddleWare, async (req, res) => {
  const postId = req.params.postId;
  const { text } = req.body;
  const userID  = req.user.id
  const userName = await User.getUserNameById(userID);
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const newComment = await Comment.create({
      text: text,
      PostId: postId,
      name:userName
    });
    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});
postRouter.get('/post/:postId/comments', async (req, res) => {
  const postId = req.params.postId;
  try {
    const comments = await Comment.findAll({
      where: { PostId: postId },
    });
    res.json(comments);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});
postRouter.post('/post/:postId/like', authMiddleWare, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const existingLike = await Like.findOne({
      where: {
        PostId: postId,
        UserId: userId,
      },
    });
    if (existingLike) {
      return res.status(400).json({ message: 'Post already liked by the user' });
    }
    await Like.create({
      PostId: postId,
      UserId: userId,
    });
    post.likes += 1;
    await post.save();
    return res.json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = { postRouter }