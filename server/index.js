const app = require('express')();
const http = require('http').Server(app);
const socketio = require('socket.io');
const io = socketio(http);

const PORT = process.env.PORT || 8080

io.on('connection', (socket) => {
  socket.on("join", ({user}) => {
    const id = 0
    socket.join(`room_${id}`);
    console.log(`${user} joined the room "room_${id}"`)

    io.to(`room_${id}`).emit("message", {message: `Hello ${user}!`, user: "Bot"})
    socket.on("leave", () => {
      socket.leave(`room_${id}`)
      console.log(`${user} left the room "room_${id}"`)
    })

    socket.on('message', (msg) => {
      console.log(msg)
      io.to(`room_${id}`).emit('message', msg);
    });
  })

});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});