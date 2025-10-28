import { WebSocketServer } from "ws";

// create a ws server
const wss = new WebSocketServer({ port: 8080 });

// event handler
wss.on("connection", function (socket) {
  console.log("user connected");
  // setInterval(() => {
  //   socket.send("Current price of solana is " + Math.random());
  // }, 500);
  // server sends a message
  // socket.send("hello");
  
  // client sends a message
  socket.on("message", function (e) {
    console.log(e.toString());
  });

  socket.on("message", function (e) {
    if(e.toString().toLowerCase() === "ping"){
      socket.send("pong");
    }
  });
});
// socket is the connection to the client
// a place from where i can send and receive data
