const express = require('express');
const app = express();
const server = require('http').Server(app);
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const io = require('socket.io')(server);
const {
  addUser,
  removeUser,
  findConnectedUser,
} = require('./utilsServer/roomActions');
const {
  loadMessages,
  sendMessage,
  setMessageToUnread,
  deleteMessage,
} = require('./utilsServer/messageActions');

const { likeOrUnlikePost } = require('./utilsServer/likeActions');
require('dotenv').config({ path: './.env' });
const connectDb = require('./utilsServer/connectDb');
connectDb();
app.use(express.json());
const PORT = process.env.PORT || 3000;
io.on('connection', (socket) => {
  socket.on('join', async ({ userId }) => {
    const users = await addUser(userId, socket.id);

    setInterval(() => {
      socket.emit('connectedUsers', {
        users: users.filter((user) => user.userId !== userId),
      });
    }, 10000);
  });

  socket.on('likePost', async ({ postId, userId, like }) => {
    const { success, error } = await likeOrUnlikePost(postId, userId, like);

    if (success) {
      socket.emit('postLiked');
    }
  });

  socket.on('loadMessages', async ({ userId, messagesWith }) => {
    const { chat, error } = await loadMessages(userId, messagesWith);

    !error
      ? socket.emit('messagesLoaded', { chat })
      : socket.emit('noChatFound');
  });

  socket.on('sendNewMessage', async ({ userId, msgSendToUserId, msg }) => {
    const { newMsg, error } = await sendMessage(userId, msgSendToUserId, msg);

    const receiverSocket = findConnectedUser(msgSendToUserId);

    if (receiverSocket) {
      // WHEN YOU WANT TO SEND MESSAGE TO A PARTICULAR SOCKET
      io.to(receiverSocket.socketId).emit('newMsgReceived', { newMsg });
    } else {
      await setMessageToUnread(msgSendToUserId);
    }

    if (!error) {
      socket.emit('messageSent', { newMsg });
    }
  });
  socket.on('deleteMessage', async ({ userId, messagesWith, messageId }) => {
    const { success } = await deleteMessage(userId, messagesWith, messageId);

    if (success) {
      socket.emit('messageDeleted');
    }
  });

  socket.on(
    'sendMessageFromNotification',
    async ({ userId, msgSendToUserId, msg }) => {
      const { newMsg, error } = await sendMessage(userId, msgSendToUserId, msg);
      const receiverSocket = findConnectedUser(msgSendToUserId);

      if (receiverSocket) {
        // WHEN YOU WANT TO SEND MESSAGE TO A PARTICULAR SOCKET
        io.to(receiverSocket.socketId).emit('newMsgReceived', { newMsg });
      }
      //
      else {
        await setMsgToUnread(msgSendToUserId);
      }

      if (!error) {
        socket.emit('messageSentFromNotifications');
      }
    }
  );

  socket.on('disconnect', () => {
    removeUser(socket.id);
  });
});
nextApp.prepare().then(() => {
  app.use('/api/signup', require('./api/signup'));
  app.use('/api/auth', require('./api/auth'));
  app.use('/api/search', require('./api/search'));
  app.use('/api/posts', require('./api/posts'));
  app.use('/api/profile', require('./api/profile'));
  app.use('/api/notifications', require('./api/notifications'));
  app.use('/api/chats', require('./api/chats'));
  app.use('/api/reset', require('./api/reset'));
  app.all('*', (req, res) => handle(req, res));

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Express server running ${PORT}`);
  });
});
