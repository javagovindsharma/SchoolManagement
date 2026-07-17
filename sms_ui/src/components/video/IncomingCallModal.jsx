import '../../styles/VideoCall.css';

/**
 * Modal shown when there's an incoming call.
 * Displays caller info and accept/reject buttons.
 */
export default function IncomingCallModal({ callerName, callerRole, callType, onAccept, onReject }) {
  return (
    <div className="vc-modal-overlay">
      <div className="vc-modal">
        <div className="vc-modal-icon">📞</div>
        <h3 className="vc-modal-title">Incoming {callType === 'ONE_TO_ONE' ? 'Call' : 'Group Call'}</h3>
        <p className="vc-modal-caller">
          <strong>{callerName}</strong>
          <span className="vc-modal-role">({callerRole})</span>
        </p>
        <p className="vc-modal-subtitle">is calling you...</p>
        <div className="vc-modal-actions">
          <button className="vc-btn vc-btn-accept" onClick={onAccept}>
            ✅ Accept
          </button>
          <button className="vc-btn vc-btn-reject" onClick={onReject}>
            ❌ Reject
          </button>
        </div>
      </div>
    </div>
  );
}
