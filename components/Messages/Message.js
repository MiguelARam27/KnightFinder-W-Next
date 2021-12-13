import React, { useState } from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import calculateTime from '../../utils/calculatedTime';
function Message({
  message,
  user,
  deleteMessage,
  bannerProfilePic,
  MessageDivRef,
}) {
  const [deleteIcon, showDeleteIcon] = useState(false);

  const isSender = message.sender === user._id;

  return (
    <div className="bubbleWrapper" ref={MessageDivRef}>
      <div
        className={isSender ? 'inlineContainer own' : 'inlineContainer'}
        onClick={() => isSender && showDeleteIcon(!deleteIcon)}
      >
        <img
          className="inlineIcon"
          src={isSender ? user.profilePicUrl : bannerProfilePic}
        />
        <div className={isSender ? 'ownBubble own' : 'otherBubble other'}>
          {message.msg}
        </div>
        {deleteIcon && (
          <Popup
            trigger={
              <Icon
                name="trash"
                color="red"
                style={{ cursor: 'pointer' }}
                onClick={() => deleteMessage(message._id)}
              />
            }
            content="This will only delete the message from your inbox!"
            position="top right"
          />
        )}
      </div>
      <span className={isSender ? 'own' : 'other'}>
        {calculateTime(message.date)}
      </span>
    </div>
  );
}

export default Message;
