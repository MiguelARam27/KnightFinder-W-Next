const ChatModel = require('../models/ChatModel');
const UserModel = require('../models/UserModel');
const loadMessages = async (userId, messagesWith) => {
  try {
    const user = await ChatModel.findOne({ user: userId }).populate(
      'chats.messagesWith'
    );

    const chat = user.chats.find(
      (chat) => chat.messagesWith._id.toString() === messagesWith
    );

    if (!chat) {
      return { error: 'No chat found' };
    }

    return { chat };
  } catch (error) {
    console.log(error);
    return;
  }
};

const sendMessage = async (userId, msgSendToUserId, msg) => {
  try {
    // LOGGED IN USER (SENDER)
    const user = await ChatModel.findOne({ user: userId });

    // RECEIVER
    const msgSendToUser = await ChatModel.findOne({ user: msgSendToUserId });

    const newMsg = {
      sender: userId,
      receiver: msgSendToUserId,
      msg,
      date: Date.now(),
    };

    const previousChat = user.chats.find(
      (chat) => chat.messagesWith.toString() === msgSendToUserId
    );

    if (previousChat) {
      previousChat.messages.push(newMsg);
      await user.save();
    }
    //
    else {
      const newChat = { messagesWith: msgSendToUserId, messages: [newMsg] };
      user.chats.unshift(newChat);
      await user.save();
    }

    const previousChatForReceiver = msgSendToUser.chats.find(
      (chat) => chat.messagesWith.toString() === userId
    );

    if (previousChatForReceiver) {
      previousChatForReceiver.messages.push(newMsg);
      await msgSendToUser.save();
    }
    //
    else {
      const newChat = { messagesWith: userId, messages: [newMsg] };
      msgSendToUser.chats.unshift(newChat);
      await msgSendToUser.save();
    }

    return { newMsg };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

const setMessageToUnread = async (userId) => {
  try {
    const user = await UserModel.findById(userId);

    if (!user.unreadMessage) {
      user.unreadMessage = true;
      await user.save();
    }
  } catch (error) {
    console.error(error);
  }
};
const deleteMessage = async (userId, messagesWith, messagesId) => {
  try {
    const user = await ChatModel.findOne({ user: userId });

    const chat = user.chats.find(
      (chat) => chat.messagesWith.toString() === messagesWith
    );

    if (!chat) {
      return;
    }
    const messagetoDelete = chat.messages.find(
      (message) => message._id.toString() === messagesId
    );

    if (!messagetoDelete) {
      return;
    }
    if (messagetoDelete.sender.toString() !== userId) {
      return;
    }
    const indexOf = chat.messages
      .map((message) => message._id.toString())
      .indexOf(messagetoDelete._id.toString());

    await chat.messages.splice(indexOf, 1);
    await user.save();

    return { success: true };
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  loadMessages,
  sendMessage,
  setMessageToUnread,
  deleteMessage,
};
