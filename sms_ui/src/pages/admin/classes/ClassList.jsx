import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../../api/axios';
import { useLanguage } from '../../../context/LanguageContext';

export default function ClassList() {
  const { t } = useLanguage();
  const [classes, setClasses] = useState([]);
  const [studentCounts, setStudentCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/classes'),
      API.get('/students')
    ])
      .then(([classesRes, studentsRes]) => {
        setClasses(classesRes.data);
        
        // Count students by class
        const counts = {};
        studentsRes.data.forEach(student => {
          const classKey = student.class || student.className;
          counts[classKey] = (counts[classKey] || 0) + 1;
        });
        setStudentCounts(counts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🏫 {t('classes')}</h1>
        <Link to="/admin/classes/add" className="btn btn-primary">
          ➕ Add Class
        </Link>
      </div>

      {loading ? (
        <div className="card text-center"><p>{t('loading')}</p></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>{t('className')}</th>
                <th>Section</th>
                <th>{t('teachers')}</th>
                <th>{t('students')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td><strong>{c.className}</strong></td>
                  <td><span className="badge badge-blue">{c.section}</span></td>
                  <td>{c.teacherName || 'N/A'}</td>
                  <td><span className="badge badge-green">{studentCounts[c.className] || 0}</span></td>
                  <td>
                    <Link to={`/admin/classes/edit/${c.id}`} className="btn btn-sm btn-primary">
                      ✏️ Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {classes.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: '30px', color: '#94a3b8' }}>
                    No classes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}