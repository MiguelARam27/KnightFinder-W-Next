const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModal');
const {
  newLikeNotification,
  removeLikeNotification,
} = require('../utilsServer/notificationsActions');

const likeOrUnlikePost = async (postId, userId, like) => {
  console.log(postId, userId, like);
  try {
    const post = await PostModel.findById(postId);
    console.log(post);
    if (!post) {
      return { error: 'No post Found' };
    }
    if (like) {
      const isLiked =
        post.likes.filter((like) => like.user.toString() === userId).length > 0;

      if (isLiked) {
        return { error: 'Already liked' };
      }

      console.log(post);
      await post.likes.unshift({ user: userId });
      await post.save();

      console.log(post);

      if (post.user.toString() !== userId) {
        await newLikeNotification(userId, postId, post.user.toString());
      }
    } else {
      const isLiked =
        post.likes.filter((like) => like.user.toString() === userId).length > 0;

      if (isLiked) {
        return { error: 'Post not liked before' };
      }

      const indexOf = post.likes
        .map((like = like.user.toString()))
        .indexOf(userId);

      await post.likes.splice(indexOf, 1);
      await post.save();

      if (post.user.toString() !== userId) {
        await removeLikeNotification(userId, postId, post.user.toString());
      }
    }

    return { success: true };
  } catch (error) {
    return { error: 'Server error' };
  }
};

module.exports = { likeOrUnlikePost };
