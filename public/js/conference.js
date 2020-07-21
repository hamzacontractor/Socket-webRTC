const localVideo = document.getElementById('localVideo');
localVideo.style = 'position:fixed; z-index:11; width:18vw; height:20vh; right:1vw; top:1vh';

const actionScetion = document.getElementById('actions');
actionScetion.style = 'position:fixed; z-index:11; width:18vw; height:75vh; right:1vw; top:22vh; display:flex; flex-wrap:wrap; flex-direction:column';

const remoteVideos = document.getElementById('remoteVideos');
remoteVideos.style = 'position:fixed; z-index:10; width:80vw; height:96vh; left:0; top:2vh; display:flex; flex-wrap:wrap; flex-direction:row;';


let peer;
let socket;
let newUserName;
let localStream = new MediaStream();
let localStreamID = localStream.id;


const params = new URLSearchParams(window.location.search);

function JoinConference() {
}

function ShareCamera() {
   localStream.removeTrack(localStream.getVideoTracks()[0]);
   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
         localStream.addTrack(stream.getVideoTracks()[0]);
         localVideo.srcObject = localStream;
         localVideo.play();
      }).catch(e => console.error(e))
}
navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
   .then(stream => {
      localStream = stream;
      localVideo.srcObject = localStream;
      localVideo.play();

      socket = io.connect();
      socket.emit("joinConference");

      socket.on('connectAllPeer', peerIDs => {
         for (let i = 0; i < peerIDs.length; i++) {
            setTimeout(() => { callUser(peerIDs[i]); }, 1000 * i);
         }
      });

      socket.on("offer", RecieveCall);

      socket.on("answer", Answer);

      socket.on("ice-candidate", handleNewICECandidateMsg);

   }).catch(e => console.error(e))

function ToggleAudio() {
   if (localStream.getAudioTracks())
      localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
}

function ToggleVideo() {
   localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
}


function callUser(peerID) {
   peer = createPeer(peerID);
   peer.addStream(localStream);
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

   peer.onicecandidate = e => handleICECandidateEvent(e, peerID);
   //peer.ontrack = e => console.log(e);
   peer.onaddstream = handleStreamEvent;
   //peer.onaddstream = () => console.log('Add Stream Fired.');
   peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peerID);

   //console.log(peer);
   return peer;
}

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

function RecieveCall(incomingOffer) {
   peer = createPeer();
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
}

function Answer(messageAnswer) {
   newUserName = messageAnswer.callerName;
   peer.setRemoteDescription(new RTCSessionDescription(messageAnswer.sdp))
      .catch(e => console.error(e));
}

function handleICECandidateEvent(e, id) {
   if (e.candidate) {
      const payload = {
         target: id,
         candidate: e.candidate,
      }
      socket.emit("ice-candidate", payload);
   }
}

function handleNewICECandidateMsg(incoming) {
   peer.addIceCandidate(new RTCIceCandidate(incoming))
      .catch(e => console.error(e));
}


function AddVideoElement(name, stream) {
}

function handleStreamEvent(e) {
   let nameSpan = document.createElement('span');
   nameSpan.style = 'padding:10px;';
   nameSpan.textContent = newUserName;

   let textDiv = document.createElement('div');
   textDiv.style = 'position:absolute; z-index:10; right:0; bottom:0; background-color:rgba(0,0,0,.9); color: white;';
   textDiv.appendChild(nameSpan);


   let videoDiv = document.createElement('div');
   videoDiv.id = socket.id;
   videoDiv.style = 'position:relative; width:38vw; height:45vh; margin:1vh 1vw; box-shadow:0 0 2px 5px grey';
   videoDiv.appendChild(textDiv);

   let remoteVideo = document.createElement('video');
   remoteVideo.muted = true;
   remoteVideo.style = 'position:absolute; z-index:1; width:inherit; height:90%;';
   remoteVideo.srcObject = e.stream;
   remoteVideo.play().then(() => {
      remoteVideo.muted = false;
      videoDiv.appendChild(remoteVideo);
   })

   remoteVideos.appendChild(videoDiv);
};

