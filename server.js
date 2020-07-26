
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const bodyParser = require('body-parser');
const url = require('url');


let isPeerConnected = false;
let participants = [];
let isConferanceActive = false;
let peerInitiatorSocketID;


app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/start-vdo-call', (req, res) => {
   res.sendFile(__dirname + '/public/peer-initiate.html');
});

app.get('/connect', (req, res) => {
   res.sendFile(__dirname + '/public/peer.html');
});

app.get('/join', (req, res) => {
   res.sendFile(__dirname + '/public/join.html');
});

app.post('/join', (req, res) => {
   if (req.body.conferenceName != "")
      res.redirect('/conference?name=' + req.body.conferenceName);
   else res.redirect('/join');
});

app.get('/conference', (req, res) => {
   const queryObject = url.parse(req.url, true).query;
   if (!isConferanceActive) res.redirect('/');
   if (queryObject.name !== undefined && queryObject.name !== "")
      res.sendFile(__dirname + '/public/conference.html');
   else res.redirect('/join');
});

app.get('/start-confer', (req, res) => {
   isConferanceActive = true;
   participants = [];
   res.redirect('/conference?name=Hamza');
});

app.get('/stop-confer', (req, res) => {
   isConferanceActive = false;
   participants = [];
   res.redirect('/');
});



io.on("connection", socket => {
   console.log(`Socket Connected: ${socket.id}`);
   socket.on("join", type => {
      console.log(`${socket.id} connected as ${type}`);
      if (type === 'peerStart') {
         isPeerConnected = true;
         peerInitiatorSocketID = socket.id;
         // socket.on('disconnect', () => {
         //    isPeerConnected = false;
         //    peerInitiatorSocketID = '';
         // });
      }
      if (isPeerConnected && type === 'peer') {
         socket.emit("connectPeer", peerInitiatorSocketID);
         socket.on("connected", () => socket.to(peerInitiatorSocketID).emit("peerConnected", socket.id));
         socket.on('disconnect', () => {
            socket.to(peerInitiatorSocketID).emit('peerDisconnected', socket.id);
         });
      }
   });

   socket.on('joinConference', () => {
      if (isConferanceActive) {
         console.log(`Conf Joined by: ${socket.id}, Connecting: ${participants}`);
         socket.emit('connectAllPeer', participants)
         participants.push(socket.id);
      }

      socket.on('disconnect', () => {
         socket.broadcast.emit('peerDisconnected', socket.id);
         participants = participants.filter(v => v != socket.id);
         console.log(`Disconnecting: ${socket.id}, Connected: ${participants}`);
      });
   })

   socket.on("offer", payload => {
      console.log(`Offer From: ${payload.callerName}`);
      io.to(payload.target).emit("offer", payload)
   });

   socket.on("answer", payload => {
      console.log(`Answer From: ${payload.callerName}`);
      io.to(payload.target).emit("answer", payload)
   });

   socket.on("ice-candidate", incoming => {
      console.log(`ICE event for:${incoming.target}`);
      io.to(incoming.target).emit("ice-candidate", incoming.candidate);
   });


});

const port = +process.env.PORT || 8000;
server.listen(port, () => console.log(`Web Confrence started on port: ${port}`));