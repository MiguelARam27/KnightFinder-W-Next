import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import { Feed, Segment, Divider, Container } from 'semantic-ui-react';

import { parseCookies } from 'nookies';
import cookie from 'js-cookie';
import { NoNotifications } from '../components/Layout/NoData';

import LikeNotification from '../components/Notifications/LikeNotification';
import CommentNotification from '../components/Notifications/CommentNotification';
import FollowerNotification from '../components/Notifications/FollowerNotification';

import styles from '@/styles/NotificationsPage.module.scss';
function Notifications({ notifications, errorLoading, user, userFollowStats }) {
  const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats);

  useEffect(() => {
    const notificationRead = async () => {
      try {
        await axios.post(
          `${baseUrl}/api/notifications`,
          {},
          { headers: { Authorization: cookie.get('token') } }
        );
      } catch (error) {
        console.log(error);
      }
    };

    notificationRead();
  }, []);
  return (
    <>
      <div className={`${styles.container} container`}>
        {notifications.length > 0 ? (
          <Segment raised>
            <Feed size="small">
              {notifications.map((notification, key) => (
                <React.Fragment key={key}>
                  {notification.type === 'newLike' &&
                    notification.post !== null && (
                      <LikeNotification
                        key={notification._id}
                        notification={notification}
                      />
                    )}

                  {notification.type === 'newComment' &&
                    notification.post !== null && (
                      <CommentNotification
                        key={notification._id}
                        notification={notification}
                      />
                    )}

                  {notification.type === 'newFollower' && (
                    <FollowerNotification
                      key={notification._id}
                      notification={notification}
                      loggedUserFollowStats={loggedUserFollowStats}
                      setUserFollowStats={setUserFollowStats}
                    />
                  )}
                </React.Fragment>
              ))}
            </Feed>
          </Segment>
        ) : (
          <NoNotifications />
        )}
        <Divider hidden />
      </div>
    </>
  );
}

Notifications.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/notifications`, {
      headers: { Authorization: token },
    });

    return { notifications: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default Notifications;
