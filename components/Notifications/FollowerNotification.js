import React, { useState } from 'react';
import { Feed, Button, Divider } from 'semantic-ui-react';
import calculateTime from '../../utils/calculatedTime';
import { followUser, unfollowUser } from '../../utils/profileActions';
import styles from '@/styles/NotificationsPage.module.scss';

function FollowerNotification({
  notification,
  loggedUserFollowStats,
  setUserFollowStats,
}) {
  const [disabled, setDisabled] = useState(false);

  const isFollowing =
    loggedUserFollowStats.following.length > 0 &&
    loggedUserFollowStats.following.filter(
      (following) => following.user === notification.user._id
    ).length > 0;

  return (
    <>
      <div className="event">
        <div className="label">
          <img src={notification.user.profilePicUrl} alt="Profile pic" />
        </div>
        <div className="content">
          <div className="summary">
            <a className={styles.link} href={`/${notification.user.username}`}>
              {' '}
              {notification.user.name}{' '}
            </a>
            started following you.
            <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
          </div>
        </div>
      </div>

      <Divider />
    </>
  );
}

export default FollowerNotification;
