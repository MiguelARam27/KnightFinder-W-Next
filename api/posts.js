const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModal');
const FollowerModel = require('../models/FollowerModel');

// Create post
router.post('/', authMiddleware, async (req, res) => {
  const { text, location, picUrl } = req.body;

  if (text.length < 1)
    return res.status(401).send('Text must be atleast 1 character');

  try {
    const newPost = {
      user: req.userId,
      text,
    };
    if (location) newPost.location = location;
    if (picUrl) newPost.picUrl = picUrl;

    const post = await new PostModel(newPost).save();

    // const postCreated = await PostModel.findById(post._id).populate('user');

    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

//Get all posts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate('user')
      .populate('comments.user');
    return res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

//Get post by id
router.get('/:postId', authMiddleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId)
      .populate('user')
      .populate('comments.user');
    if (!post) {
      return res.status(404).send('Post not found');
    }
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

router.delete('/:postId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send('Post not found to delete');
    }
    const user = await UserModel.findById(userId);
    if (post.user.toString() !== userId) {
      if (user.role === 'root') {
        await post.remove();
        res.status(200).send('Post deleted');
      } else {
        return res.status(401).send('Unauthroized');
      }
    }
    await post.remove();
    return res.status(200).send('Post deleted');
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

module.exports = router;
