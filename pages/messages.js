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
import Banner from '../components/Messages/Banner';
import MessageInputField from '../components/Messages/MessageInputField';
import Message from '../components/Messages/Message';
import getUserInfo from '../utils/getUserInfo';
import newMsgSound from '../utils/newMsgSound';
import cookie from 'js-cookie';
import styles from '@/styles/MessagesPage.module.scss';
// import cookie from 'js-cookie';

const scrollDivToBottom = (divRef) => {
  divRef.current !== null &&
    divRef.current.scrollIntoView({ behavior: 'smooth' });
};
function Messages({ chatsData, user }) {
  const [chats, setChats] = useState(chatsData);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const router = useRouter();

  const [messages, setMessages] = useState([]);

  const [bannerData, setBannerData] = useState({ name: '', profilePicUrl: '' });

  //scroll ref
  const MessageDivRef = useRef();

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

  //load messages use effect

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

        openChatId.current = chat.messagesWith._id;
        MessageDivRef.current && scrollDivToBottom(MessageDivRef);
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

  const sendMessage = (message) => {
    if (socket.current) {
      socket.current.emit('sendNewMessage', {
        userId: user._id,
        msgSendToUserId: openChatId.current,
        msg: message,
      });
    }
  };

  //confirming message and receiving messages
  useEffect(() => {
    if (socket.current) {
      socket.current.on('messageSent', ({ newMsg }) => {
        if (newMsg.receiver === openChatId.current) {
          setMessages((prev) => [...prev, newMsg]);
        }

        setChats((prev) => {
          const previousChat = prev.find(
            (chat) => chat.messagesWith === newMsg.receiver
          );
          previousChat.lastMessage = newMsg.msg;
          previousChat.date = newMsg.date;
          return [...prev];
        });
      });

      socket.current.on('newMsgReceived', async ({ newMsg }) => {
        let senderName;

        // WHEN CHAT WITH SENDER IS CURRENTLY OPENED INSIDE YOUR BROWSER
        if (newMsg.sender === openChatId.current) {
          setMessages((prev) => [...prev, newMsg]);

          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.messagesWith === newMsg.sender
            );
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;

            senderName = previousChat.name;

            return [...prev];
          });
        } else {
          const ifPreviouslyMessaged =
            chats.filter((chat) => chat.messagesWith === newMsg.sender).length >
            0;

          if (ifPreviouslyMessaged) {
            setChats((prev) => {
              const previousChat = prev.find(
                (chat) => chat.messagesWith === newMsg.sender
              );
              previousChat.lastMessage = newMsg.msg;
              previousChat.date = newMsg.date;
              senderName = previousChat.name;

              return [...prev];
            });
          } else {
            const { name, profilePicUrl } = await getUserInfo(newMsg.sender);
            senderName = name;
            const newChat = {
              messagesWith: newMsg.sender,
              name,
              profilePicUrl,
              lastMessage: newMsg.msg,
              date: newMsg.date,
            };
            setChats((prev) => [newChat, ...prev]);
          }
        }

        // newMsgSound(senderName);
      });
    }
  }, []);

  // use Effect to scroll to bottom
  useEffect(() => {
    messages.length > 0 && scrollDivToBottom(MessageDivRef);
  }, [messages]);

  const deleteMessage = (messageId) => {
    if (socket.current) {
      socket.current.emit('deleteMessage', {
        userId: user._id,
        messagesWith: openChatId.current,
        messageId,
      });

      socket.current.on('messageDeleted', () => {
        setMessages((prev) =>
          prev.filter((message) => message._id !== messageId)
        );
      });
    }
  };

  const deleteChat = async (messagesWith) => {
    try {
      await axios.delete(`${baseUrl}/api/chats/${messagesWith}`, {
        headers: { Authorization: cookie.get('token') },
      });

      setChats((prev) =>
        prev.filter((chat) => chat.messagesWith !== messagesWith)
      );
      router.push('/messages', undefined, { shallow: true });
    } catch (error) {
      console.log(error);
      alert('Error deleting chat');
    }
  };

  return (
    <>
      <div className={styles.top}>
        <div className="ui header" onClick={() => router.push('/home')}>
          <i aria-hidden="true" className="home icon"></i>
          <div className="content">
            <span className={styles.header}>Home</span>
          </div>
        </div>
      </div>
      <div className={styles.messagesWrapper}>
        <Divider hidden />
        <div className={styles.messagesWrapper}>
          <div className={styles.leftContainer}>
            <div className={styles.searchContainer}>
              <ChatListSearch chats={chats} setChats={setChats} />
            </div>

            <div className="segment">
              {chats.map((chat, index) => {
                return (
                  <Chat
                    connectedUsers={connectedUsers}
                    key={index}
                    chat={chat}
                    setChats={setChats}
                    deleteChat={deleteChat}
                  />
                );
              })}
            </div>
          </div>
          <div className={styles.rightContainer}>
            {chats && chats?.length > 0 ? (
              <>
                {router.query.message && (
                  <>
                    {messages.length > 0 && (
                      <>
                        <div className={styles.banner}>
                          <Banner bannerData={bannerData} />
                        </div>
                        <div className={styles.messagesContainer}>
                          {messages.map((message, index) => (
                            <Message
                              key={index}
                              bannerProfilePic={bannerData.profilePicUrl}
                              message={message}
                              user={user}
                              setMessages={setMessages}
                              messagesWith={openChatId.current}
                              MessageDivRef={MessageDivRef}
                              deleteMessage={deleteMessage}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    <div className={styles.messageInputContainer}>
                      <MessageInputField sendMessage={sendMessage} />
                    </div>
                  </>
                )}
              </>
            ) : (
              <NoMessages />
            )}
          </div>
        </div>

        {/* <div style={{ marginBottom: '10px' }}>
          <ChatListSearch chats={chats} setChats={setChats} />
        </div> */}
        {/* {chats && chats?.length > 0 ? (
          <>
            <Grid stackable>
              <Grid.Column width={4}>
                <Comment.Group size="big">
                  <Segment
                    raised
                    style={{
                      overflow: 'scroll',
                      maxHeight: '15rem',
                    }}
                  >
                    <ChatListSearch chats={chats} setChats={setChats} />
                    {chats.map((chat, index) => {
                      return (
                        <Chat
                          connectedUsers={connectedUsers}
                          key={index}
                          chat={chat}
                          setChats={setChats}
                          deleteChat={deleteChat}
                        />
                      );
                    })}
                  </Segment>
                </Comment.Group>
              </Grid.Column>
              <Grid.Column width={12}>
                {router.query.message && (
                  <>
                    <div
                      style={{
                        overflow: 'auto',
                        overflowX: 'hidden',
                        height: '50rem',
                        backgroundColor: 'whitesmoke',
                      }}
                    >
                      {messages.length > 0 && (
                        <>
                          <div
                            style={{
                              position: 'sticky',
                              top: '0',
                            }}
                          >
                            <Banner bannerData={bannerData} />
                          </div>
                          {messages.map((message, index) => (
                            <Message
                              key={index}
                              bannerProfilePic={bannerData.profilePicUrl}
                              message={message}
                              user={user}
                              setMessages={setMessages}
                              messagesWith={openChatId.current}
                              MessageDivRef={MessageDivRef}
                              deleteMessage={deleteMessage}
                            />
                          ))}
                        </>
                      )}
                    </div>
                    <MessageInputField sendMessage={sendMessage} />
                  </>
                )}
              </Grid.Column>
            </Grid>
          </>
        ) : (
          <NoMessages />
        )} */}
      </div>
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
