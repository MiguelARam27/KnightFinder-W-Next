const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
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

//UnFollow user from
router.put('/unfollow/:userToUnfollowId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { userToUnfollowId } = req.params;

    const user = await FollowerModel.findOne({
      user: userId,
    });

    const userToUnfollow = await FollowerModel.findOne({
      user: userToUnfollowId,
    });

    if (!user || !userToUnfollow) {
      return res.status(404).send('User not found');
    }

    const isFollowing =
      user.following.length > 0 &&
      user.following.filter(
        (following) => following.user.toString() === userToUnfollowId
      ).length === 0;

    if (isFollowing) {
      return res.status(401).send('User Not Followed before');
    }

    const removeFollowing = await user.following
      .map((following) => following.user.toString())
      .indexOf(userToUnfollowId);

    await user.following.splice(removeFollowing, 1);
    await user.save();

    const removeFollower = await userToUnfollow.followers
      .map((follower) => follower.user.toString())
      .indexOf(userId);

    await userToUnfollow.followers.splice(removeFollower, 1);
    await userToUnfollow.save();

    return res.status(200).send('Updated');
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});
// UPDATE PROFILE
router.post('/update', authMiddleware, async (req, res) => {
  try {
    const { userId } = req;

    const {
      bio,
      facebook,
      youtube,
      twitter,
      instagram,
      profilePicUrl,
    } = req.body;

    let profileFields = {};
    profileFields.user = userId;

    profileFields.bio = bio;

    profileFields.social = {};

    if (facebook) profileFields.social.facebook = facebook;

    if (youtube) profileFields.social.youtube = youtube;

    if (instagram) profileFields.social.instagram = instagram;

    if (twitter) profileFields.social.twitter = twitter;

    await ProfileModel.findOneAndUpdate(
      { user: userId },
      { $set: profileFields },
      { new: true }
    );

    if (profilePicUrl) {
      const user = await UserModel.findById(userId);
      user.profilePicUrl = profilePicUrl;
      await user.save();
    }

    return res.status(200).send('Success');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

//Update password
router.post('/settings/password', authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { currentPassword, newPassword } = req.body;
    console.log(currentPassword, newPassword);

    if (newPassword?.length < 6) {
      return res.status(401).send('Password must be at least 6 characters');
    }
    const user = await UserModel.findById(userId).select('+password');
    console.log(user);
    const isPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isPassword) {
      return res.status(401).send('Invalid Password');
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).send('Success');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});
module.exports = router;