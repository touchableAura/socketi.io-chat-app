const express = require('express'); // import express framework 
const app = express(); // create an express application
const socketIo = require('socket.io'); // import socket.io library
const http = require('http'); //import node.js's 'http' module
const PORT = 3000; // sets port# for the server to 3000 



// create a endpoint for handling HTTP GET request to root URL of the server ('/')
// when GET request is made to root URL of server, the function is executed
// chat.html file is send to the same dir as server.js as a response to the client
// this allows users to access the chat app by navigating to the root URL of the server in the browser 
app.get('/', (req, res)=>{
    res.sendFile(`${__dirname}/chat.html`);
})

// create instance of http server
// socket.io listen() and sets up the server to 
// listen for websocket connections as well as HTTP requests
const httpServer = http.createServer(app).listen(PORT);

// count of users connected to the server at one time
let totalUsers = 0;

// also listen for a possible socket io connection from the client
// io represents the socket server and listens for events using the 'on' method
const io = socketIo(httpServer);



io.on('connection', socket=>{
    console.log(`server: 'new server connection'`);
    socket.emit('welcome', `Welcome to the chat server!`);
    totalUsers += 1;
    console.log(`number of people connected to port ${PORT}: ` + totalUsers)
    
    
    // update numer of users currently connected 
    io.emit('whenUserConnected', totalUsers);
    // io.emit('message', 'new user has joined the chat');



    // listen for disconnection event w/ socket.on
    socket.on('disconnect', ()=>{
        console.log("client disconnected");
        totalUsers -= 1;
        io.emit('whenUserConnected', totalUsers);
        const message = { name: 'Server', message: 'a user has left the chat' };
        io.emit('message', message);
    })
    
    socket.on('message', (message) => {
        io.emit('message', message);
    })
    
});

//send the date via EMIT, every second
setInterval(()=>{
    io.emit('server-time', new Date().toTimeString())
},1000)
