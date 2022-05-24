const { ip2position, distance } = require('./utils/ip2position');

let users = [];

const SocketServer = socket => {
  //connect
  socket.on('joinUser', data => {
    // console.log('SOCKET POSITION:', data.position);
    if (!data.position) {
      // console.log('SOCKET CONNECT:', socket.handshake.headers);
      if (data.ipv4) {
        data.position = ip2position(data.ipv4);
      } else {
        if (socket.handshake.headers['x-forwarded-for'])
          data.position = ip2position(
            socket.handshake.headers['x-forwarded-for']
          );
      }
    }
    users.push({ id: data.id, socketId: socket.id, position: data.position });
    console.log('usersJoin', users);
  });

  //disconnect
  socket.on('disconnect', () => {
    users = users.filter(user => user.socketId !== socket.id);
    console.log('disconnect', users);
  });

  //like
  socket.on('like', data => {
    console.log('like', users);
    if (users.length > 0) {
      users.forEach(user => {
        socket.to(user.socketId).emit('likeToClient', data);
      });
    }
  });

  // unlike
  socket.on('unlike', data => {
    console.log('unlike', users);
    if (users.length > 0) {
      users.forEach(user => {
        socket.to(user.socketId).emit('unlikeToClient', data);
      });
    }
  });

  //comment Post
  socket.on('createComment', data => {
    console.log('createComment', users);
    if (users.length > 0) {
      users.forEach(user => {
        socket.to(user.socketId).emit('createCommentToClient', data);
      });
    }
  });

  //Delete comment Post
  socket.on('deleteComment', data => {
    console.log('deleteComment', users);
    if (users.length > 0) {
      users.forEach(user => {
        socket.to(user.socketId).emit('deleteCommentToClient', data);
      });
    }
  });

  //Follow
  socket.on('follow', data => {
    const user = users.filter(user => user.id === data.id);
    if (user.length > 0) {
      socket.to(user[0].socketId).emit('followToClient', data);
    }
  });

  //unfollow
  socket.on('unfollow', data => {
    const user = users.filter(user => user.id === data.id);
    if (user.length > 0) {
      socket.to(user[0].socketId).emit('unfollowToClient', data);
    }
  });

  //create notify
  socket.on('createNotify', data => {
    // console.log("socket server")
    const clients = users.filter(user => data.recipients.includes(user.id));
    console.log(clients);
    if (clients.length > 0) {
      clients.forEach(user => {
        socket.to(user.socketId).emit('createNotifyToClient', data);
      });
    }
  });

  //delete notify
  socket.on('deleteNotify', data => {
    const clients = users.filter(user => data.recipients.includes(user.id));
    if (clients.length > 0) {
      clients.forEach(user => {
        socket.to(user.socketId).emit('deleteNotifyToClient', data);
      });
    }
  });

  //add message
  socket.on('addMessage', data => {
    // console.log('data',data.recipients);
    // console.log('users',users);
    const clients = users.filter(user => data.recipients.includes(user.id));
    // console.log('clients',clients);
    if (clients.length > 0) {
      clients.forEach(user => {
        socket.to(user.socketId).emit('addMessageToClient', data);
      });
    }
  });

  //help
  socket.on('createHelp', data => {
    console.log(data);
    const clients = users.filter(
      user =>
        distance(user.position, {
          longitude: data.position[0],
          latitude: data.position[1]
        }) < 5000
    );
    console.log('CREATE HELP USER RECEIVE:', clients);
    if (clients.length > 0) {
      clients.forEach(user => {
        socket.to(user.socketId).emit('addHelpToClient', data);
      });
    }
  });

  socket.on('updateHelp', data => {
    const clients = users.filter(
      user =>
        distance(user.position, {
          longitude: data.position[0],
          latitude: data.position[1]
        }) < 5000
    );
    console.log('clients', clients);
    if (clients.length > 0) {
      clients.forEach(user => {
        socket.to(user.socketId).emit('updateHelpToClient', data);
      });
    }
  });

  socket.on('deleteHelp', id => {
    if (users.length > 0) {
      users.forEach(user => {
        socket.to(user.socketId).emit('deleteHelpToClient', id);
      });
    }
  });

  socket.on('position-change', data => {
    if (clients.length > 0) {
      clients.map(user =>
        user.id === data.id
          ? {
              ...user,
              position: data.position
            }
          : user
      );
    }
  });
};

module.exports = SocketServer;
