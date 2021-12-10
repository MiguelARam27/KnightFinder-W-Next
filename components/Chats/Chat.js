import React from 'react';
import { Divider, Comment, Icon, List } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import calculateTime from '../../utils/calculatedTime';
import styles from '@/styles/MessagesPage.module.scss';
function Chat({ chat, connectedUsers, deleteChat }) {
  const router = useRouter();

  const isOnline =
    connectedUsers.length > 0 &&
    connectedUsers.filter((user) => user.userId === chat.messagesWith).length >
      0;

  return (
    <>
      <div
        className={styles.chat}
        onClick={() =>
          router.push(`/messages?message=${chat.messagesWith}`, undefined, {
            shallow: true,
          })
        }
      >
        <div className={styles.avatar}>
          <img src={chat.profilePicUrl} />
        </div>
        <div className={styles.info}>
          <div className="name">
            {chat.name}{' '}
            {isOnline && <Icon name="circle" size="small" color="green" />}
          </div>
          <div className={styles.date}>{calculateTime(chat.date)}</div>
          <Comment.Text>
            {chat.lastMessage.length > 20
              ? `${chat.lastMessage.substring(0, 20)} ...`
              : chat.lastMessage}
          </Comment.Text>
          <div className={styles.deleteIcon}>
            <Icon
              name="trash alternate"
              color="red"
              onClick={() => deleteChat(chat.messagesWith)}
            />
          </div>
        </div>

        {/* <Comment>
          <Comment.Avatar src={chat.profilePicUrl} />
          <Comment.Content>
            <Comment.Author as="a">
              {chat.name}{' '}
              {isOnline && <Icon name="circle" size="small" color="green" />}
            </Comment.Author>

            <Comment.Metadata>
              <div>{calculateTime(chat.date)}</div>
              <div
                style={{
                  position: 'absolute',
                  right: '10px',
                  cursor: 'pointer',
                }}
              >
                <Icon
                  name="trash alternate"
                  color="red"
                  onClick={() => deleteChat(chat.messagesWith)}
                />
              </div>
            </Comment.Metadata>

            <Comment.Text>
              {chat.lastMessage.length > 20
                ? `${chat.lastMessage.substring(0, 20)} ...`
                : chat.lastMessage}
            </Comment.Text>
          </Comment.Content>
        </Comment> */}
      </div>
      {/* <List selection>
        <List.Item
          active={router.query.message === chat.messagesWith}
          onClick={() =>
            router.push(`/messages?message=${chat.messagesWith}`, undefined, {
              shallow: true,
            })
          }
        >
          <Comment>
            <Comment.Avatar src={chat.profilePicUrl} />
            <Comment.Content>
              <Comment.Author as="a">
                {chat.name}{' '}
                {isOnline && <Icon name="circle" size="small" color="green" />}
              </Comment.Author>

              <Comment.Metadata>
                <div>{calculateTime(chat.date)}</div>
                <div
                  style={{
                    position: 'absolute',
                    right: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <Icon
                    name="trash alternate"
                    color="red"
                    onClick={() => deleteChat(chat.messagesWith)}
                  />
                </div>
              </Comment.Metadata>

              <Comment.Text>
                {chat.lastMessage.length > 20
                  ? `${chat.lastMessage.substring(0, 20)} ...`
                  : chat.lastMessage}
              </Comment.Text>
            </Comment.Content>
          </Comment>
        </List.Item>
      </List>
      <Divider /> */}
    </>
  );
}

export default Chat;
