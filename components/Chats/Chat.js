import React from 'react';
import { Divider, Comment, Icon, List } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import calculateTime from '../../utils/calculatedTime';
import styles from '@/styles/MessagesPage.module.scss';
function Chat({ chat, connectedUsers, deleteChat }) {
  const router = useRouter();

  const { message } = router.query;

  const isOnline =
    connectedUsers.length > 0 &&
    connectedUsers.filter((user) => user.userId === chat.messagesWith).length >
      0;

  return (
    <>
      <div
        className={
          message === chat.messagesWith
            ? `${styles.chat} ${styles.activeChat}`
            : styles.chat
        }
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
          <div className={styles.user}>
            <div>
              <span>{chat.name}</span>
              {isOnline ? (
                <Icon name="circle" size="small" color="green" />
              ) : (
                <Icon name="circle" size="small" color="red" />
              )}{' '}
            </div>

            <div className={styles.date}>{calculateTime(chat.date)}</div>
          </div>

          <Comment.Text>
            {chat.lastMessage.length > 20
              ? `${chat.lastMessage.substring(0, 20)} ...`
              : chat.lastMessage}
          </Comment.Text>
        </div>

        {/* <div className={styles.deleteIcon}>
          <Icon
            name="trash alternate"
            color="red"
            onClick={() => deleteChat(chat.messagesWith)}
          />
        </div> */}
      </div>
    </>
  );
}

export default Chat;
