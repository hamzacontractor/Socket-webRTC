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

socket = io.connect();

socket.on('connectAllPeer', peerIDs => {
   for (let i = 0; i < peerIDs.length; i++) {
      setTimeout(() => {
         peer = createPeer(peerIDs[i]);
         peer.addStream(localStream);
      }, 1000 * i);
   }
});





function ShareCamera() {
   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
         if (!joined) {
            localStream = stream;
            JoinConference();
         }
         localVideo.srcObject = localStream;
         localVideo.play();
      }).catch(e => console.error(e))
}

function ShareScreen() {
   navigator.mediaDevices.getDisplayMedia({ video: true })
      .then(stream => {
         if (!joined) {
            localStream = stream;
            localVideo.srcObject = localStream;
            localVideo.play();
            JoinConference();
         } else {
            localStream.addTrack(stream.getVideoTracks()[0]);
            SwitchToScreen();
         }

      }).catch(e => console.error(e))
}

function SwitchToScreen() {
   let mediaTracks = localStream.getVideoTracks();
   mediaTracks[0].active = false;
   mediaTracks[1].active = true;
   document.getElementById('btnSwitchScreen').style.display = 'none';
   document.getElementById('btnSwitchCamera').style.display = 'flex';
   localVideo.srcObject = localStream;
   localVideo.play();
}

function SwitchToCamera() {
   let mediaTracks = localStream.getVideoTracks();
   mediaTracks[0].active = true;
   mediaTracks[1].active = false;
   document.getElementById('btnSwitchCamera').style.display = 'none';
   document.getElementById('btnSwitchScreen').style.display = 'flex';
   localVideo.srcObject = localStream;
   localVideo.play();
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
   peer.ontrack = handleTrackEvent;
   //peer.onaddstream = handleStreamEvent;
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

function handleTrackEvent(e) {
   console.log(e);
   if (document.getElementById(e.streams[0].id) === null) {
      let videoContainer = document.createElement('div');
      videoContainer.id = remoteSocketID;
      videoContainer.style = 'position:relative; width:38vw; height:45vh; margin:1vh 1vw; box-shadow:0 0 2px 5px grey';

      let nameSpan = document.createElement('span');
      nameSpan.style = 'padding:10px;';
      nameSpan.textContent = newUserName;

      let textDiv = document.createElement('div');
      textDiv.style = 'position:absolute; z-index:10; right:0; bottom:0; background-color:rgba(0,0,0,.9); color: white;';
      textDiv.appendChild(nameSpan);
      videoContainer.appendChild(textDiv);


      let streamDiv = document.createElement('div');
      streamDiv.style = 'position:relative; width:inherit; height:90%;';
      streamDiv.id = e.streams[0].id;

      let remoteAudio = document.createElement('audio');
      remoteAudio.style = 'width:inherit; height:inherit;';
      remoteAudio.muted = true;
      streamDiv.appendChild(remoteAudio);

      let remoteVideo = document.createElement('video');
      remoteVideo.style = 'width:inherit; height:inherit;';
      streamDiv.appendChild(remoteVideo);

      videoContainer.appendChild(streamDiv);
      remoteVideos.appendChild(videoContainer);
   }

   if (e.track.kind === 'video')
      AddVideoTrack(e.streams[0], document.getElementById(e.streams[0].id).querySelector('video'));
   if (e.track.kind === 'audio')
      AddAudioTrack(e.streams[0], document.getElementById(e.streams[0].id).querySelector('audio'));

}

function AddAudioTrack(audioStream, audioElement) {
   audioElement.srcObject = audioStream;
   audioElement.play().then(() => { audioElement.muted = false; });
}

function AddVideoTrack(videoStream, videoElement) {
   videoElement.srcObject = videoStream;
   videoElement.play();
}

socket.on("peerDisconnected", id => {
   document.getElementById(id).remove();
});

setTimeout(ShareCamera, 100);