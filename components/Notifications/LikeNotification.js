import React from 'react';
import { Feed, Divider } from 'semantic-ui-react';
import calculateTime from '../../utils/calculatedTime';
import styles from '@/styles/NotificationsPage.module.scss';
function LikeNotification({ notification }) {
  return (
    <>
      <div className="event">
        <div className="label">
          <img src={notification.user.profilePicUrl} alt="user profile pic" />
        </div>
        <div className="content">
          <div className="summary">
            <a className={styles.link} href={`/${notification.user.username}`}>
              {notification.user.name}
            </a>{' '}
            Liked your post{' '}
            <a className={styles.link} href={`/post/${notification.post._id}`}>
              post.
            </a>
            <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
          </div>

          {notification.post.picUrl && (
            <div className="images extra">
              <a href={`/post/${notification.post._id}`}>
                <img src={notification.post.picUrl} />
              </a>
            </div>
          )}
        </div>
      </div>

      <Divider />
    </>
  );
}

export default LikeNotification;
