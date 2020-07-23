const localVideo = document.getElementById('localVideo');
localVideo.style = 'position:fixed; z-index:11; width:18vw; height:20vh; right:1vw; top:1vh';

const actionScetion = document.getElementById('actions');
actionScetion.style = 'position:fixed; z-index:11; width:18vw; height:75vh; right:1vw; top:22vh; display:flex; flex-wrap:wrap; flex-direction:column';

const remoteVideos = document.getElementById('remoteVideos');
remoteVideos.style = 'position:fixed; z-index:10; width:80vw; height:96vh; left:0; top:2vh; display:flex; flex-wrap:wrap; flex-direction:row;';

let mediaAvailable = false;
let peer;
let socket;
let newUserName;
let remoteSocketID;
let localStream = new MediaStream();


const params = new URLSearchParams(window.location.search);


function ToggleAudio() {
   if (localStream.getAudioTracks())
      localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
}

function ToggleVideo() {
   localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
}

socket = io.connect();

socket.on('connectAllPeer', peerIDs => {
   for (let i = 0; i < peerIDs.length; i++) {
      setTimeout(() => {
         peer = createPeer(peerIDs[i]);
         peer.addStream(localStream);
      }, 1000 * i);
   }
});






navigator.mediaDevices.getUserMedia({ video: true, audio: true })
   .then(stream => {
      localStream = stream;
      localVideo.srcObject = localStream;
      localVideo.play();
      JoinConference();
   }).catch(e => console.error(e))

function ShareScreen() {
   navigator.mediaDevices.getDisplayMedia({ video: true })
      .then(stream => {
         localStream.addTrack(stream.getVideoTracks()[0]);
         if (!joined) {
            localVideo.srcObject = localStream;
            localVideo.play();
            JoinConference();
         }

      }).catch(e => console.error(e))
}

let joined = false;
function JoinConference() {
   socket.emit("joinConference");
   joined = true;
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
   peer.ontrack = e => console.log(e);
   peer.onaddstream = handleStreamEvent;
   peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peerID);

   return peer;
}


socket.on("ice-candidate", handleNewICECandidateMsg);
function handleNegotiationNeededEvent(peerID) {
   peer.createOffer().then(offer => {
      return peer.setLocalDescription(offer);
   }).then(() => {
      const payload = {
         target: peerID,
         caller: socket.id,
         callerName: params.get('name'),
         sdp: peer.localDescription
      };
      socket.emit("offer", payload);
   }).catch(e => console.error(e));
}


socket.on("offer", (incomingOffer) => {
   peer = createPeer();
   remoteSocketID = incomingOffer.caller;
   newUserName = incomingOffer.callerName;
   peer.setRemoteDescription(new RTCSessionDescription(incomingOffer.sdp))
      .then(() => { localStream.getTracks().forEach(track => peer.addTrack(track, localStream)); })
      .then(() => { return peer.createAnswer(); })
      .then(answer => { return peer.setLocalDescription(answer); }).then(() => {
         const payload = {
            target: incomingOffer.caller,
            caller: socket.id,
            callerName: params.get('name'),
            sdp: peer.localDescription
         }
         socket.emit("answer", payload);
      }).catch(e => console.error(e));
});


socket.on("answer", Answer);
function Answer(messageAnswer) {
   remoteSocketID = messageAnswer.caller;
   newUserName = messageAnswer.callerName;
   peer.setRemoteDescription(new RTCSessionDescription(messageAnswer.sdp))
      .catch(e => console.error(e));
}

function handleICECandidateEvent(e) {
   if (e.candidate) {
      const payload = {
         target: remoteSocketID,
         candidate: e.candidate,
      }
      socket.emit("ice-candidate", payload);
   }
}

function handleNewICECandidateMsg(incoming) {
   peer.addIceCandidate(new RTCIceCandidate(incoming))
      .catch(e => console.error(e));
}


function handleStreamEvent(e) {
   console.log(e);
   let nameSpan = document.createElement('span');
   nameSpan.style = 'padding:10px;';
   nameSpan.textContent = newUserName;

   let textDiv = document.createElement('div');
   textDiv.style = 'position:absolute; z-index:10; right:0; bottom:0; background-color:rgba(0,0,0,.9); color: white;';
   textDiv.appendChild(nameSpan);


   let videoDiv = document.createElement('div');
   videoDiv.id = remoteSocketID;
   videoDiv.style = 'position:relative; width:38vw; height:45vh; margin:1vh 1vw; box-shadow:0 0 2px 5px grey';
   videoDiv.appendChild(textDiv);

   let remoteVideo = document.createElement('video');
   remoteVideo.style = 'position:absolute; z-index:1; width:inherit; height:90%;';
   remoteVideo.muted = true;
   remoteVideo.srcObject = e.stream;
   try {
      remoteVideo.play().then(() => {
         remoteVideo.muted = false;
      })
   } catch{ }
   videoDiv.appendChild(remoteVideo);

   remoteVideos.appendChild(videoDiv);
};




socket.on("peerDisconnected", id => {
   document.getElementById(id).remove();
});