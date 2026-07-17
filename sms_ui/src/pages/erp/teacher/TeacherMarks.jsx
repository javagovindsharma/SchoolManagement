export default function TeacherMarks() {
  return (
    <div className="module-page">
      <div className="page-header-bar"><div><h1>📝 Marks Entry</h1><p>Enter and manage exam marks for your subjects</p></div></div>
      <div className="filter-bar">
        <select className="filter-select"><option>Select Exam</option><option>Unit Test 1</option><option>Unit Test 2</option><option>Half Yearly</option></select>
        <select className="filter-select"><option>Select Class</option><option>Class 9C</option><option>Class 10A</option><option>Class 10B</option></select>
        <select className="filter-select"><option>Select Subject</option><option>Mathematics</option></select>
        <button className="btn btn-primary">Load</button>
      </div>
      <div className="empty-state"><span className="empty-icon">📝</span><h3>Select exam, class & subject to enter marks</h3></div>
    </div>
  );
}
