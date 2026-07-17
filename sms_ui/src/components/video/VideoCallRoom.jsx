import { useRef, useEffect, useState } from 'react';
import '../../styles/VideoCall.css';

/**
 * Active video call room.
 * Shows local + remote video streams with controls.
 */
export default function VideoCallRoom({
  localStream, remoteStreams, participants,
  callStatus, currentRoom,
  onLeave, onToggleVideo, onToggleAudio
}) {
  const localVideoRef = useRef(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  // Set local video
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleToggleVideo = () => {
    onToggleVideo();
    setIsVideoOn(prev => !prev);
  };

  const handleToggleAudio = () => {
    onToggleAudio();
    setIsAudioOn(prev => !prev);
  };

  return (
    <div className="vc-room">
      {/* Room Header */}
      <div className="vc-room-header">
        <div className="vc-room-header-left">
          <h3>📹 Room: {currentRoom}</h3>
          <span className="vc-room-status">
            {callStatus === 'calling' ? '⏳ Waiting for others...' : `🟢 ${Object.keys(remoteStreams).length + 1} participants`}
          </span>
        </div>
        <button className="vc-btn vc-btn-danger" onClick={onLeave}>
          📴 Leave Call
        </button>
      </div>

      {/* Video Grid */}
      <div className="vc-video-grid">
        {/* Local Video */}
        <div className="vc-video-container vc-local-video">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="vc-video"
          />
          <div className="vc-video-label">You</div>
          {!isVideoOn && <div className="vc-video-off">📷 Camera Off</div>}
        </div>

        {/* Remote Videos */}
        {Object.entries(remoteStreams).map(([userId, stream]) => (
          <RemoteVideo
            key={userId}
            stream={stream}
            participant={participants.find(p => p.userId === userId)}
          />
        ))}

        {/* Placeholder if waiting */}
        {callStatus === 'calling' && Object.keys(remoteStreams).length === 0 && (
          <div className="vc-video-container vc-video-placeholder">
            <div className="vc-waiting-animation">
              <span>⏳</span>
              <p>Waiting for participants...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="vc-controls">
        <button
          className={`vc-control-btn ${!isAudioOn ? 'vc-control-off' : ''}`}
          onClick={handleToggleAudio}
          title={isAudioOn ? 'Mute' : 'Unmute'}
        >
          {isAudioOn ? '🎤' : '🔇'}
        </button>
        <button
          className={`vc-control-btn ${!isVideoOn ? 'vc-control-off' : ''}`}
          onClick={handleToggleVideo}
          title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isVideoOn ? '📹' : '📷'}
        </button>
        <button
          className="vc-control-btn vc-control-end"
          onClick={onLeave}
          title="End Call"
        >
          📴
        </button>
      </div>

      {/* Participants List */}
      {participants.length > 0 && (
        <div className="vc-participants-bar">
          <span>👥 Participants: </span>
          {participants.map(p => (
            <span key={p.userId} className="vc-participant-chip">
              {p.userName} ({p.role})
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Remote video component for a single peer.
 */
function RemoteVideo({ stream, participant }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="vc-video-container">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="vc-video"
      />
      <div className="vc-video-label">
        {participant?.userName || 'Participant'}
      </div>
    </div>
  );
}
