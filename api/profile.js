const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const UserModel = require('../models/UserModel');
const FollowerModel = require('../models/FollowerModel');
const PostModel = require('../models/PostModal');
const ProfileModel = require('../models/ProfileModel');
//Get Profile Info
router.get('/:username', authMiddleware, async (req, res) => {
  const { username } = req.params;
  try {
    const user = await UserModel.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(404).send('user not found');
    }
    const profile = await ProfileModel.findOne({ user: user._id }).populate(
      'user'
    );
    const profileFollowStats = await FollowerModel.findOne({ user: user._id });
    return res.json({
      profile,
      followersLength:
        profileFollowStats.followers.length > 0
          ? profileFollowStats.followers.length
          : 0,
      followingLenght:
        profileFollowStats.following.length > 0
          ? profileFollowStats.following.length
          : 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
});

//Get user post
router.get('/posts/:username', authMiddleware, async (req, res) => {
  const { username } = req.params;
  try {
    const user = await UserModel.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(404).send('user not found');
    }
    const posts = await PostModel.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate('user')
      .populate('comments');

    return res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
});

//Get followers
router.get('/followers/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await FollowerModel.findOne({ user: userId }).populate(
      'followers.user'
    );

    console.log(user);
    return res.json(user.followers);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

// GET FOLLOWING OF USER
router.get('/following/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await FollowerModel.findOne({ user: userId }).populate(
      'following.user'
    );

    return res.json(user.following);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

// FOLLOW A USER
router.post('/follow/:userToFollowId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { userToFollowId } = req.params;

    const user = await FollowerModel.findOne({ user: userId });
    const userToFollow = await FollowerModel.findOne({ user: userToFollowId });

    if (!user || !userToFollow) {
      return res.status(404).send('User not found');
    }

    const isFollowing =
      user.following.length > 0 &&
      user.following.filter(
        (following) => following.user.toString() === userToFollowId
      ).length > 0;

    if (isFollowing) {
      return res.status(401).send('User Already Followed');
    }

    await user.following.unshift({ user: userToFollowId });
    await user.save();

    await userToFollow.followers.unshift({ user: userId });
    await userToFollow.save();

    return res.status(200).send('Updated');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});
module.exports = router;
