const localVideo = document.getElementById('localVideo');
localVideo.style = 'position:fixed; z-index:11; width:15vw; height:15vh; right:1vw; top:1vh';

const remoteVideo = document.getElementById('remoteVideo');
remoteVideo.style = 'position:fixed; z-index:10; width:80vw; height:100vh; left:0; top:0';

let peer;
let socket;
let newUser;
let localStream;



navigator.mediaDevices.getUserMedia({ audio: true, video: true })
   .then(stream => {
      localStream = stream;
      localVideo.srcObject = localStream;
      localVideo.play();

      socket = io.connect();

      socket.emit("join", 'peerInitator');

      socket.on('connectPeer', peerID => {
         newUser = peerID;
      });

      socket.on("peerConnected", peerID => console.log(`Peer connected on socket: ${peerID}`));

      socket.on("offer", RecieveCall);

      socket.on("answer", Answer);

      socket.on("ice-candidate", handleNewICECandidateMsg);
   })
   .catch(e => console.error(e))


function createPeer() {
   const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.stunprotocol.org" },
      {
         urls: 'turn:numb.viagenie.ca',
         credential: 'muazkh',
         username: 'webrtc@live.com'
      }]
   });

   peer.onicecandidate = handleICECandidateEvent;
   peer.ontrack = handleTrackEvent;
   peer.onnegotiationneeded = () => handleNegotiationNeededEvent();

   return peer;
}

function handleNegotiationNeededEvent() {
   peer.createOffer().then(offer => {
      return peer.setLocalDescription(offer);
   }).then(() => {
      const payload = {
         target: userID,
         caller: socket.id,
         sdp: peer.localDescription
      };
      socket.emit("offer", payload);
   }).catch(e => console.error(e));
}

function RecieveCall(incomingOffer) {
   peer = createPeer();
   peer.setRemoteDescription(new RTCSessionDescription(incomingOffer.sdp))
      .then(() => { localStream.getTracks().forEach(track => peer.addTrack(track, localStream)); })
      .then(() => { return peer.createAnswer(); })
      .then(answer => { return peer.setLocalDescription(answer); }).then(() => {
         const payload = {
            target: incomingOffer.caller,
            caller: socket.id,
            sdp: peer.localDescription
         }
         socket.emit("answer", payload);
      }).catch(e => console.error(e));
}

function Answer(messageAnswer) {
   peer.setRemoteDescription(new RTCSessionDescription(messageAnswer.sdp))
      .catch(e => console.error(e));
}

function handleICECandidateEvent(e) {
   if (e.candidate) {
      const payload = {
         target: newUser,
         candidate: e.candidate,
      }
      socket.emit("ice-candidate", payload);
   }
}

function handleNewICECandidateMsg(incoming) {
   const candidate = new RTCIceCandidate(incoming);

   peer.addIceCandidate(candidate)
      .catch(e => console.error(e));
}

function handleTrackEvent(e) {
   remoteVideo.srcObject = e.streams[0];
   remoteVideo.play();
   setTimeout(() => { remoteVideo.muted = false; }, 1000);
};