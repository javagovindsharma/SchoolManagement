import { useState, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext';

import { useVideoCall } from '../../hooks/useVideoCall';

import IncomingCallModal from '../../components/video/IncomingCallModal';

import VideoCallRoom from '../../components/video/VideoCallRoom';

import '../../styles/VideoCall.css';

 

/**

 * Main Video Call page.

 * Shows online users, active rooms, and allows creating/joining calls.

 *

 * Access:

 * - Admin: Can call any teacher, create group meetings

 * - Teacher: Can create classroom sessions, call individual students

 * - Student: Can join classroom sessions

 */

export default function VideoCall() {

  const { user } = useAuth();

  const {

    isConnected, currentRoom, participants, incomingCall,

    localStream, remoteStreams, error, callStatus,

    createRoom, joinRoom, callUser, acceptCall, rejectCall,

    leaveCall, toggleVideo, toggleAudio

  } = useVideoCall(user);

 

  const [activeRooms, setActiveRooms] = useState([]);

  const [roomName, setRoomName] = useState('');

  const [targetUserId, setTargetUserId] = useState('');

 

  // Fetch active rooms

  useEffect(() => {

    const fetchRooms = async () => {

      try {

        const res = await fetch('http://localhost:8080/api/video/rooms');

        if (res.ok) {

          const data = await res.json();

          setActiveRooms(data);

        }

      } catch (err) {

        console.error('Failed to fetch rooms:', err);

      }

    };

    fetchRooms();

    const interval = setInterval(fetchRooms, 5000);

    return () => clearInterval(interval);

  }, []);

 

  // If in an active call, show the call room

  if (callStatus === 'connected' || callStatus === 'calling') {

    return (

      <VideoCallRoom

        localStream={localStream}

        remoteStreams={remoteStreams}

        participants={participants}

        callStatus={callStatus}

        currentRoom={currentRoom}

        onLeave={leaveCall}

        onToggleVideo={toggleVideo}

        onToggleAudio={toggleAudio}

      />

    );

  }

 

  return (

    <div className="video-call-page">

      {/* Incoming Call Modal */}

      {incomingCall && (

        <IncomingCallModal

          callerName={incomingCall.callerName}

          callerRole={incomingCall.callerRole}

          callType={incomingCall.callType}

          onAccept={acceptCall}

          onReject={rejectCall}

        />

      )}

 

      {/* Header */}

      <div className="vc-header">

        <h2>📹 Video Calling</h2>

        <div className={`vc-status ${isConnected ? 'online' : 'offline'}`}>

          <span className="vc-status-dot"></span>

          {isConnected ? 'Connected' : 'Disconnected'}

        </div>

      </div>

 

      {/* Error */}

      {error && <div className="vc-error">{error}</div>}

 

      {/* Actions */}

      <div className="vc-actions-grid">

        {/* Create Room (Admin & Teacher) */}

        {(user?.role === 'Admin' || user?.role === 'Teacher') && (

          <div className="vc-card">

            <h3>🎥 Create Room</h3>

            <p>

              {user?.role === 'Admin'

                ? 'Start a meeting with teachers'

                : 'Start a classroom session for students'}

            </p>

            <input

              type="text"

              placeholder="Room name (optional)"

              value={roomName}

              onChange={(e) => setRoomName(e.target.value)}

              className="vc-input"

            />

            <button

              className="vc-btn vc-btn-primary"

              onClick={() => createRoom(roomName)}

              disabled={!isConnected}

            >

              Create & Start

            </button>

          </div>

        )}

 

        {/* 1:1 Call (Admin→Teacher, Teacher→Student) */}

        {(user?.role === 'Admin' || user?.role === 'Teacher') && (

          <div className="vc-card">

            <h3>📞 One-to-One Call</h3>

            <p>

              {user?.role === 'Admin'

                ? 'Call a specific teacher'

                : 'Call a specific student'}

            </p>

            <input

              type="text"

              placeholder="Enter User ID"

              value={targetUserId}

              onChange={(e) => setTargetUserId(e.target.value)}

              className="vc-input"

            />

            <button

              className="vc-btn vc-btn-secondary"

              onClick={() => callUser(targetUserId)}

              disabled={!isConnected || !targetUserId}

            >

              Call Now

            </button>

          </div>

        )}

 

        {/* Join Room (All roles) */}

        <div className="vc-card">

          <h3>🚪 Join a Room</h3>

          <p>Enter a room ID to join an existing session</p>

          <input

            type="text"

            placeholder="Room ID"

            value={targetUserId}

            onChange={(e) => setTargetUserId(e.target.value)}

            className="vc-input"

            id="join-room-input"

          />

          <button

            className="vc-btn vc-btn-success"

            onClick={() => joinRoom(targetUserId)}

            disabled={!isConnected || !targetUserId}

          >

            Join Room

          </button>

        </div>

      </div>

 

      {/* Active Rooms List */}

      <div className="vc-rooms-section">

        <h3>🏠 Active Rooms</h3>

        {activeRooms.length === 0 ? (

          <p className="vc-no-rooms">No active rooms right now</p>

        ) : (

          <div className="vc-rooms-list">

            {activeRooms.map(room => (

              <div key={room.roomId} className="vc-room-item">

                <div className="vc-room-info">

                  <span className="vc-room-name">{room.roomName}</span>

                  <span className="vc-room-meta">

                    by {room.creatorName} • {room.currentParticipants}/{room.maxParticipants} participants

                  </span>

                  <span className="vc-room-type">{room.callType}</span>

                </div>

                <button

                  className="vc-btn vc-btn-small"

                  onClick={() => joinRoom(room.roomId)}

                  disabled={!isConnected}

                >

                  Join

                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}
