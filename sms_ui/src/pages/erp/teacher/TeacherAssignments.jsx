export default function TeacherAssignments() {
  return (
    <div className="module-page">
      <div className="page-header-bar"><div><h1>📋 Assignments</h1><p>Create and manage homework & assignments</p></div><button className="btn btn-primary">+ Create Assignment</button></div>
      <div className="empty-state"><span className="empty-icon">📋</span><h3>Your assignments will appear here</h3><p>Connect to backend to load assignments</p></div>
    </div>
  );
}
