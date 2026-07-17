import { useState, useEffect } from 'react';
import API from '../../../api/axios';
import toast from 'react-hot-toast';
import libraryConfig from '../../../config/libraryConfig';

export default function LibraryModule() {
  const [tab, setTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add Book Modal
  const [showAddBook, setShowAddBook] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: '', author: '', isbn: '', publisher: '', edition: '',
    yearPublished: '', language: 'English', pages: '', price: '',
    totalCopies: 1, rackNumber: '', shelfNumber: '', category: 'General'
  });

  // Issue Book Modal
  const [showIssueBook, setShowIssueBook] = useState(false);
  const [issueForm, setIssueForm] = useState({
    bookId: '', studentId: '', dueDate: ''
  });

  const openIssueModal = () => {
    setIssueForm({ bookId: '', studentId: '', dueDate: getDefaultDueDate() });
    setShowIssueBook(true);
  };

  // Return Book Modal
  const [showReturnBook, setShowReturnBook] = useState(false);
  const [returnForm, setReturnForm] = useState({ issueId: '', fine: 0 });

  useEffect(() => { fetchBooks(); fetchStudents(); fetchIssuedBooks(); }, []);

  const fetchBooks = async () => {
    try {
      const res = await API.get('/library/books', { params: { search, page: 0, size: 100 } });
      setBooks(res.data?.data?.content || res.data?.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const fetchStudents = async () => {
    try {
      const res = await API.get('/students', { params: { page: 0, size: 200 } });
      setStudents(res.data?.data?.content || res.data?.data || []);
    } catch { /* ignore */ }
  };

  const fetchIssuedBooks = async () => {
    // For now use local state - in production this would be an API call
    // API: GET /api/library/issues
  };

  // ===== ADD BOOK =====
  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!bookForm.title || !bookForm.author) { toast.error('Title and Author are required'); return; }
    if (!bookForm.isbn) { toast.error('ISBN is required'); return; }
    try {
      await API.post('/library/books', { ...bookForm, availableCopies: bookForm.totalCopies });
      toast.success('Book added to library!');
      setShowAddBook(false);
      setBookForm({ title: '', author: '', isbn: '', publisher: '', edition: '', yearPublished: '', language: 'English', pages: '', price: '', totalCopies: 1, rackNumber: '', shelfNumber: '', category: 'General' });
      fetchBooks();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add book'); }
  };

  // ===== ISSUE BOOK =====
  const handleIssueBook = (e) => {
    e.preventDefault();
    if (!issueForm.bookId || !issueForm.studentId || !issueForm.dueDate) {
      toast.error('All fields are required'); return;
    }
    const book = books.find(b => b.id === Number(issueForm.bookId));
    const student = students.find(s => s.id === Number(issueForm.studentId));

    const newIssue = {
      id: Date.now(),
      book: book,
      student: student,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: issueForm.dueDate,
      status: 'ISSUED',
      fine: 0
    };
    setIssuedBooks(prev => [newIssue, ...prev]);

    // Update available copies
    setBooks(prev => prev.map(b =>
      b.id === Number(issueForm.bookId) ? { ...b, availableCopies: (b.availableCopies || 1) - 1 } : b
    ));

    toast.success(`Book "${book?.title}" issued to ${student?.firstName} ${student?.lastName}`);
    setShowIssueBook(false);
    setIssueForm({ bookId: '', studentId: '', dueDate: '' });
  };

  // ===== RETURN BOOK =====
  const handleReturnBook = (issueId) => {
    const today = new Date();
    setIssuedBooks(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const dueDate = new Date(issue.dueDate);
        const daysLate = Math.max(0, Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)));
        const fine = Math.min(daysLate * libraryConfig.fines.lateReturnPerDay, libraryConfig.fines.maxFinePerBook);
        return { ...issue, status: 'RETURNED', returnDate: today.toISOString().split('T')[0], fine, daysLate };
      }
      return issue;
    }));
    // Restore available copies
    const issue = issuedBooks.find(i => i.id === issueId);
    if (issue) {
      setBooks(prev => prev.map(b =>
        b.id === issue.book?.id ? { ...b, availableCopies: (b.availableCopies || 0) + 1 } : b
      ));
    }
    toast.success('Book returned successfully!');
  };

  // Calculate due date (14 days from now)
  const getDefaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  };

  // Get overdue books
  const overdueBooks = issuedBooks.filter(i => {
    if (i.status === 'RETURNED') return false;
    return new Date(i.dueDate) < new Date();
  });

  const BOOK_CATEGORIES = [
    'General', 'Fiction', 'Non-Fiction', 'Science', 'Mathematics',
    'History', 'Geography', 'English Literature', 'Hindi Literature',
    'Computer Science', 'Reference', 'Encyclopedia', 'Biography',
    'Comics', 'Magazines', 'Journals', 'Text Books', 'Competitive Exams'
  ];

  return (
    <div className="module-page">
      <div className="page-header-bar">
        <div><h1>📖 Library Management</h1><p>Manage books, issue/return, fines, and digital library</p></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline" onClick={openIssueModal}>📤 Issue Book</button>
          <button className="btn btn-primary" onClick={() => setShowAddBook(true)}>+ Add Book</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid-4" style={{ marginBottom: '20px' }}>
        <div className="stat-card" style={{ borderTopColor: '#2563eb' }}>
          <div className="stat-icon">📚</div>
          <div className="stat-info"><span className="stat-label">Total Books</span><span className="stat-value" style={{color:'#2563eb'}}>{books.length}</span></div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#16a34a' }}>
          <div className="stat-icon">✅</div>
          <div className="stat-info"><span className="stat-label">Available</span><span className="stat-value" style={{color:'#16a34a'}}>{books.reduce((sum, b) => sum + (b.availableCopies || 0), 0)}</span></div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#d97706' }}>
          <div className="stat-icon">📤</div>
          <div className="stat-info"><span className="stat-label">Issued</span><span className="stat-value" style={{color:'#d97706'}}>{issuedBooks.filter(i => i.status === 'ISSUED').length}</span></div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#dc2626' }}>
          <div className="stat-icon">⚠️</div>
          <div className="stat-info"><span className="stat-label">Overdue</span><span className="stat-value" style={{color:'#dc2626'}}>{overdueBooks.length}</span></div>
        </div>
      </div>

      <div className="tab-nav">
        <button className={`tab-btn ${tab === 'books' ? 'active' : ''}`} onClick={() => setTab('books')}>📚 All Books</button>
        <button className={`tab-btn ${tab === 'issued' ? 'active' : ''}`} onClick={() => setTab('issued')}>📤 Issued Books</button>
        <button className={`tab-btn ${tab === 'overdue' ? 'active' : ''}`} onClick={() => setTab('overdue')}>⚠️ Overdue ({overdueBooks.length})</button>
        <button className={`tab-btn ${tab === 'returned' ? 'active' : ''}`} onClick={() => setTab('returned')}>✅ Returned</button>
        <button className={`tab-btn ${tab === 'rules' ? 'active' : ''}`} onClick={() => setTab('rules')}>📋 Rules & Settings</button>
      </div>

      {/* ===== ALL BOOKS TAB ===== */}
      {tab === 'books' && (
        <div>
          <div className="filter-bar">
            <input type="search" placeholder="Search by title, author, ISBN..." className="search-input" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchBooks()} />
            <button className="btn btn-primary" onClick={fetchBooks}>Search</button>
          </div>
          {loading ? <p>Loading...</p> : books.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">📚</span><h3>No books in library</h3><p>Click "+ Add Book" to add books</p></div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead><tr><th>Title</th><th>Author</th><th>ISBN</th><th>Publisher</th><th>Rack/Shelf</th><th>Total</th><th>Available</th><th>Status</th></tr></thead>
                <tbody>{books.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.title}</strong><br/><small style={{color:'var(--text-muted)'}}>{b.category}</small></td>
                    <td>{b.author}</td>
                    <td><code>{b.isbn}</code></td>
                    <td>{b.publisher}</td>
                    <td>{b.rackNumber && b.shelfNumber ? `R${b.rackNumber}/S${b.shelfNumber}` : '-'}</td>
                    <td>{b.totalCopies}</td>
                    <td><strong>{b.availableCopies}</strong></td>
                    <td><span className={`badge ${b.availableCopies > 0 ? 'badge-green' : 'badge-red'}`}>{b.availableCopies > 0 ? 'Available' : 'All Issued'}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===== ISSUED BOOKS TAB ===== */}
      {tab === 'issued' && (
        <div>
          {issuedBooks.filter(i => i.status === 'ISSUED').length === 0 ? (
            <div className="empty-state"><span className="empty-icon">📤</span><h3>No books currently issued</h3><p>Use "Issue Book" button to issue books</p></div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead><tr><th>Book</th><th>Student</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>{issuedBooks.filter(i => i.status === 'ISSUED').map(i => {
                  const isOverdue = new Date(i.dueDate) < new Date();
                  return (
                    <tr key={i.id}>
                      <td><strong>{i.book?.title}</strong><br/><small>{i.book?.author}</small></td>
                      <td>{i.student?.firstName} {i.student?.lastName}<br/><small>{i.student?.admissionNo}</small></td>
                      <td>{i.issueDate}</td>
                      <td style={{ color: isOverdue ? 'var(--danger)' : 'inherit' }}>{i.dueDate} {isOverdue && '⚠️'}</td>
                      <td><span className={`badge ${isOverdue ? 'badge-red' : 'badge-yellow'}`}>{isOverdue ? 'OVERDUE' : 'ISSUED'}</span></td>
                      <td><button className="btn btn-primary" style={{padding:'4px 12px', fontSize:'0.8rem'}} onClick={() => handleReturnBook(i.id)}>📥 Return</button></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===== OVERDUE TAB ===== */}
      {tab === 'overdue' && (
        <div>
          {overdueBooks.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">✅</span><h3>No overdue books!</h3><p>All books are within their due dates</p></div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead><tr><th>Book</th><th>Student</th><th>Due Date</th><th>Days Overdue</th><th>Fine (₹2/day)</th><th>Action</th></tr></thead>
                <tbody>{overdueBooks.map(i => {
                  const daysLate = Math.floor((new Date() - new Date(i.dueDate)) / (1000 * 60 * 60 * 24));
                  const fine = daysLate * 2;
                  return (
                    <tr key={i.id}>
                      <td><strong>{i.book?.title}</strong></td>
                      <td>{i.student?.firstName} {i.student?.lastName}</td>
                      <td style={{color:'var(--danger)'}}>{i.dueDate}</td>
                      <td><span className="badge badge-red">{daysLate} days</span></td>
                      <td><strong style={{color:'var(--danger)'}}>₹{fine}</strong></td>
                      <td><button className="btn btn-primary" style={{padding:'4px 12px', fontSize:'0.8rem'}} onClick={() => handleReturnBook(i.id)}>📥 Return + Fine</button></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===== RETURNED TAB ===== */}
      {tab === 'returned' && (
        <div>
          {issuedBooks.filter(i => i.status === 'RETURNED').length === 0 ? (
            <div className="empty-state"><span className="empty-icon">✅</span><h3>No returned books yet</h3></div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead><tr><th>Book</th><th>Student</th><th>Issue Date</th><th>Return Date</th><th>Days Late</th><th>Fine Paid</th></tr></thead>
                <tbody>{issuedBooks.filter(i => i.status === 'RETURNED').map(i => (
                  <tr key={i.id}>
                    <td><strong>{i.book?.title}</strong></td>
                    <td>{i.student?.firstName} {i.student?.lastName}</td>
                    <td>{i.issueDate}</td>
                    <td>{i.returnDate}</td>
                    <td>{i.daysLate > 0 ? <span className="badge badge-red">{i.daysLate} days</span> : <span className="badge badge-green">On time</span>}</td>
                    <td>{i.fine > 0 ? <strong style={{color:'var(--danger)'}}>₹{i.fine}</strong> : '₹0'}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===== RULES & SETTINGS TAB ===== */}
      {tab === 'rules' && (
        <div>
          {/* Library Rules */}
          <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px' }}>📋 Library Rules & Policies</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '8px' }}>📚 Issue Limits</h4>
                <p>• Students: Max <strong>{libraryConfig.rules.maxBooksPerStudent}</strong> books at a time</p>
                <p>• Teachers: Max <strong>{libraryConfig.rules.maxBooksPerTeacher}</strong> books at a time</p>
                <p>• Student issue period: <strong>{libraryConfig.rules.issuePeriodStudentDays}</strong> days</p>
                <p>• Teacher issue period: <strong>{libraryConfig.rules.issuePeriodTeacherDays}</strong> days</p>
              </div>
              <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '8px' }}>🔄 Renewal Rules</h4>
                <p>• Renewal allowed: <strong>{libraryConfig.rules.renewalAllowed ? 'Yes' : 'No'}</strong></p>
                <p>• Max renewals: <strong>{libraryConfig.rules.maxRenewals}</strong> times</p>
                <p>• Renewal period: <strong>{libraryConfig.rules.renewalPeriodDays}</strong> days extra</p>
                <p>• Reservation hold: <strong>{libraryConfig.rules.reservationHoldDays}</strong> days</p>
              </div>
              <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '8px' }}>💰 Fine Structure</h4>
                <p>• Late return: <strong>₹{libraryConfig.fines.lateReturnPerDay}/day</strong></p>
                <p>• Max fine/book: <strong>₹{libraryConfig.fines.maxFinePerBook}</strong></p>
                <p>• Lost book: <strong>Double the book price</strong></p>
                <p>• Damaged book: <strong>Half the book price</strong></p>
                <p>• Torn page: <strong>₹{libraryConfig.fines.tornPageFine}/page</strong></p>
                <p>• Lost card: <strong>₹{libraryConfig.fines.lostCardFine}</strong></p>
              </div>
              <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '8px' }}>⏰ Library Timings</h4>
                <p>• Open: <strong>{libraryConfig.timings.openTime} - {libraryConfig.timings.closeTime}</strong></p>
                <p>• Issue Hours: <strong>{libraryConfig.timings.issueHours.start} - {libraryConfig.timings.issueHours.end}</strong></p>
                <p>• Lunch: {libraryConfig.timings.lunchBreak.start} - {libraryConfig.timings.lunchBreak.end}</p>
                <p>• Closed: {libraryConfig.timings.closedOn.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Library Processes */}
          <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px' }}>📖 Library Processes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {[
                { title: '📤 Book Issue Process', steps: libraryConfig.processes.issue },
                { title: '📥 Book Return Process', steps: libraryConfig.processes.returnProcess },
                { title: '🔄 Renewal Process', steps: libraryConfig.processes.renewal },
                { title: '💰 Fine Collection', steps: libraryConfig.processes.fineCollection },
                { title: '📦 Book Acquisition', steps: libraryConfig.processes.acquisition },
                { title: '📊 Stock Verification', steps: libraryConfig.processes.stockVerification },
              ].map((proc, pi) => (
                <div key={pi} style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                  <h4 style={{ marginBottom: '10px' }}>{proc.title}</h4>
                  <ol style={{ paddingLeft: '18px', fontSize: '0.85rem', lineHeight: '1.8' }}>
                    {proc.steps.map((step, si) => <li key={si}>{step}</li>)}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* DDC Categories */}
          <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px' }}>🏷️ Book Classification (DDC - Dewey Decimal)</h3>
            <div className="data-table-container">
              <table className="data-table" style={{ fontSize: '0.85rem' }}>
                <thead><tr><th>Code</th><th>Category</th></tr></thead>
                <tbody>
                  {libraryConfig.categories.map((cat, i) => (
                    <tr key={i}><td><code>{cat.code}</code></td><td>{cat.name}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reports */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '16px' }}>📊 Available Reports</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '8px' }}>
              {libraryConfig.reports.map((report, i) => (
                <div key={i} style={{ padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📄</span><span>{report}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD BOOK MODAL ===== */}
      {showAddBook && (
        <div className="modal-overlay" onClick={() => setShowAddBook(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>📚 Add New Book</h2><button className="btn-icon" onClick={() => setShowAddBook(false)}>✕</button></div>
            <form onSubmit={handleAddBook} className="modal-body">
              <div className="form-group"><label>Book Title *</label><input required placeholder="e.g. NCERT Mathematics Class 10" value={bookForm.title} onChange={e => setBookForm({...bookForm, title: e.target.value})} /></div>
              <div className="form-row">
                <div className="form-group"><label>Author *</label><input required placeholder="Author name" value={bookForm.author} onChange={e => setBookForm({...bookForm, author: e.target.value})} /></div>
                <div className="form-group"><label>ISBN *</label><input required placeholder="978-0-xxx-xxxxx-x" value={bookForm.isbn} onChange={e => setBookForm({...bookForm, isbn: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Publisher</label><input placeholder="Publisher name" value={bookForm.publisher} onChange={e => setBookForm({...bookForm, publisher: e.target.value})} /></div>
                <div className="form-group"><label>Edition</label><input placeholder="e.g. 3rd Edition" value={bookForm.edition} onChange={e => setBookForm({...bookForm, edition: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Category *</label>
                  <select value={bookForm.category} onChange={e => setBookForm({...bookForm, category: e.target.value})}>
                    {BOOK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Language</label>
                  <select value={bookForm.language} onChange={e => setBookForm({...bookForm, language: e.target.value})}>
                    <option>English</option><option>Hindi</option><option>Sanskrit</option><option>Urdu</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Year Published</label><input type="number" placeholder="2024" value={bookForm.yearPublished} onChange={e => setBookForm({...bookForm, yearPublished: e.target.value})} /></div>
                <div className="form-group"><label>Pages</label><input type="number" placeholder="320" value={bookForm.pages} onChange={e => setBookForm({...bookForm, pages: e.target.value})} /></div>
                <div className="form-group"><label>Price (₹)</label><input type="number" placeholder="450" value={bookForm.price} onChange={e => setBookForm({...bookForm, price: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Total Copies *</label><input type="number" min="1" required value={bookForm.totalCopies} onChange={e => setBookForm({...bookForm, totalCopies: e.target.value})} /></div>
                <div className="form-group"><label>Rack Number</label><input placeholder="e.g. R-05" value={bookForm.rackNumber} onChange={e => setBookForm({...bookForm, rackNumber: e.target.value})} /></div>
                <div className="form-group"><label>Shelf Number</label><input placeholder="e.g. S-03" value={bookForm.shelfNumber} onChange={e => setBookForm({...bookForm, shelfNumber: e.target.value})} /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddBook(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Book</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== ISSUE BOOK MODAL ===== */}
      {showIssueBook && (
        <div className="modal-overlay" onClick={() => setShowIssueBook(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>📤 Issue Book</h2><button className="btn-icon" onClick={() => setShowIssueBook(false)}>✕</button></div>
            <form onSubmit={handleIssueBook} className="modal-body">
              <div className="form-group">
                <label>Select Book *</label>
                <select required value={issueForm.bookId} onChange={e => setIssueForm({...issueForm, bookId: e.target.value})}>
                  <option value="">Select a book</option>
                  {books.filter(b => b.availableCopies > 0).map(b => (
                    <option key={b.id} value={b.id}>{b.title} — {b.author} (Available: {b.availableCopies})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Issue To (Student) *</label>
                <select required value={issueForm.studentId} onChange={e => setIssueForm({...issueForm, studentId: e.target.value})}>
                  <option value="">Select student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNo})</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Issue Date</label>
                  <input type="date" value={new Date().toISOString().split('T')[0]} disabled />
                </div>
                <div className="form-group">
                  <label>Due Date * (Return by)</label>
                  <input type="date" required value={issueForm.dueDate} onChange={e => setIssueForm({...issueForm, dueDate: e.target.value})} min={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px', fontSize: '0.85rem' }}>
                <strong>Library Rules:</strong><br/>
                • Maximum issue period: 14 days<br/>
                • Fine for late return: ₹2 per day<br/>
                • Maximum books per student: 3
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowIssueBook(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Issue Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
