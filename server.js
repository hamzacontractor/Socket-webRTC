
const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));






const port = +process.env.PORT || 8080;
server.listen(port, () => { console.log(`Experess server started on port: ${port}`) })