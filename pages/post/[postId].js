import React, { useState } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';
import { Icon, Image, Divider, Modal } from 'semantic-ui-react';
import PostComments from '../../components/post/PostComments';
import CommentInputField from '../../components/post/CommentInputField';

import LikeList from '../../components/post/LikeList';
import { likePost } from '../../utils/postActions';
import calculateTime from '../../utils/calculatedTime';
import baseUrl from '../../utils/baseUrl';
import { NoPostFound } from '../../components/Layout/NoData';
import Link from 'next/link';
import styles from '@/styles/PostPage.module.scss';

import ImageModal from '../../components/post/ImageModal';
import NoImageModal from '../../components/post/NoImageModal';

function PostPage({ post, errorLoading, user }) {
  const [likes, setLikes] = useState(post.likes);
  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => like.user === user._id).length > 0;

  const [comments, setComments] = useState(post.comments);
  const [showModal, setShowModal] = useState(false);

  const modalProps = () => ({
    post,
    user,
    setLikes,
    likes,
    setComments,
    isLiked,
    comments,
  });

  if (errorLoading) {
    return <NoPostFound />;
  }
  return (
    <div className="ui text container">
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
          }}
          closeIcon
          closeOnDimmerClick
          open={showModal}
        >
          {post.picUrl ? (
            <ImageModal {...modalProps()} />
          ) : (
            <NoImageModal {...modalProps()} />
          )}
        </Modal>
      )}
      <div className="ui basic segment">
        <div className={`${styles.post} ui fluid card`}>
          {post.picUrl && (
            <Image
              src={post.picUrl}
              style={{ cursor: 'pointer' }}
              floated="left"
              wrapped
              ui={false}
              alt="PostImage"
              onClick={() => setShowModal(true)}
            />
          )}
          <div className="content">
            <Image
              floated="left"
              src={post.user.profilePicUrl}
              avatar
              circular
            />
            <div className="header">
              <Link href={`/${post.user.username}`}>
                <a>{post.user.name}</a>
              </Link>
            </div>
            <div className="meta">
              <time>{calculateTime(post.createdAt)}</time>
            </div>
            {post.location && <div className="meta">{post.location}</div>}
          </div>
          <div className="extra content">
            <Icon
              name={isLiked ? 'heart' : 'heart outline'}
              color="red"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                likePost(post._id, user._id, setLikes, isLiked ? false : true)
              }
            />

            <LikeList
              postId={post._id}
              trigger={
                likes.length > 0 && (
                  <span className="spanLikesList">
                    {`${likes.length} ${likes.length === 1 ? 'like' : 'likes'}`}
                  </span>
                )
              }
            />

            <Icon
              name="comment outline"
              style={{ marginLeft: '7px' }}
              color="blue"
            />

            {comments.length > 0 &&
              comments.map((comment) => (
                <PostComments
                  key={comment._id}
                  comment={comment}
                  postId={post._id}
                  user={user}
                  setComments={setComments}
                />
              ))}

            <Divider hidden />

            <CommentInputField
              user={user}
              postId={post._id}
              setComments={setComments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

PostPage.getInitialProps = async (ctx) => {
  try {
    const { postId } = ctx.query;
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/posts/${postId}`, {
      headers: { Authorization: token },
    });

    return { post: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default PostPage;
