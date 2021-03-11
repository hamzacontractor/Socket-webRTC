const localVideo = document.getElementById('localVideo');
localVideo.style = 'position:fixed; z-index:11; width:18vw; height:20vh; right:1vw; top:1vh';


const actionScetion = document.getElementById('actions');
actionScetion.style = 'position:fixed; z-index:11; width:18vw; height:75vh; right:1vw; top:22vh; display:flex; flex-wrap:wrap; flex-direction:column';

let peer;
let socket;
let newUser;
let localStream = new MediaStream();
let displayedLocalStream = false;


socket = io.connect();

socket.on('connectPeer', peerID => { newUser = peerID; });

socket.on("peerConnected", peerID => console.log(`Peer connected on socket: ${peerID}`));

socket.on("offer", RecieveCall);

socket.on("answer", Answer);

socket.on("ice-candidate", handleNewICECandidateMsg);

let joined = false;
function JoinVideoTalk() {
   socket.emit("join", 'peerStart');
   joined = true;
}

navigator.mediaDevices.getUserMedia({ video: true })
   .then(stream => {
      localStream.addTrack(stream.getVideoTracks()[0]);
   })
   .catch(e => console.error(e))

navigator.mediaDevices.getUserMedia({ audio: true })
   .then(stream => {
      localStream.addTrack(stream.getAudioTracks()[0]);
   })
   .catch(e => console.error(e))

function GetDisplayMedia(){
   navigator.mediaDevices.getDisplayMedia({ video: true, audio:true })
      .then(stream => {
         localStream.addTrack(stream.getAudioTracks()[0]);
         localStream.addTrack(stream.getAudioTracks()[0]);
      }).catch(e => console.error(e))
}


function DisplayLocalStream(){
   if(displayedLocalStream == false){
      localVideo.srcObject = localStream;
      localVideo.play();
      displayedLocalStream = true;
   }
}
setTimeout(DisplayLocalStream, 100);


function ShareScreen() {  
   GetDisplayMedia();
   SwitchToScreen();
}

function SwitchToScreen() {
   console.log(localStream);
   localStream.getVideoTracks()[0].active = false;
   localStream.getVideoTracks()[1].active = true;
   if(localStream.getAudioTracks()[1])
      localStream.getAudioTracks()[1].active = true;
   document.getElementById('btnShareScreen').style.display = 'none';
   document.getElementById('btnSwitchCamera').style.display = 'flex';
   localVideo.srcObject = localStream;
   localVideo.play();
}

function SwitchToCamera() {
   console.log(localStream);
   localStream.getVideoTracks()[0].active = true;
   localStream.removeTrack(localStream.getVideoTracks()[1]);
   if(localStream.getAudioTracks()[1])
      localStream.removeTrack(localStream.getAudioTracks()[1]);
   document.getElementById('btnSwitchCamera').style.display = 'none';
   document.getElementById('btnShareScreen').style.display = 'flex';
}

function ToggleAudio() {
   if (localStream.getAudioTracks())
      localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;

   if (localStream.getAudioTracks()[0].enabled)
      document.getElementById('btnAudioToggle').textContent = 'Disable Audio';
   else document.getElementById('btnAudioToggle').textContent = 'Enable Audio';
}

let videoEnabled = true;
function ToggleVideo() {
   localStream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
      videoEnabled = track.enabled;
   });

   if (videoEnabled)
      document.getElementById('btnVideoToggle').textContent = 'Disable Video';
   else document.getElementById('btnVideoToggle').textContent = 'Enable Video';
}

function createPeer(peerID) {
   const peer = new RTCPeerConnection({
      iceServers: [
         { url: 'stun:stun01.sipphone.com' },
         { url: 'stun:stun.ekiga.net' },
         { url: 'stun:stun.fwdnet.net' },
         { url: 'stun:stun.ideasip.com' },
         { url: 'stun:stun.iptel.org' },
         { url: 'stun:stun.rixtelecom.se' },
         { url: 'stun:stun.schlund.de' },
         { url: 'stun:stun.l.google.com:19302' },
         { url: 'stun:stun1.l.google.com:19302' },
         { url: 'stun:stun2.l.google.com:19302' },
         { url: 'stun:stun3.l.google.com:19302' },
         { url: 'stun:stun4.l.google.com:19302' },
         { url: 'stun:stunserver.org' },
         { url: 'stun:stun.softjoys.com' },
         { url: 'stun:stun.voiparound.com' },
         { url: 'stun:stun.voipbuster.com' },
         { url: 'stun:stun.voipstunt.com' },
         { url: 'stun:stun.voxgratia.org' },
         { url: 'stun:stun.xten.com' },
         {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
         },
         {
            url: 'turn:192.158.29.39:3478?transport=udp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
         },
         {
            url: 'turn:192.158.29.39:3478?transport=tcp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
         }]
   });

   peer.onicecandidate = handleICECandidateEvent;
   peer.ontrack = handleTrackEvent;
   //peer.onaddstream = e => handleTrackEvent(e);
   peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peerID);

   return peer;
}




function handleNegotiationNeededEvent() {
   peer.createOffer().then(offer => {
      return peer.setLocalDescription(offer);
   }).then(() => {
      const payload = {
         target: newUser,
         caller: socket.id,
         sdp: peer.localDescription
      };
      socket.emit("offer", payload);
   }).catch(e => console.error(e));
}

function RecieveCall(incomingOffer) {
   peer = createPeer();
   newUser = incomingOffer.caller;
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
   newUser = messageAnswer.caller;
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
   peer.addIceCandidate(new RTCIceCandidate(incoming))
      .catch(e => console.error(e));
}

function handleTrackEvent(e) {
   if (e.track.kind === "audio") {
      console.log(e.streams);
      let remoteAudio = document.getElementById('remoteAudio');
      remoteAudio.srcObject = e.streams[0];
      remoteAudio.play();
   }
   if (e.track.kind === "video") {
      console.log(e.streams);
      let remoteVideo = document.getElementById('remoteVideo');
      remoteVideo.style = 'position:fixed; z-index:10; width:80vw; height:96vh; left:0; top:2vh';
      remoteVideo.srcObject = e.streams[0];
      remoteVideo.play();
   }
};