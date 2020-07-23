const localVideo = document.getElementById('localVideo');
localVideo.style = 'position:fixed; z-index:11; width:18vw; height:20vh; right:1vw; top:1vh';

const remoteVideo = document.getElementById('remoteVideo');
remoteVideo.style = 'position:fixed; z-index:10; width:80vw; height:96vh; left:0; top:2vh';

const actionScetion = document.getElementById('actions');
actionScetion.style = 'position:fixed; z-index:11; width:18vw; height:75vh; right:1vw; top:22vh; display:flex; flex-wrap:wrap; flex-direction:column';

let peer;
let socket;
let newUser;
let localStream;

socket = io.connect();

socket.on('connectPeer', peerID => {
   newUser = peerID;
   peer = createPeer(peerID);
   localStream.getTracks().forEach(track => peer.addTrack(track, localStream));
});

socket.on("offer", RecieveCall);

socket.on("answer", Answer);

socket.on("ice-candidate", handleNewICECandidateMsg);


navigator.mediaDevices.getUserMedia({ audio: true, video: true })
   .then(stream => {
      localStream = stream;
      localVideo.srcObject = localStream;
      localVideo.play();

      socket.emit("join", 'peer');
   })
   .catch(e => console.error(e))


function ShareScreen() {
   navigator.mediaDevices.getDisplayMedia({ video: true })
      .then(stream => {
         if (!joined) {
            localStream = stream;
            localVideo.srcObject = localStream;
            localVideo.play();
            ToggleVideo();
            JoinConference();
         } else {
            localStream.addTrack(stream.getVideoTracks()[0]);
            SwitchToScreen();
         }
      }).catch(e => console.error(e))
}

function SwitchToScreen() {
   localStream.getVideoTracks()[0].active = false;
   localStream.getVideoTracks()[1].active = true;
   document.getElementById('btnShareScreen').style.display = 'none';
   document.getElementById('btnSwitchScreen').style.display = 'none';
   document.getElementById('btnSwitchCamera').style.display = 'flex';
   localVideo.srcObject = localStream;
   localVideo.play();
}

function SwitchToCamera() {
   localStream.getVideoTracks()[0].active = true;
   localStream.getVideoTracks()[1].active = false;
   document.getElementById('btnSwitchCamera').style.display = 'none';
   document.getElementById('btnSwitchScreen').style.display = 'flex';
   localVideo.srcObject = localStream;
   localVideo.play();
}

function ToggleAudio() {
   if (localStream.getAudioTracks())
      localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;

   if (localStream.getAudioTracks()[0].enabled)
      document.getElementById('btnAudioToggle').textContent = 'Disable Audio';
   else document.getElementById('btnAudioToggle').textContent = 'Enable Audio';
}

function ToggleVideo() {
   localStream.getVideoTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;

   if (localStream.getVideoTracks()[0].enabled)
      document.getElementById('btnVideoToggle').textContent = 'Disable Audio';
   else document.getElementById('btnVideoToggle').textContent = 'Enable Audio';
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
   remoteVideo.srcObject = e.streams[0];
   remoteVideo.play().then(() => {
      remoteVideo.muted = false;
   })
};