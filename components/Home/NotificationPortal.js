import { Segment, TransitionablePortal, Icon, Feed } from 'semantic-ui-react';
// import newMsgSound from '../../utils/newMsgSound';
import { useRouter } from 'next/router';
import calculateTime from '../../utils/calculatedTime';

function NotificationPortal({
  newNotification,
  notificationPopup,
  showNotificationPopup,
}) {
  const router = useRouter();

  const { name, profilePicUrl, username, postId } = newNotification;

  console.log('loaded');
  return (
    <TransitionablePortal
      // transition={{ animation: 'fade left', duration: '500' }}
      onClose={() => notificationPopup && showNotificationPopup(false)}
      // onOpen={alert('open')}
      open={notificationPopup}
    >
      <div
        style={{ width: '20rem', height: '20rem', backgroundColor: 'black' }}
        className="salt"
      >
        <h1 style={{ color: 'white' }}>hello</h1>
      </div>
      {/* <Segment
        style={{
          right: '50%',
          position: 'fixed',
          top: '20%',
          width: '20rem',
          zIndex: 1000,
        }}
      >
        <Icon
          name="close"
          size="large"
          style={{ float: 'right', cursor: 'pointer' }}
          onClick={() => showNotificationPopup(false)}
        />

        <Feed>
          <Feed.Event>
            <Feed.Label>
              <img src={profilePicUrl} />
            </Feed.Label>
            <Feed.Content>
              <Feed.Summary>
                <Feed.User onClick={() => router.push(`/${username}`)}>
                  {name}{' '}
                </Feed.User>{' '}
                liked your{' '}
                <a onClick={() => router.push(`/post/${postId}`)}> post</a>
                <Feed.Date>{calculateTime(Date.now())}</Feed.Date>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        </Feed>
      </Segment> */}
    </TransitionablePortal>
  );
}

export default NotificationPortal;
