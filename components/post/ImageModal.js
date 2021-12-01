import React from 'react';
import {
  Modal,
  Grid,
  Image,
  Card,
  Icon,
  Divider,
  Popup,
  Header,
  Button,
} from 'semantic-ui-react';
import PostComments from './PostComments';
import CommentInputField from './CommentInputField';
import LikeList from './LikeList';
import Link from 'next/link';
import calculateTime from '../../utils/calculatedTime';
import { deletePost, likePost } from '../../utils/postActions';
import styles from '@/styles/Modal.module.scss';
const ImageModal = ({
  post,
  user,
  setLikes,
  likes,
  isLiked,
  comments,
  setComments,
}) => {
  return (
    <>
      <div className={styles.modalwrapper}>
        <div className={styles.image}>
          <img src={post.picUrl} alt="post image" />
        </div>
        <div className={styles.content}>
          <div className="card ui fluid">
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
                <h2>{post.text}</h2>
              </div>
            </div>
            <div className="content">
              <div className={styles.description}>
                <div className={styles.iconWrapper}>
                  <Icon
                    name={isLiked ? 'heart' : 'heart outline'}
                    color="red"
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      likePost(
                        post._id,
                        user._id,
                        setLikes,
                        isLiked ? false : true
                      )
                    }
                  />
                  <LikeList
                    postId={post._id}
                    trigger={
                      likes.length > 0 && (
                        <span className="spanLikesList">
                          {`${likes.length} ${
                            likes.length === 1 ? 'like' : 'likes'
                          }`}
                        </span>
                      )
                    }
                  />
                </div>
              </div>

              <div className={`${styles.contentWrapper} "extra content"`}>
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

                <Divider hidden />
              </div>
              <div className={styles.commentField}>
                <CommentInputField
                  user={user}
                  postId={post._id}
                  setComments={setComments}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ImageModal;
