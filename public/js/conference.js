const localVideo = document.getElementById('localVideo');
localVideo.style = 'position:fixed; z-index:11; width:18vw; height:20vh; right:1vw; top:1vh';

const remoteVideos = document.getElementById('remoteVideos');
remoteVideos.style = 'position:fixed; z-index:10; width:80vw; height:96vh; left:0; top:2vh; display:flex; flex-wrap:wrap; flex-direction:row;';

let peer;
let socket;
let newUser;
let localStream;



navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
   .then(stream => {
      localStream = stream;
      localVideo.srcObject = localStream;
      localVideo.play();

      socket = io.connect();
      socket.emit("joinConference", 'ParticipantName');

      socket.on('connectAllPeer', peerIDs => {
         for (let i = 0; i < peerIDs.length; i++) {
            setTimeout(() => {
               callUser(peerIDs[i]);
               newUser = peerIDs[i];
            }, 1000 * i);
         }
      });

      socket.on("offer", RecieveCall);

      socket.on("answer", Answer);

      socket.on("ice-candidate", handleNewICECandidateMsg);
   })
   .catch(e => console.error(e))

function callUser(peerID) {
   peer = createPeer(peerID);
   localStream.getTracks().forEach(track => peer.addTrack(track, localStream));
}

function createPeer(peerID) {
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
   peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peerID);

   return peer;
}

function handleNegotiationNeededEvent(peerID) {
   peer.createOffer().then(offer => {
      return peer.setLocalDescription(offer);
   }).then(() => {
      const payload = {
         target: peerID,
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
   let remoteVideo = document.createElement('video')
   remoteVideo.muted = true;
   remoteVideo.style = 'width:38vw; height:45vh; margin:auto; box-shadow:0 0 3px 5px black';
   remoteVideo.srcObject = e.streams[0];
   remoteVideo.play().then(() => {
      remoteVideos.appendChild(remoteVideo);
      remoteVideo.muted = false;
   })
};