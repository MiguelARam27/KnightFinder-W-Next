import React from 'react';
import { Divider, Feed } from 'semantic-ui-react';
import calculateTime from '../../utils/calculatedTime';
import styles from '@/styles/NotificationsPage.module.scss';

function CommentNotification({ notification }) {
  return (
    <>
      <div className="event">
        <div className="label">
          <img src={notification.user.profilePicUrl} />
        </div>
        <div className="content">
          <div className="summary">
            <a className={styles.link} href={`/${notification.user.username}`}>
              {notification.user.name}
            </a>{' '}
            commented on your{' '}
            <a className={styles.link} href={`/post/${notification.post._id}`}>
              post.
            </a>
            <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
          </div>

          {notification.post.picUrl && (
            <Feed.Extra images>
              <a href={`/post/${notification.post._id}`}>
                <img src={notification.post.picUrl} />
              </a>
            </Feed.Extra>
          )}
          <Feed.Extra text>
            <strong>"{notification.text}"</strong>
          </Feed.Extra>
        </div>
      </div>
      <Divider />
    </>
  );
}

export default CommentNotification;
