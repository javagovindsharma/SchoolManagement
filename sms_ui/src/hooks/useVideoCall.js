import { useState, useRef, useCallback, useEffect } from 'react';

const WS_URL = 'ws://localhost:8080/ws/video-call';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

/**
 * Custom hook for managing video calls.
 * Handles WebSocket signaling + WebRTC peer connections.
 */
export function useVideoCall(user) {
   const [isConnected, setIsConnected] = useState(false);
   const [currentRoom, setCurrentRoom] = useState(null);
   const [participants, setParticipants] = useState([]);
   const [incomingCall, setIncomingCall] = useState(null);
   const [localStream, setLocalStream] = useState(null);
   const [remoteStreams, setRemoteStreams] = useState({});
   const [error, setError] = useState(null);
   const [callStatus, setCallStatus] = useState('idle'); // idle, calling, ringing, connected
   const wsRef = useRef(null);
   const peerConnectionsRef = useRef({});
   const localStreamRef = useRef(null);
   // Connect to WebSocket signaling server
   const connect = useCallback(() => {
      if (!user) return;
      const ws = new WebSocket(
         `${WS_URL}?userId=${user.id}&userName=${user.name || user.username}&role=${user.role}`
      );
      ws.onopen = () => {
         setIsConnected(true);
         setError(null);
         console.log('WebSocket connected');
      };
      ws.onmessage = (event) => {
         const message = JSON.parse(event.data);
         handleSignalingMessage(message);
      };
      ws.onerror = (err) => {
         setError('Connection failed');
         console.error('WebSocket error:', err);
      };
      ws.onclose = () => {
         setIsConnected(false);
         console.log('WebSocket disconnected');
         // Auto reconnect after 3 seconds
         setTimeout(() => {
            if (wsRef.current?.readyState === WebSocket.CLOSED) {
               connect();
            }
         }, 3000);
      };
      wsRef.current = ws;
   }, [user]);
   // Disconnect from WebSocket
   const disconnect = useCallback(() => {
      if (wsRef.current) {
         wsRef.current.close();
         wsRef.current = null;
      }
      cleanup();
   }, []);
   // Send message via WebSocket
   const sendMessage = useCallback((message) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
         wsRef.current.send(JSON.stringify(message));
      }
   }, []);
   // Handle incoming signaling messages
   const handleSignalingMessage = useCallback((message) => {
      switch (message.type) {
         case 'ROOM_CREATED':
            setCurrentRoom(message.roomId);
            setCallStatus('calling');
            break;
         case 'JOIN_ROOM':
            setCurrentRoom(message.roomId);
            setCallStatus('connected');
            if (message.payload?.participants) {
               setParticipants(message.payload.participants);
            }
            break;

         case 'INCOMING_CALL':

            setIncomingCall({

               roomId: message.roomId,

               callerId: message.senderId,

               callerName: message.senderName,

               callerRole: message.role,

               callType: message.callType,

            });

            setCallStatus('ringing');

            break;

  

         case 'CALL_ACCEPTED':

            setCallStatus('connected');

            // Start WebRTC with the accepted user

            createOffer(message.senderId);

            break;

  

         case 'CALL_REJECTED':

            setCallStatus('idle');

            setCurrentRoom(null);

            setError('Call was rejected');

            setTimeout(() => setError(null), 3000);

            break;

  

         case 'USER_JOINED':

            setParticipants(prev => [...prev, {

               userId: message.senderId,

               userName: message.senderName,

               role: message.role,

            }]);

            // Create an offer for the new participant

            createOffer(message.senderId);

            break;

  

         case 'USER_LEFT':

            setParticipants(prev => prev.filter(p => p.userId !== message.senderId));

            closePeerConnection(message.senderId);

            break;

  

         case 'OFFER':

            handleOffer(message);

            break;

  

         case 'ANSWER':

            handleAnswer(message);

            break;

  

         case 'ICE_CANDIDATE':

            handleIceCandidate(message);

            break;

  

         case 'ERROR':

            setError(message.payload);

            setTimeout(() => setError(null), 5000);

            break;

  

         case 'ROOM_FULL':

            setError('Room is full');

            break;

  

         default:

            console.log('Unknown message type:', message.type);

      }

   }, []);

  

   // Get local media (camera + mic)

   const startLocalStream = useCallback(async (videoEnabled = true, audioEnabled = true) => {

      try {

         const stream = await navigator.mediaDevices.getUserMedia({

            video: videoEnabled,

            audio: audioEnabled,

         });

         setLocalStream(stream);

         localStreamRef.current = stream;

         return stream;

      } catch (err) {

         setError('Failed to access camera/microphone');

         console.error('getUserMedia error:', err);

         return null;

      }

   }, []);

  

   // Stop local media

   const stopLocalStream = useCallback(() => {

      if (localStreamRef.current) {

         localStreamRef.current.getTracks().forEach(track => track.stop());

         localStreamRef.current = null;

         setLocalStream(null);

      }

   }, []);

  

   // Create a new peer connection for a user

   const createPeerConnection = useCallback((targetUserId) => {

      const pc = new RTCPeerConnection(ICE_SERVERS);

  

      // Add local stream tracks to peer connection

      if (localStreamRef.current) {

         localStreamRef.current.getTracks().forEach(track => {

            pc.addTrack(track, localStreamRef.current);

         });

      }

  

      // Handle incoming tracks (remote stream)

      pc.ontrack = (event) => {

         setRemoteStreams(prev => ({

            ...prev,

            [targetUserId]: event.streams[0],

         }));

      };

  

      // Handle ICE candidates

      pc.onicecandidate = (event) => {

         if (event.candidate) {

            sendMessage({

               type: 'ICE_CANDIDATE',

               roomId: currentRoom,

               targetUserId: targetUserId,

               payload: event.candidate,

            });

         }

      };

  

      pc.oniceconnectionstatechange = () => {

         if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {

            closePeerConnection(targetUserId);

         }

      };

  

      peerConnectionsRef.current[targetUserId] = pc;

      return pc;

   }, [currentRoom, sendMessage]);

  

   // Create and send WebRTC offer

   const createOffer = useCallback(async (targetUserId) => {

      const pc = createPeerConnection(targetUserId);

      const offer = await pc.createOffer();

      await pc.setLocalDescription(offer);

  

      sendMessage({

         type: 'OFFER',

         roomId: currentRoom,

         targetUserId: targetUserId,

         payload: offer,

      });

   }, [createPeerConnection, sendMessage, currentRoom]);

  

   // Handle incoming WebRTC offer

   const handleOffer = useCallback(async (message) => {

      const pc = createPeerConnection(message.senderId);

      await pc.setRemoteDescription(new RTCSessionDescription(message.payload));

      const answer = await pc.createAnswer();

      await pc.setLocalDescription(answer);

  

      sendMessage({

         type: 'ANSWER',

         roomId: message.roomId,

         targetUserId: message.senderId,

         payload: answer,

      });

   }, [createPeerConnection, sendMessage]);

  

   // Handle incoming WebRTC answer

   const handleAnswer = useCallback(async (message) => {

      const pc = peerConnectionsRef.current[message.senderId];

      if (pc) {

         await pc.setRemoteDescription(new RTCSessionDescription(message.payload));

      }

   }, []);

  

   // Handle incoming ICE candidate

   const handleIceCandidate = useCallback(async (message) => {

      const pc = peerConnectionsRef.current[message.senderId];

      if (pc && message.payload) {

         await pc.addIceCandidate(new RTCIceCandidate(message.payload));

      }

   }, []);

  

   // Close a peer connection

   const closePeerConnection = useCallback((userId) => {

      const pc = peerConnectionsRef.current[userId];

      if (pc) {

         pc.close();

         delete peerConnectionsRef.current[userId];

      }

      setRemoteStreams(prev => {

         const updated = { ...prev };

         delete updated[userId];

         return updated;

      });

   }, []);

  

   // ===================== Public API =====================

  

   // Create a group room (Teacher creates class, Admin creates meeting)

   const createRoom = useCallback(async (roomName) => {

      const stream = await startLocalStream();

      if (!stream) return;

      sendMessage({

         type: 'CREATE_ROOM',

         callType: 'GROUP',

         roomId: roomName || null,

      });

   }, [sendMessage, startLocalStream]);

  

   // Call a specific user (1:1 call)

   const callUser = useCallback(async (targetUserId) => {

      const stream = await startLocalStream();

      if (!stream) return;

      sendMessage({

         type: 'CALL_USER',

         targetUserId: targetUserId,

         callType: 'ONE_TO_ONE',

      });

      setCallStatus('calling');

   }, [sendMessage, startLocalStream]);

  

   // Accept incoming call

   const acceptCall = useCallback(async () => {

      if (!incomingCall) return;

      const stream = await startLocalStream();

      if (!stream) return;

      sendMessage({

         type: 'CALL_ACCEPTED',

         roomId: incomingCall.roomId,

      });

      setIncomingCall(null);

      setCallStatus('connected');

   }, [incomingCall, sendMessage, startLocalStream]);

  

   // Reject incoming call

   const rejectCall = useCallback(() => {

      if (!incomingCall) return;

      sendMessage({

         type: 'CALL_REJECTED',

         roomId: incomingCall.roomId,

      });

      setIncomingCall(null);

      setCallStatus('idle');

   }, [incomingCall, sendMessage]);

  

   // Join an existing room

   const joinRoom = useCallback(async (roomId) => {

      const stream = await startLocalStream();

      if (!stream) return;

      sendMessage({

         type: 'JOIN_ROOM',

         roomId: roomId,

      });

   }, [sendMessage, startLocalStream]);

  

   // Leave the current room/call

   const leaveCall = useCallback(() => {

      if (currentRoom) {

         sendMessage({

            type: 'LEAVE_ROOM',

            roomId: currentRoom,

         });

      }

      // Close all peer connections

      Object.keys(peerConnectionsRef.current).forEach(closePeerConnection);

      stopLocalStream();

      setCurrentRoom(null);

      setParticipants([]);

      setRemoteStreams({});

      setCallStatus('idle');

   }, [currentRoom, sendMessage, closePeerConnection, stopLocalStream]);

  

   // Toggle video
   const toggleVideo = useCallback(() => {
      if (localStreamRef.current) {
         const videoTrack = localStreamRef.current.getVideoTracks()[0];

         if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
         }
      }
   }, []);

   // Toggle audio
   const toggleAudio = useCallback(() => {
      if (localStreamRef.current) {
         const audioTrack = localStreamRef.current.getAudioTracks()[0];

         if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
         }
      }

  

   // Cleanup on unmount

   const cleanup = useCallback(() => {

      Object.keys(peerConnectionsRef.current).forEach(closePeerConnection);

      stopLocalStream();

      setCurrentRoom(null);

      setParticipants([]);

      setRemoteStreams({});

      setCallStatus('idle');

      setIncomingCall(null);

   }, [closePeerConnection, stopLocalStream]);

  

   // Auto-connect when user is available

   useEffect(() => {

      if (user) {

         connect();

      }

      return () => {

         disconnect();

      };

   }, [user]);

  

   return {

      // State

      isConnected,

      currentRoom,

      participants,

      incomingCall,

      localStream,

      remoteStreams,

      error,

      callStatus,

  

      // Actions

      connect,

      disconnect,

      createRoom,

      joinRoom,

      callUser,

      acceptCall,

      rejectCall,

      leaveCall,

      toggleVideo,

      toggleAudio,

   };

}