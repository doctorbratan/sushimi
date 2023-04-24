const app = require('./app');
const moment = require('moment');

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});

console.log(moment().format());
port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Сервер запушен на порту: ${port}`));


// Подключаю WebSoket
const soketFunction = require('./soket.function');
io.on('connection', (socket)=> {
    console.log("Client Connected");
    soketFunction.socketMap.push(socket);
    soketFunction.EmmitUpdate();
})