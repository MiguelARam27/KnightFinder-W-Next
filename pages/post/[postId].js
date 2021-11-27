import React, { useState } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';
import {
  Icon,
  Image,
  Divider,
  Modal,
  Popup,
  Header,
  Button,
} from 'semantic-ui-react';
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

  const toggleModal = () => {
    setShowModal(!showModal);
  };

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
              onClick={toggleModal}
            />
          )}
          <div className="content">
            <Image
              floated="left"
              src={post.user.profilePicUrl}
              avatar
              circular
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
              <button className={styles.button} onClick={toggleModal}>
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
