import React, { useState } from 'react';
import { Form, Modal, Segment, List, Icon } from 'semantic-ui-react';
import Link from 'next/link';
import calculateTime from '../../utils/calculatedTime';
function MessageNotificationModal({
  socket,
  showNewMessageModal,
  newMessageModal,
  newMessageReceived,
  user,
}) {
  const [messageText, setText] = useState('');
  const [loading, setLoading] = useState(false);

  console.log(newMessageReceived);
  const formSubmit = (e) => {
    alert('here');
    e.preventDefault();
    if (socket.current) {
      socket.current.emit('sendMessageFromNotification', {
        userId: user._id,
        msgSendToUserId: newMessageReceived.sender,
        msg: messageText,
      });

      socket.current.on('messageSentFromNotifications', () => {
        showNewMessageModal(false);
      });
    }
  };
  const onModalClose = () => showNewMessageModal(false);
  return (
    <>
      <Modal size="medium" open={newMessageModal} onClose={onModalClose}>
        <Modal.Header
          content={`New message from ${newMessageReceived?.senderName} `}
        />

        <Modal.Content>
          <div className="bubbleWrapper">
            <div className="inlineContainer">
              <img
                src={newMessageReceived.senderProfilePic}
                alt="messenger profile pic"
                className="inlineIcon"
              />
            </div>
            <div className="otherBubble other">{newMessageReceived.msg}</div>

            <span className="other">
              {calculateTime(newMessageReceived.date)}
            </span>
          </div>
          <div style={{ position: 'sticky', bottom: '0px' }}>
            <Segment secondary color="teal" attached="bottom">
              <Form reply onSubmit={formSubmit}>
                <Form.Input
                  size="large"
                  placeholder="Send New Message"
                  value={messageText}
                  onChange={(e) => setText(e.target.value)}
                  action={{
                    color: 'blue',
                    icon: 'telegram plane',
                    disabled: messageText === '',
                    loading: loading,
                  }}
                />
              </Form>
            </Segment>
          </div>
          <div style={{ marginTop: '5px' }}>
            <Link href={`/messages?message=${newMessageReceived.sender}`}>
              <a>view all messages</a>
            </Link>
            <br />
            <Instructions username={user.username} />
          </div>
        </Modal.Content>
      </Modal>
    </>
  );
}

const Instructions = ({ username }) => (
  <List>
    <List.Item>
      <Icon name="help" />
      <List.Content>
        <List.Header>
          If you do not like this popup to appear when you receive a new
          message:
        </List.Header>
      </List.Content>
    </List.Item>

    <List.Item>
      <Icon name="hand point right" />
      <List.Content>
        You can disable it by going to
        <Link href={`/${username}`}>
          <a> Account </a>
        </Link>
        Page and clicking on Settings Tab.
      </List.Content>
    </List.Item>

    <List.Item>
      <Icon name="hand point right" />
      Inside the menu,there is an setting named: Show New Message Popup?
    </List.Item>

    <List.Item>
      <Icon name="hand point right" />
      Just toggle the setting to disable/enable the Message Popup to appear.
    </List.Item>
  </List>
);

export default MessageNotificationModal;
