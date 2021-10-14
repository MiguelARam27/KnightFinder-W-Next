import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import CreatePost from '../components/post/CreatePost';
import CardPost from '../components/post/CardPost';
import { NoPosts } from '../components/Layout/NoData';
import { parseCookies } from 'nookies';
import { Segment } from 'semantic-ui-react';
import { PostDeleteToastr } from '../components/Layout/Toastr';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  PlaceHolderPosts,
  EndMessage,
} from '../components/Layout/PlaceHolderGroup';
import cookie from 'js-cookie';
import getUserInfo from '../utils/getUserInfo';
import MessageNotificationModal from '../components/Home/MessageNotificationModal';
import NotificationPortal from '../components/Home/NotificationPortal';
function Index({ user, postsData, errorLoading }) {
  const [posts, setPosts] = useState(postsData || []);
  const [showToastr, setShowToastr] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [pageNumber, setPageNumber] = useState(2);

  const socket = useRef();
  const [newMessageReceived, setnewMessageReceived] = useState(null);
  const [newMessageModal, showNewMessageModal] = useState(false);

  const [newNotification, setNewNotification] = useState(null);
  const [notificationPopup, showNotificationPopup] = useState(false);
  useEffect(() => {
    document.title = `Welcome, ${user.name.split(' ')[0]}`;
    if (!socket.current) {
      socket.current = io(baseUrl);
    }
    if (socket.current) {
      socket.current.emit('join', { userId: user._id });

      socket.current.on('newMsgReceived', async ({ newMsg }) => {
        const { name, profilePicUrl } = await getUserInfo(newMsg.sender);

        if (user.newMessagePopup) {
          setnewMessageReceived({
            ...newMsg,
            senderName: name,
            senderProfilePic: profilePicUrl,
          });
          showNewMessageModal(true);
        }
      });
    }

    return () => {
      if (socket.current) {
        socket.current.emit('disconnect');
        socket.current.off();
      }
    };
  }, []);

  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000);
  }, [showToastr]);
  if (posts.length === 0 || errorLoading) {
    return (
      <>
        <Segment>
          <CreatePost user={user} setPosts={setPosts} />
          <NoPosts />
        </Segment>
      </>
    );
  }

  const fetchDataOnScroll = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/posts`, {
        headers: { Authorization: cookie.get('token') },
        params: { pageNumber },
      });
      if (res.data.length === 0) {
        setHasMore(false);
      }

      setPosts((prev) => [...prev, ...res.data]);
    } catch (error) {
      alert('Error Fetching Posts');
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on(
        'newNotificationReceived',
        ({ name, profilePicUrl, username, postId }) => {
          setNewNotification({ name, profilePicUrl, username, postId });

          showNotificationPopup(true);
        }
      );
    }
  }, []);

  console.log(notificationPopup && newNotification !== null);
  return (
    <>
      {notificationPopup && newNotification !== null && (
        <NotificationPortal
          newNotification={newNotification}
          notificationpopup={notificationPopup}
          showNotificationPopup={showNotificationPopup}
        />
      )}
      {showToastr && <PostDeleteToastr />}

      {newMessageModal && newMessageReceived !== null && (
        <MessageNotificationModal
          socket={socket}
          showNewMessageModal={showNewMessageModal}
          newMessageModal={newMessageModal}
          newMessageReceived={newMessageReceived}
          user={user}
        />
      )}
      <Segment>
        <CreatePost user={user} setPosts={setPosts} />

        <InfiniteScroll
          hasMore={hasMore}
          next={fetchDataOnScroll}
          loader={<PlaceHolderPosts />}
          endMessage={<EndMessage />}
          dataLength={posts.length}
        >
          {posts.map((post) => (
            <CardPost
              socket={socket}
              key={post._id}
              post={post}
              user={user}
              setPosts={setPosts}
              setShowToastr={setShowToastr}
            />
          ))}
        </InfiniteScroll>
      </Segment>
    </>
  );
}
Index.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Authorization: token },
      params: { pageNumber: 1 },
    });

    return { postsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};
export default Index;
