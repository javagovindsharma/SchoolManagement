import { useState, useEffect } from 'react';
import API from '../../../api/axios';
import toast from 'react-hot-toast';

const VEHICLE_TYPES = ['Bus', 'Mini Bus', 'Van', 'Auto', 'Car'];
const FUEL_TYPES = ['Diesel', 'Petrol', 'CNG', 'Electric'];

export default function TransportModule() {
  const [tab, setTab] = useState('routes');
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([
    { id: 1, number: 'DL-01-AB-1234', type: 'Bus', make: 'Tata', model: 'Starbus', capacity: 52, fuel: 'Diesel', driver: 'Ramesh Kumar', driverPhone: '9876543210', insuranceExpiry: '2026-03-15', fitnessExpiry: '2025-12-31', gpsId: 'GPS-001', status: 'ACTIVE' },
    { id: 2, number: 'DL-01-CD-5678', type: 'Bus', make: 'Ashok Leyland', model: 'Lynx', capacity: 48, fuel: 'Diesel', driver: 'Suresh Singh', driverPhone: '9876543211', insuranceExpiry: '2026-01-20', fitnessExpiry: '2025-11-30', gpsId: 'GPS-002', status: 'ACTIVE' },
    { id: 3, number: 'DL-01-EF-9012', type: 'Mini Bus', make: 'Force', model: 'Traveller', capacity: 26, fuel: 'Diesel', driver: 'Mohan Lal', driverPhone: '9876543212', insuranceExpiry: '2025-09-10', fitnessExpiry: '2025-08-15', gpsId: 'GPS-003', status: 'MAINTENANCE' },
  ]);
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Ramesh Kumar', phone: '9876543210', license: 'DL-1420110012345', licenseExpiry: '2028-05-20', experience: 12, vehicle: 'DL-01-AB-1234', bloodGroup: 'B+', address: 'Dwarka Sec-7, Delhi', status: 'ACTIVE' },
    { id: 2, name: 'Suresh Singh', phone: '9876543211', license: 'DL-1420110054321', licenseExpiry: '2027-08-15', experience: 8, vehicle: 'DL-01-CD-5678', bloodGroup: 'O+', address: 'Janakpuri, Delhi', status: 'ACTIVE' },
    { id: 3, name: 'Mohan Lal', phone: '9876543212', license: 'DL-1420110098765', licenseExpiry: '2026-12-01', experience: 15, vehicle: 'DL-01-EF-9012', bloodGroup: 'A+', address: 'Rohini Sec-3, Delhi', status: 'ON_LEAVE' },
  ]);
  const [students, setStudents] = useState([]);
  const [allocations, setAllocations] = useState([
    { id: 1, studentName: 'Rahul Sharma', admissionNo: 'ADM202600001', routeName: 'Route 1 - Dwarka', stopName: 'Dwarka Sec-7' },
    { id: 2, studentName: 'Priya Singh', admissionNo: 'ADM202600002', routeName: 'Route 2 - Janakpuri', stopName: 'Janakpuri West' },
  ]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showAllocate, setShowAllocate] = useState(false);

  // Forms
  const [routeForm, setRouteForm] = useState({ routeName: '', routeNumber: '', startLocation: '', endLocation: '', monthlyFee: '', maxStudents: '', vehicleId: '', stops: '' });
  const [vehicleForm, setVehicleForm] = useState({ number: '', type: 'Bus', make: '', model: '', capacity: '', fuel: 'Diesel', insuranceExpiry: '', fitnessExpiry: '', gpsId: '' });
  const [driverForm, setDriverForm] = useState({ name: '', phone: '', license: '', licenseExpiry: '', experience: '', bloodGroup: '', address: '' });
  const [allocateForm, setAllocateForm] = useState({ studentId: '', routeId: '', stopName: '' });

  useEffect(() => { fetchRoutes(); fetchStudents(); }, []);

  const fetchRoutes = async () => {
    try {
      const res = await API.get('/transport/routes');
      setRoutes(res.data?.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const fetchStudents = async () => {
    try {
      const res = await API.get('/students', { params: { page: 0, size: 200 } });
      setStudents(res.data?.data?.content || res.data?.data || []);
    } catch { /* ignore */ }
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    if (!routeForm.routeName || !routeForm.startLocation || !routeForm.endLocation) { toast.error('Fill required fields'); return; }
    try {
      await API.post('/transport/routes', routeForm);
      toast.success('Route created!');
      setShowAddRoute(false);
      setRouteForm({ routeName: '', routeNumber: '', startLocation: '', endLocation: '', monthlyFee: '', maxStudents: '', vehicleId: '', stops: '' });
      fetchRoutes();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!vehicleForm.number || !vehicleForm.type) { toast.error('Vehicle number and type required'); return; }
    setVehicles(prev => [{ id: Date.now(), ...vehicleForm, status: 'ACTIVE', driver: '-', driverPhone: '-' }, ...prev]);
    toast.success('Vehicle added!');
    setShowAddVehicle(false);
    setVehicleForm({ number: '', type: 'Bus', make: '', model: '', capacity: '', fuel: 'Diesel', insuranceExpiry: '', fitnessExpiry: '', gpsId: '' });
  };

  const handleAddDriver = (e) => {
    e.preventDefault();
    if (!driverForm.name || !driverForm.phone || !driverForm.license) { toast.error('Fill required fields'); return; }
    setDrivers(prev => [{ id: Date.now(), ...driverForm, vehicle: '-', status: 'ACTIVE' }, ...prev]);
    toast.success('Driver added!');
    setShowAddDriver(false);
    setDriverForm({ name: '', phone: '', license: '', licenseExpiry: '', experience: '', bloodGroup: '', address: '' });
  };

  const handleAllocate = (e) => {
    e.preventDefault();
    if (!allocateForm.studentId || !allocateForm.routeId) { toast.error('Select student and route'); return; }
    const student = students.find(s => String(s.id) === String(allocateForm.studentId));
    const route = routes.find(r => String(r.id) === String(allocateForm.routeId));
    const newAllocation = {
      id: Date.now(),
      studentId: allocateForm.studentId,
      studentName: `${student?.firstName || ''} ${student?.lastName || ''}`.trim() || 'Unknown',
      admissionNo: student?.admissionNo || '-',
      routeId: allocateForm.routeId,
      routeName: route?.routeName || 'Unknown Route',
      stopName: allocateForm.stopName || '-'
    };
    setAllocations(prevAllocations => {
      const updated = [...prevAllocations, newAllocation];
      return updated;
    });
    setShowAllocate(false);
    setAllocateForm({ studentId: '', routeId: '', stopName: '' });
    setTab('allocation');
    toast.success(`${newAllocation.studentName} allocated to ${newAllocation.routeName}`);
  };


  return (
    <div className="module-page">
      <div className="page-header-bar">
        <div><h1>🚌 Transport Management</h1><p>Manage routes, vehicles, drivers, student allocation, and GPS tracking</p></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {tab === 'routes' && <button className="btn btn-primary" onClick={() => setShowAddRoute(true)}>+ Add Route</button>}
          {tab === 'vehicles' && <button className="btn btn-primary" onClick={() => setShowAddVehicle(true)}>+ Add Vehicle</button>}
          {tab === 'drivers' && <button className="btn btn-primary" onClick={() => setShowAddDriver(true)}>+ Add Driver</button>}
          {tab === 'allocation' && <button className="btn btn-primary" onClick={() => { fetchStudents(); setShowAllocate(true); }}>+ Allocate Student</button>}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid-4" style={{ marginBottom: '20px' }}>
        <div className="stat-card" style={{ borderTopColor: '#2563eb' }}><div className="stat-icon">🛣️</div><div className="stat-info"><span className="stat-label">Total Routes</span><span className="stat-value" style={{color:'#2563eb'}}>{routes.length}</span></div></div>
        <div className="stat-card" style={{ borderTopColor: '#16a34a' }}><div className="stat-icon">🚌</div><div className="stat-info"><span className="stat-label">Vehicles</span><span className="stat-value" style={{color:'#16a34a'}}>{vehicles.length}</span></div></div>
        <div className="stat-card" style={{ borderTopColor: '#7c3aed' }}><div className="stat-icon">👨‍✈️</div><div className="stat-info"><span className="stat-label">Drivers</span><span className="stat-value" style={{color:'#7c3aed'}}>{drivers.length}</span></div></div>
        <div className="stat-card" style={{ borderTopColor: '#d97706' }}><div className="stat-icon">⚠️</div><div className="stat-info"><span className="stat-label">Maintenance</span><span className="stat-value" style={{color:'#d97706'}}>{vehicles.filter(v => v.status === 'MAINTENANCE').length}</span></div></div>
      </div>

      <div className="tab-nav">
        <button className={`tab-btn ${tab === 'routes' ? 'active' : ''}`} onClick={() => setTab('routes')}>🛣️ Routes</button>
        <button className={`tab-btn ${tab === 'vehicles' ? 'active' : ''}`} onClick={() => setTab('vehicles')}>🚌 Vehicles</button>
        <button className={`tab-btn ${tab === 'drivers' ? 'active' : ''}`} onClick={() => setTab('drivers')}>👨‍✈️ Drivers</button>
        <button className={`tab-btn ${tab === 'allocation' ? 'active' : ''}`} onClick={() => setTab('allocation')}>🎓 Student Allocation</button>
        <button className={`tab-btn ${tab === 'tracking' ? 'active' : ''}`} onClick={() => setTab('tracking')}>📍 GPS Tracking</button>
      </div>

      {/* ===== ROUTES TAB ===== */}
      {tab === 'routes' && (
        <div>
          {routes.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">🛣️</span><h3>No routes found</h3><p>Click "+ Add Route" to create one</p></div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead><tr><th>Route No</th><th>Route Name</th><th>From</th><th>To</th><th>Fee/Month</th><th>Max Students</th><th>Status</th></tr></thead>
                <tbody>{routes.map(r => (
                  <tr key={r.id}>
                    <td><code>{r.routeNumber || '-'}</code></td>
                    <td><strong>{r.routeName}</strong></td>
                    <td>{r.startLocation}</td>
                    <td>{r.endLocation}</td>
                    <td>₹{r.monthlyFee || '-'}</td>
                    <td>{r.maxStudents || '-'}</td>
                    <td><span className="badge badge-green">Active</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===== VEHICLES TAB ===== */}
      {tab === 'vehicles' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead><tr><th>Vehicle No</th><th>Type</th><th>Make/Model</th><th>Capacity</th><th>Fuel</th><th>Driver</th><th>GPS</th><th>Insurance Exp</th><th>Fitness Exp</th><th>Status</th></tr></thead>
            <tbody>{vehicles.map(v => (
              <tr key={v.id}>
                <td><code>{v.number}</code></td>
                <td><span className="badge badge-blue">{v.type}</span></td>
                <td>{v.make} {v.model}</td>
                <td>{v.capacity} seats</td>
                <td>{v.fuel}</td>
                <td>{v.driver}<br/><small>{v.driverPhone}</small></td>
                <td><code>{v.gpsId}</code></td>
                <td style={{color: new Date(v.insuranceExpiry) < new Date() ? 'var(--danger)' : 'inherit'}}>{v.insuranceExpiry}</td>
                <td style={{color: new Date(v.fitnessExpiry) < new Date() ? 'var(--danger)' : 'inherit'}}>{v.fitnessExpiry}</td>
                <td><span className={`badge ${v.status === 'ACTIVE' ? 'badge-green' : v.status === 'MAINTENANCE' ? 'badge-yellow' : 'badge-red'}`}>{v.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {/* ===== DRIVERS TAB ===== */}
      {tab === 'drivers' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Phone</th><th>License No</th><th>License Exp</th><th>Experience</th><th>Blood Group</th><th>Vehicle Assigned</th><th>Status</th></tr></thead>
            <tbody>{drivers.map(d => (
              <tr key={d.id}>
                <td><strong>{d.name}</strong></td>
                <td>{d.phone}</td>
                <td><code>{d.license}</code></td>
                <td style={{color: new Date(d.licenseExpiry) < new Date() ? 'var(--danger)' : 'inherit'}}>{d.licenseExpiry}</td>
                <td>{d.experience} years</td>
                <td>{d.bloodGroup}</td>
                <td><code>{d.vehicle}</code></td>
                <td><span className={`badge ${d.status === 'ACTIVE' ? 'badge-green' : 'badge-yellow'}`}>{d.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {/* ===== STUDENT ALLOCATION TAB ===== */}
      {tab === 'allocation' && (
        <div>
          <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '12px' }}>🎓 Student-Route Allocation</h3>
            <p style={{ color: 'var(--text-muted)' }}>Total Allocations: <strong>{allocations.length}</strong></p>
          </div>
          {allocations.length > 0 && (
            <div className="data-table-container">
              <table className="data-table">
                <thead><tr><th>#</th><th>Student</th><th>Admission No</th><th>Route</th><th>Pickup Stop</th><th>Action</th></tr></thead>
                <tbody>{allocations.map((a, i) => (
                  <tr key={a.id || i}>
                    <td>{i + 1}</td>
                    <td><strong>{a.studentName}</strong></td>
                    <td><code>{a.admissionNo}</code></td>
                    <td>{a.routeName}</td>
                    <td>{a.stopName || '-'}</td>
                    <td><button className="btn-icon" onClick={() => setAllocations(prev => prev.filter((_, idx) => idx !== i))}>🗑️</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
          {allocations.length === 0 && (
            <div className="empty-state"><span className="empty-icon">🎓</span><h3>No students allocated yet</h3><p>Click "+ Allocate Student" to assign students to routes</p></div>
          )}
        </div>
      )}

      {/* ===== GPS TRACKING TAB ===== */}
      {tab === 'tracking' && (
        <div>
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '16px' }}>📍 Live GPS Tracking</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {vehicles.filter(v => v.status === 'ACTIVE').map(v => (
                <div key={v.id} style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid #16a34a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong>{v.number}</strong>
                    <span className="badge badge-green">● Live</span>
                  </div>
                  <p style={{fontSize:'0.85rem'}}>🚌 {v.type} - {v.make} {v.model}</p>
                  <p style={{fontSize:'0.85rem'}}>👨‍✈️ {v.driver} | 📞 {v.driverPhone}</p>
                  <p style={{fontSize:'0.85rem'}}>📡 GPS: {v.gpsId}</p>
                  <p style={{fontSize:'0.85rem', color:'var(--accent)'}}>📍 Last Location: Near Dwarka Mor Metro</p>
                  <p style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>⏱️ Updated: 2 min ago | Speed: 35 km/h</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD ROUTE MODAL ===== */}
      {showAddRoute && (
        <div className="modal-overlay" onClick={() => setShowAddRoute(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>🛣️ Add Bus Route</h2><button className="btn-icon" onClick={() => setShowAddRoute(false)}>✕</button></div>
            <form onSubmit={handleAddRoute} className="modal-body">
              <div className="form-row">
                <div className="form-group"><label>Route Name *</label><input required placeholder="e.g. Route 1 - Dwarka" value={routeForm.routeName} onChange={e => setRouteForm({...routeForm, routeName: e.target.value})} /></div>
                <div className="form-group"><label>Route Number</label><input placeholder="e.g. R-01" value={routeForm.routeNumber} onChange={e => setRouteForm({...routeForm, routeNumber: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Start Location *</label><input required placeholder="Starting point" value={routeForm.startLocation} onChange={e => setRouteForm({...routeForm, startLocation: e.target.value})} /></div>
                <div className="form-group"><label>End Location *</label><input required placeholder="School" value={routeForm.endLocation} onChange={e => setRouteForm({...routeForm, endLocation: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Monthly Fee (₹)</label><input type="number" placeholder="2500" value={routeForm.monthlyFee} onChange={e => setRouteForm({...routeForm, monthlyFee: e.target.value})} /></div>
                <div className="form-group"><label>Max Students</label><input type="number" placeholder="50" value={routeForm.maxStudents} onChange={e => setRouteForm({...routeForm, maxStudents: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Stops (comma separated)</label><textarea rows={2} placeholder="e.g. Dwarka Sec-7, Dwarka Mor, Janakpuri, Tilak Nagar, School" value={routeForm.stops} onChange={e => setRouteForm({...routeForm, stops: e.target.value})} /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddRoute(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Route</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== ADD VEHICLE MODAL ===== */}
      {showAddVehicle && (
        <div className="modal-overlay" onClick={() => setShowAddVehicle(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>🚌 Add Vehicle</h2><button className="btn-icon" onClick={() => setShowAddVehicle(false)}>✕</button></div>
            <form onSubmit={handleAddVehicle} className="modal-body">
              <div className="form-row">
                <div className="form-group"><label>Vehicle Number *</label><input required placeholder="DL-01-AB-1234" value={vehicleForm.number} onChange={e => setVehicleForm({...vehicleForm, number: e.target.value.toUpperCase()})} /></div>
                <div className="form-group"><label>Type *</label>
                  <select required value={vehicleForm.type} onChange={e => setVehicleForm({...vehicleForm, type: e.target.value})}>
                    {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Make</label><input placeholder="e.g. Tata" value={vehicleForm.make} onChange={e => setVehicleForm({...vehicleForm, make: e.target.value})} /></div>
                <div className="form-group"><label>Model</label><input placeholder="e.g. Starbus" value={vehicleForm.model} onChange={e => setVehicleForm({...vehicleForm, model: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Seating Capacity *</label><input type="number" required placeholder="52" value={vehicleForm.capacity} onChange={e => setVehicleForm({...vehicleForm, capacity: e.target.value})} /></div>
                <div className="form-group"><label>Fuel Type</label>
                  <select value={vehicleForm.fuel} onChange={e => setVehicleForm({...vehicleForm, fuel: e.target.value})}>
                    {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Insurance Expiry</label><input type="date" value={vehicleForm.insuranceExpiry} onChange={e => setVehicleForm({...vehicleForm, insuranceExpiry: e.target.value})} /></div>
                <div className="form-group"><label>Fitness Expiry</label><input type="date" value={vehicleForm.fitnessExpiry} onChange={e => setVehicleForm({...vehicleForm, fitnessExpiry: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>GPS Device ID</label><input placeholder="e.g. GPS-001" value={vehicleForm.gpsId} onChange={e => setVehicleForm({...vehicleForm, gpsId: e.target.value})} /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddVehicle(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== ADD DRIVER MODAL ===== */}
      {showAddDriver && (
        <div className="modal-overlay" onClick={() => setShowAddDriver(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>👨‍✈️ Add Driver</h2><button className="btn-icon" onClick={() => setShowAddDriver(false)}>✕</button></div>
            <form onSubmit={handleAddDriver} className="modal-body">
              <div className="form-row">
                <div className="form-group"><label>Full Name *</label><input required placeholder="Driver name" value={driverForm.name} onChange={e => setDriverForm({...driverForm, name: e.target.value})} /></div>
                <div className="form-group"><label>Phone * (10 digits)</label><input required maxLength={10} placeholder="9876543210" value={driverForm.phone} onChange={e => setDriverForm({...driverForm, phone: e.target.value.replace(/[^0-9]/g,'')})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>License Number *</label><input required placeholder="DL-1420110012345" value={driverForm.license} onChange={e => setDriverForm({...driverForm, license: e.target.value.toUpperCase()})} /></div>
                <div className="form-group"><label>License Expiry *</label><input type="date" required value={driverForm.licenseExpiry} onChange={e => setDriverForm({...driverForm, licenseExpiry: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Experience (years)</label><input type="number" placeholder="10" value={driverForm.experience} onChange={e => setDriverForm({...driverForm, experience: e.target.value})} /></div>
                <div className="form-group"><label>Blood Group</label>
                  <select value={driverForm.bloodGroup} onChange={e => setDriverForm({...driverForm, bloodGroup: e.target.value})}>
                    <option value="">Select</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Address</label><textarea rows={2} value={driverForm.address} onChange={e => setDriverForm({...driverForm, address: e.target.value})} /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddDriver(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== ALLOCATE STUDENT MODAL ===== */}
      {showAllocate && (
        <div className="modal-overlay" onClick={() => setShowAllocate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>🎓 Allocate Student to Route</h2><button className="btn-icon" onClick={() => setShowAllocate(false)}>✕</button></div>
            <form onSubmit={handleAllocate} className="modal-body">
              <div className="form-group"><label>Select Student * {students.length === 0 && <small style={{color:'var(--danger)'}}>(No students found - add students first)</small>}</label>
                <select required value={allocateForm.studentId} onChange={e => setAllocateForm({...allocateForm, studentId: e.target.value})}>
                  <option value="">Select Student ({students.length} available)</option>
                  {students.map(s => <option key={s.id} value={String(s.id)}>{s.firstName} {s.lastName} ({s.admissionNo})</option>)}
                </select>
              </div>
              <div className="form-group"><label>Select Route * {routes.length === 0 && <small style={{color:'var(--danger)'}}>(No routes found - add routes first)</small>}</label>
                <select required value={allocateForm.routeId} onChange={e => setAllocateForm({...allocateForm, routeId: e.target.value})}>
                  <option value="">Select Route ({routes.length} available)</option>
                  {routes.map(r => <option key={r.id} value={String(r.id)}>{r.routeName} ({r.startLocation} → {r.endLocation})</option>)}
                </select>
              </div>
              <div className="form-group"><label>Pickup/Drop Stop</label><input placeholder="e.g. Dwarka Sec-7" value={allocateForm.stopName} onChange={e => setAllocateForm({...allocateForm, stopName: e.target.value})} /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAllocate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Allocate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
