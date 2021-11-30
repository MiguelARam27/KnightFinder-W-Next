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
              <div className={styles.description}>
                <span>{post.text}</span>
                <div>
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
      {/* <Grid columns={2} stackable relaxed>
        <Grid.Column>
          <Modal.Content image>
            <Image wrapped size="large" src={post.picUrl} />
          </Modal.Content>
        </Grid.Column>

        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <Image floated="left" avatar src={post.user.profilePicUrl} />

              <Card.Header>
                <Link href={`/${post.user.username}`}>
                  <a>{post.user.name}</a>
                </Link>
              </Card.Header>

              <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>

              {post.location && <Card.Meta content={post.location} />}

              <Card.Description
                style={{
                  fontSize: '17px',
                  letterSpacing: '0.1px',
                  wordSpacing: '0.35px',
                }}
              >
                {post.text}
              </Card.Description>
            </Card.Content>

            <Card.Content extra>
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
                      {`${likes.length} ${
                        likes.length === 1 ? 'like' : 'likes'
                      }`}
                    </span>
                  )
                }
              />

              <Divider hidden />

              <div
                style={{
                  overflow: 'auto',
                  height: comments.length > 2 ? '200px' : '60px',
                  marginBottom: '8px',
                  width: '100%',
                }}
              >
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
              </div>

              <CommentInputField
                postId={post._id}
                user={user}
                setComments={setComments}
              />
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid> */}
    </>
  );
};
export default ImageModal;
