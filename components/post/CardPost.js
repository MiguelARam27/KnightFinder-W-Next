import React, { useState } from 'react';
import {
  Card,
  Icon,
  Image,
  Divider,
  Segment,
  Button,
  Popup,
  Header,
  Modal,
} from 'semantic-ui-react';
import PostComments from './PostComments';
import CommentInputField from './CommentInputField';

import Link from 'next/link';
import calculateTime from '../../utils/calculatedTime';
import { deletePost, likePost } from '../../utils/postActions';
import LikeList from './LikeList';
import ImageModal from './ImageModal';
import NoImageModal from './NoImageModal';
import styles from '@/styles/Post.module.scss';
const CardPost = ({ post, user, setPosts, setShowToastr, socket }) => {
  const [likes, setLikes] = useState(post.likes);

  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => like.user === user._id).length > 0;

  const [comments, setComments] = useState(post.comments);

  const [error, setError] = useState(null);

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
  return (
    <>
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
          {post?.picUrl && (
            <div
              className={styles.postImage}
              onClick={() => setShowModal(true)}
            >
              <img src={post.picUrl} alt="PostImage" />
            </div>
          )}
          <div className="content">
            <img
              src={post.user.profilePicUrl}
              alt=""
              className="ui avatar left floated image"
            />
            {(user.role === 'root' || post.user._id === user._id) && (
              <>
                <Popup
                  on="click"
                  position="top right"
                  trigger={
                    <Image
                      src="/deleteIcon.svg"
                      style={{ cursor: 'pointer' }}
                      size="mini"
                      floated="right"
                    />
                  }
                >
                  <Header as="h4" content="Are you sure" />
                  <p>This action is irreversible</p>
                  <Button
                    color="red"
                    icon="trash"
                    content="delete"
                    onClick={() =>
                      deletePost(post._id, setPosts, setShowToastr)
                    }
                  />
                </Popup>
              </>
            )}
            <div className="header">
              <Link href={`/${post.user.username}`}>
                <a className={styles.link}>{post.user.name}</a>
              </Link>
            </div>
            <div className="meta">
              <time>{calculateTime(post.createdAt)}</time>
            </div>
            {post.location && <div className="meta">{post.location}</div>}
            <div className={styles.postWrapper}>
              <span>{post.text}</span>
            </div>
          </div>
          <div className="content">
            <Icon
              name={isLiked ? 'heart' : 'heart outline'}
              color="red"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (socket.current) {
                  socket.current.emit('likePost', {
                    postId: post._id,
                    userId: user._id,
                    like: isLiked ? false : true,
                  });

                  socket.current.on('postLiked', () => {
                    if (isLiked) {
                      setLikes((prev) =>
                        prev.filter((like) => like.user !== user._id)
                      );
                    } else {
                      setLikes((prev) => [...prev, { user: user._id }]);
                    }
                  });
                } else {
                  likePost(
                    post._id,
                    user._id,
                    setLikes,
                    isLiked ? false : true
                  );
                }
              }}
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
              comments.map(
                (comment, i) =>
                  i < 3 && (
                    <PostComments
                      key={comment._id}
                      comment={comment}
                      postId={post._id}
                      user={user}
                      setComments={setComments}
                    />
                  )
              )}

            {comments.length > 3 && (
              <button
                className={styles.button}
                onClick={() => {
                  setShowModal(true);
                }}
              >
                View more
              </button>
            )}

            <Divider hidden />
            <CommentInputField
              user={user}
              postId={post._id}
              setComments={setComments}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CardPost;
