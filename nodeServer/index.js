
// to handle cors error
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
// Specify CORS options
const corsOptions = {
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST"]
};

// Create Socket.IO server with CORS options
const io = new Server(httpServer, {
  cors: corsOptions
});

httpServer.listen(8000);


const users = {};


// socket io instance which listen 
io.on('connection', socket =>{
    socket.on('new-user-joined', name => {
        // handle particular conneciton
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });

    // when someone send chat message
    socket.on('send', message => {
       socket.broadcast.emit('receive', {name: users[socket.id], message: message })
    });


    socket.on('disconnect', message => {
      socket.broadcast.emit('left', users[socket.id])
      delete users[socket.id]
   });

})

