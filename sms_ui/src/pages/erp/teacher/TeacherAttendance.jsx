export default function TeacherAttendance() {
  return (
    <div className="module-page">
      <div className="page-header-bar"><div><h1>✅ Mark Attendance</h1><p>Mark daily attendance for your classes</p></div></div>
      <div className="filter-bar">
        <select className="filter-select"><option>Select Class</option><option>Class 9C</option><option>Class 10A</option><option>Class 10B</option><option>Class 11A</option></select>
        <input type="date" className="filter-select" defaultValue={new Date().toISOString().split('T')[0]} />
        <button className="btn btn-primary">Load Students</button>
      </div>
      <div className="empty-state"><span className="empty-icon">✅</span><h3>Select a class to mark attendance</h3></div>
    </div>
  );
}
