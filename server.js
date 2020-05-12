const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//ROUTER
app.get('/', (req, res) => {
    res.render('index.html');
});

let messages = [];
let users = [];

io.on('connection', socket => {
    console.log(`Socket connected ${socket.id}`);

    socket.emit('previewsMessage', messages);
    socket.emit('users', users);

    socket.on('sendMessage', data =>{
        messages.push(data);
        users.push(data);

        socket.broadcast.emit('receivedMessage', data);
    });
});

const PORT = 3001;

server.listen(PORT, (args) => {
    console.log('http://localhost:'+PORT);
});

