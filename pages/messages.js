import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { Segment, Header, Divider, Comment, Grid } from 'semantic-ui-react';
import Chat from '../components/Chats/Chat';
import ChatListSearch from '../components/Chats/ChatListSearch';
import { NoMessages } from '../components/Layout/NoData';
// import Banner from '../components/Messages/Banner';
// import MessageInputField from '../components/Messages/MessageInputField';
// import Message from '../components/Messages/Message';
// import getUserInfo from '../utils/getUserInfo';
// import newMsgSound from '../utils/newMsgSound';
// import cookie from 'js-cookie';
function Messages({ chatsData, user }) {
  const [chats, setChats] = useState(chatsData);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [bannerData, setBannerData] = useState({ name: '', profilePicUrl: '' });

  console.log(messages);
  //ref for persisting the state of query string in url throughout re-renders
  const openChatId = useRef('');

  const socket = useRef();
  //CONNECTION useEffect
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    if (socket.current) {
      socket.current.emit('join', { userId: user._id });

      socket.current.on('connectedUsers', ({ users }) => {
        users.length > 0 && setConnectedUsers(users);
      });

      if (chats.length > 0 && !router.query.message) {
        router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
          shallow: true,
        });
      }
    }

    return () => {
      if (socket.current) {
        socket.current.emit('disconnect');
        socket.current.off();
      }
    };
  }, []);

  useEffect(() => {
    const loadMessages = () => {
      socket.current.emit('loadMessages', {
        userId: user._id,
        messagesWith: router.query.message,
      });

      socket.current.on('messagesLoaded', async ({ chat }) => {
        setMessages(chat.messages);
        setBannerData({
          name: chat.messagesWith.name,
          profilePicUrl: chat.messagesWith.profilePicUrl,
        });

        // openChatId.current = chat.messagesWith._id;
        // divRef.current && scrollDivToBottom(divRef);
      });

      socket.current.on('noChatFound', async () => {
        const { name, profilePicUrl } = await getUserInfo(router.query.message);

        setBannerData({ name, profilePicUrl });
        setMessages([]);

        openChatId.current = router.query.message;
      });
    };

    if (socket.current && router.query.message) loadMessages();
  }, [router.query.message]);

  return (
    <>
      <Segment padded basic size="large" style={{ marginTop: '5px' }}>
        <Header
          icon="home"
          content="Go Back!"
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        />
        <Divider hidden />

        <div style={{ marginBottom: '10px' }}>
          <ChatListSearch chats={chats} setChats={setChats} />
        </div>
        {chats && chats?.length > 0 ? (
          <>
            <Grid stackable>
              <Comment.Group size="big">
                <Grid.Column width={4}>
                  <Segment
                    raised
                    style={{
                      overflow: 'auto',
                      maxHeight: '32rem',
                      width: '20rem',
                    }}
                  >
                    {chats.map((chat, index) => {
                      return (
                        <Chat
                          connectedUsers={connectedUsers}
                          key={index}
                          chat={chat}
                          setChats={setChats}
                        />
                      );
                    })}
                  </Segment>
                </Grid.Column>
              </Comment.Group>
            </Grid>
          </>
        ) : (
          <NoMessages />
        )}
      </Segment>
    </>
  );
}
Messages.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/chats`, {
      headers: { Authorization: token },
    });

    return { chatsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};
export default Messages;
