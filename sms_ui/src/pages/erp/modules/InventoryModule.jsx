import { useState, useEffect } from 'react';
import API from '../../../api/axios';
import toast from 'react-hot-toast';

const ASSET_CATEGORIES = [
  'Furniture', 'Electronics', 'IT Equipment', 'Lab Equipment', 'Sports Equipment',
  'Library Assets', 'Kitchen/Cafeteria', 'Transport', 'Cleaning Equipment',
  'Electrical Fixtures', 'CCTV/Security', 'Audio Visual', 'Musical Instruments',
  'Garden/Landscaping', 'Office Supplies', 'Medical Equipment', 'Others'
];

const LOCATIONS = [
  'Principal Office', 'Staff Room', 'Reception', 'Admin Block',
  'Class Room', 'Science Lab', 'Computer Lab', 'Physics Lab', 'Chemistry Lab',
  'Library', 'Auditorium', 'Sports Room', 'Art Room', 'Music Room',
  'Cafeteria', 'Medical Room', 'Security Room', 'Store Room', 'Playground'
];

const CONDITIONS = [
  { value: 'NEW', label: 'New', color: '#16a34a' },
  { value: 'GOOD', label: 'Good', color: '#2563eb' },
  { value: 'FAIR', label: 'Fair', color: '#d97706' },
  { value: 'POOR', label: 'Poor', color: '#dc2626' },
  { value: 'DAMAGED', label: 'Damaged', color: '#dc2626' },
  { value: 'DISPOSED', label: 'Disposed', color: '#64748b' },
];

export default function InventoryModule() {
  const [tab, setTab] = useState('assets');
  const [assets, setAssets] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add Asset Modal
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [assetForm, setAssetForm] = useState({
    name: '', assetCode: '', category: 'Furniture', quantity: 1,
    purchaseDate: '', purchasePrice: '', location: '', condition: 'NEW',
    warranty: '', description: '', assignedTo: ''
  });

  // Add Vendor Modal
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    name: '', contactPerson: '', phone: '', email: '', address: '',
    gstNumber: '', category: ''
  });

  // Purchase Order Modal
  const [showAddPO, setShowAddPO] = useState(false);
  const [poForm, setPoForm] = useState({
    vendorId: '', items: [{ name: '', quantity: 1, unitPrice: '' }],
    expectedDelivery: '', remarks: ''
  });

  // Demo data
  useEffect(() => {
    setAssets([
      { id: 1, assetCode: 'FUR-001', name: 'Student Desk', category: 'Furniture', quantity: 120, location: 'Class Room', condition: 'GOOD', purchaseDate: '2023-04-15', purchasePrice: 2500, assignedTo: 'All Classrooms' },
      { id: 2, assetCode: 'IT-001', name: 'Desktop Computer', category: 'IT Equipment', quantity: 45, location: 'Computer Lab', condition: 'GOOD', purchaseDate: '2024-01-10', purchasePrice: 35000, assignedTo: 'Computer Lab' },
      { id: 3, assetCode: 'LAB-001', name: 'Microscope', category: 'Lab Equipment', quantity: 20, location: 'Science Lab', condition: 'NEW', purchaseDate: '2025-02-20', purchasePrice: 8500, assignedTo: 'Biology Lab' },
      { id: 4, assetCode: 'SPT-001', name: 'Cricket Kit', category: 'Sports Equipment', quantity: 5, location: 'Sports Room', condition: 'FAIR', purchaseDate: '2022-06-01', purchasePrice: 12000, assignedTo: 'Sports Department' },
      { id: 5, assetCode: 'AV-001', name: 'Projector', category: 'Audio Visual', quantity: 15, location: 'Class Room', condition: 'GOOD', purchaseDate: '2024-03-15', purchasePrice: 45000, assignedTo: 'Smart Classrooms' },
    ]);
    setVendors([
      { id: 1, name: 'Sharma Furniture Works', contactPerson: 'Raj Sharma', phone: '9876543210', email: 'raj@sharmafurniture.com', gstNumber: '07AAAAA0000A1Z5', category: 'Furniture' },
      { id: 2, name: 'Digital Solutions Ltd', contactPerson: 'Ankit Verma', phone: '9876543211', email: 'ankit@digitalsol.com', gstNumber: '07BBBBB0000B1Z5', category: 'IT Equipment' },
      { id: 3, name: 'Lab Instruments India', contactPerson: 'Dr. Patel', phone: '9876543212', email: 'patel@labindia.com', gstNumber: '07CCCCC0000C1Z5', category: 'Lab Equipment' },
    ]);
    setPurchaseOrders([
      { id: 1, orderNo: 'PO-2025-001', vendor: 'Sharma Furniture Works', date: '2025-06-15', items: '50 Student Desks', amount: 125000, status: 'DELIVERED' },
      { id: 2, orderNo: 'PO-2025-002', vendor: 'Digital Solutions Ltd', date: '2025-07-01', items: '10 Laptops', amount: 450000, status: 'ORDERED' },
      { id: 3, orderNo: 'PO-2025-003', vendor: 'Lab Instruments India', date: '2025-07-10', items: '5 Microscopes + Slides', amount: 52500, status: 'PENDING' },
    ]);
  }, []);

  // Generate Asset Code
  const generateAssetCode = (category) => {
    const prefix = category.substring(0, 3).toUpperCase();
    const serial = String(assets.length + 1).padStart(3, '0');
    return `${prefix}-${serial}`;
  };

  // Add Asset
  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!assetForm.name || !assetForm.category) { toast.error('Name and category are required'); return; }
    const code = assetForm.assetCode || generateAssetCode(assetForm.category);
    const newAsset = { id: Date.now(), ...assetForm, assetCode: code };
    setAssets(prev => [newAsset, ...prev]);
    toast.success('Asset added successfully!');
    setShowAddAsset(false);
    setAssetForm({ name: '', assetCode: '', category: 'Furniture', quantity: 1, purchaseDate: '', purchasePrice: '', location: '', condition: 'NEW', warranty: '', description: '', assignedTo: '' });
  };

  // Add Vendor
  const handleAddVendor = (e) => {
    e.preventDefault();
    if (!vendorForm.name || !vendorForm.phone) { toast.error('Name and phone are required'); return; }
    setVendors(prev => [{ id: Date.now(), ...vendorForm }, ...prev]);
    toast.success('Vendor added!');
    setShowAddVendor(false);
    setVendorForm({ name: '', contactPerson: '', phone: '', email: '', address: '', gstNumber: '', category: '' });
  };

  // Add Purchase Order
  const handleAddPO = (e) => {
    e.preventDefault();
    if (!poForm.vendorId) { toast.error('Select a vendor'); return; }
    const vendor = vendors.find(v => v.id === Number(poForm.vendorId));
    const totalAmount = poForm.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice || 0)), 0);
    const newPO = {
      id: Date.now(),
      orderNo: `PO-2025-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      vendor: vendor?.name,
      date: new Date().toISOString().split('T')[0],
      items: poForm.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
      amount: totalAmount,
      status: 'PENDING'
    };
    setPurchaseOrders(prev => [newPO, ...prev]);
    toast.success('Purchase order created!');
    setShowAddPO(false);
    setPoForm({ vendorId: '', items: [{ name: '', quantity: 1, unitPrice: '' }], expectedDelivery: '', remarks: '' });
  };

  // PO item management
  const addPOItem = () => setPoForm({ ...poForm, items: [...poForm.items, { name: '', quantity: 1, unitPrice: '' }] });
  const removePOItem = (index) => setPoForm({ ...poForm, items: poForm.items.filter((_, i) => i !== index) });
  const updatePOItem = (index, field, value) => {
    const items = [...poForm.items];
    items[index][field] = value;
    setPoForm({ ...poForm, items });
  };

  // Stats
  const totalValue = assets.reduce((sum, a) => sum + (Number(a.purchasePrice) * Number(a.quantity)), 0);

  return (
    <div className="module-page">
      <div className="page-header-bar">
        <div><h1>📦 Inventory & Asset Management</h1><p>Track assets, stock, procurement, and vendors</p></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {tab === 'assets' && <button className="btn btn-primary" onClick={() => setShowAddAsset(true)}>+ Add Asset</button>}
          {tab === 'vendors' && <button className="btn btn-primary" onClick={() => setShowAddVendor(true)}>+ Add Vendor</button>}
          {tab === 'procurement' && <button className="btn btn-primary" onClick={() => setShowAddPO(true)}>+ Create PO</button>}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid-4" style={{ marginBottom: '20px' }}>
        <div className="stat-card" style={{ borderTopColor: '#2563eb' }}><div className="stat-icon">📦</div><div className="stat-info"><span className="stat-label">Total Assets</span><span className="stat-value" style={{color:'#2563eb'}}>{assets.length}</span></div></div>
        <div className="stat-card" style={{ borderTopColor: '#16a34a' }}><div className="stat-icon">💰</div><div className="stat-info"><span className="stat-label">Total Value</span><span className="stat-value" style={{color:'#16a34a', fontSize:'1.2rem'}}>₹{(totalValue / 100000).toFixed(1)}L</span></div></div>
        <div className="stat-card" style={{ borderTopColor: '#7c3aed' }}><div className="stat-icon">🏢</div><div className="stat-info"><span className="stat-label">Vendors</span><span className="stat-value" style={{color:'#7c3aed'}}>{vendors.length}</span></div></div>
        <div className="stat-card" style={{ borderTopColor: '#d97706' }}><div className="stat-icon">📋</div><div className="stat-info"><span className="stat-label">Pending POs</span><span className="stat-value" style={{color:'#d97706'}}>{purchaseOrders.filter(p => p.status === 'PENDING').length}</span></div></div>
      </div>

      <div className="tab-nav">
        <button className={`tab-btn ${tab === 'assets' ? 'active' : ''}`} onClick={() => setTab('assets')}>📦 Assets</button>
        <button className={`tab-btn ${tab === 'vendors' ? 'active' : ''}`} onClick={() => setTab('vendors')}>🏢 Vendors</button>
        <button className={`tab-btn ${tab === 'procurement' ? 'active' : ''}`} onClick={() => setTab('procurement')}>📋 Purchase Orders</button>
        <button className={`tab-btn ${tab === 'maintenance' ? 'active' : ''}`} onClick={() => setTab('maintenance')}>🔧 Maintenance</button>
      </div>

      {/* ===== ASSETS TAB ===== */}
      {tab === 'assets' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead><tr><th>Asset Code</th><th>Name</th><th>Category</th><th>Qty</th><th>Location</th><th>Condition</th><th>Purchase Date</th><th>Value (₹)</th><th>Assigned To</th></tr></thead>
            <tbody>{assets.map(a => (
              <tr key={a.id}>
                <td><code>{a.assetCode}</code></td>
                <td><strong>{a.name}</strong></td>
                <td><span className="badge badge-blue">{a.category}</span></td>
                <td>{a.quantity}</td>
                <td>{a.location}</td>
                <td><span className="badge" style={{background: CONDITIONS.find(c=>c.value===a.condition)?.color+'22', color: CONDITIONS.find(c=>c.value===a.condition)?.color}}>{a.condition}</span></td>
                <td>{a.purchaseDate}</td>
                <td>₹{Number(a.purchasePrice).toLocaleString()}</td>
                <td>{a.assignedTo || '-'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {/* ===== VENDORS TAB ===== */}
      {tab === 'vendors' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead><tr><th>Vendor Name</th><th>Contact Person</th><th>Phone</th><th>Email</th><th>GST No</th><th>Category</th></tr></thead>
            <tbody>{vendors.map(v => (
              <tr key={v.id}>
                <td><strong>{v.name}</strong></td>
                <td>{v.contactPerson}</td>
                <td>{v.phone}</td>
                <td>{v.email}</td>
                <td><code>{v.gstNumber}</code></td>
                <td><span className="badge badge-blue">{v.category}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {/* ===== PROCUREMENT TAB ===== */}
      {tab === 'procurement' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead><tr><th>Order No</th><th>Vendor</th><th>Date</th><th>Items</th><th>Amount (₹)</th><th>Status</th></tr></thead>
            <tbody>{purchaseOrders.map(po => (
              <tr key={po.id}>
                <td><code>{po.orderNo}</code></td>
                <td><strong>{po.vendor}</strong></td>
                <td>{po.date}</td>
                <td>{po.items}</td>
                <td>₹{Number(po.amount).toLocaleString()}</td>
                <td><span className={`badge ${po.status === 'DELIVERED' ? 'badge-green' : po.status === 'ORDERED' ? 'badge-blue' : 'badge-yellow'}`}>{po.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {/* ===== MAINTENANCE TAB ===== */}
      {tab === 'maintenance' && (
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '16px' }}>🔧 Maintenance & Depreciation</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <h4>📊 Depreciation Rules</h4>
              <p>• Furniture: 10% per year</p>
              <p>• Electronics: 20% per year</p>
              <p>• IT Equipment: 25% per year</p>
              <p>• Lab Equipment: 15% per year</p>
              <p>• Sports Equipment: 15% per year</p>
              <p>• Vehicles: 15% per year</p>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <h4>🔧 Maintenance Schedule</h4>
              <p>• AC/Cooling: Every 3 months</p>
              <p>• Computers: Every 6 months</p>
              <p>• Fire Extinguishers: Yearly</p>
              <p>• Electrical Audit: Yearly</p>
              <p>• Furniture Check: Every 6 months</p>
              <p>• CCTV Maintenance: Quarterly</p>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <h4>📋 Disposal Process</h4>
              <p>1. Identify non-functional assets</p>
              <p>2. Get condition report</p>
              <p>3. Submit to disposal committee</p>
              <p>4. Get principal approval</p>
              <p>5. Auction / Scrap / Donate</p>
              <p>6. Update inventory records</p>
              <p>7. Generate disposal certificate</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD ASSET MODAL ===== */}
      {showAddAsset && (
        <div className="modal-overlay" onClick={() => setShowAddAsset(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>📦 Add New Asset</h2><button className="btn-icon" onClick={() => setShowAddAsset(false)}>✕</button></div>
            <form onSubmit={handleAddAsset} className="modal-body">
              <div className="form-row">
                <div className="form-group"><label>Asset Name *</label><input required placeholder="e.g. Student Desk" value={assetForm.name} onChange={e => setAssetForm({...assetForm, name: e.target.value})} /></div>
                <div className="form-group"><label>Asset Code</label><input placeholder="Auto-generated if empty" value={assetForm.assetCode} onChange={e => setAssetForm({...assetForm, assetCode: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Category *</label>
                  <select required value={assetForm.category} onChange={e => setAssetForm({...assetForm, category: e.target.value})}>
                    {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Quantity *</label><input type="number" min="1" required value={assetForm.quantity} onChange={e => setAssetForm({...assetForm, quantity: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Location *</label>
                  <select required value={assetForm.location} onChange={e => setAssetForm({...assetForm, location: e.target.value})}>
                    <option value="">Select Location</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Condition</label>
                  <select value={assetForm.condition} onChange={e => setAssetForm({...assetForm, condition: e.target.value})}>
                    {CONDITIONS.filter(c => c.value !== 'DISPOSED').map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Purchase Date</label><input type="date" value={assetForm.purchaseDate} onChange={e => setAssetForm({...assetForm, purchaseDate: e.target.value})} /></div>
                <div className="form-group"><label>Purchase Price (₹)</label><input type="number" placeholder="Per unit" value={assetForm.purchasePrice} onChange={e => setAssetForm({...assetForm, purchasePrice: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Warranty Expiry</label><input type="date" value={assetForm.warranty} onChange={e => setAssetForm({...assetForm, warranty: e.target.value})} /></div>
                <div className="form-group"><label>Assigned To</label><input placeholder="e.g. Computer Lab" value={assetForm.assignedTo} onChange={e => setAssetForm({...assetForm, assignedTo: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Description</label><textarea rows={2} placeholder="Additional details..." value={assetForm.description} onChange={e => setAssetForm({...assetForm, description: e.target.value})} /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddAsset(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== ADD VENDOR MODAL ===== */}
      {showAddVendor && (
        <div className="modal-overlay" onClick={() => setShowAddVendor(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>🏢 Add Vendor</h2><button className="btn-icon" onClick={() => setShowAddVendor(false)}>✕</button></div>
            <form onSubmit={handleAddVendor} className="modal-body">
              <div className="form-group"><label>Vendor/Company Name *</label><input required value={vendorForm.name} onChange={e => setVendorForm({...vendorForm, name: e.target.value})} /></div>
              <div className="form-row">
                <div className="form-group"><label>Contact Person</label><input value={vendorForm.contactPerson} onChange={e => setVendorForm({...vendorForm, contactPerson: e.target.value})} /></div>
                <div className="form-group"><label>Phone *</label><input required maxLength={10} value={vendorForm.phone} onChange={e => setVendorForm({...vendorForm, phone: e.target.value.replace(/[^0-9]/g,'')})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Email</label><input type="email" value={vendorForm.email} onChange={e => setVendorForm({...vendorForm, email: e.target.value})} /></div>
                <div className="form-group"><label>GST Number</label><input placeholder="07AAAAA0000A1Z5" value={vendorForm.gstNumber} onChange={e => setVendorForm({...vendorForm, gstNumber: e.target.value.toUpperCase()})} /></div>
              </div>
              <div className="form-group"><label>Category</label>
                <select value={vendorForm.category} onChange={e => setVendorForm({...vendorForm, category: e.target.value})}>
                  <option value="">Select Category</option>
                  {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Address</label><textarea rows={2} value={vendorForm.address} onChange={e => setVendorForm({...vendorForm, address: e.target.value})} /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddVendor(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== PURCHASE ORDER MODAL ===== */}
      {showAddPO && (
        <div className="modal-overlay" onClick={() => setShowAddPO(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header"><h2>📋 Create Purchase Order</h2><button className="btn-icon" onClick={() => setShowAddPO(false)}>✕</button></div>
            <form onSubmit={handleAddPO} className="modal-body">
              <div className="form-row">
                <div className="form-group"><label>Vendor *</label>
                  <select required value={poForm.vendorId} onChange={e => setPoForm({...poForm, vendorId: e.target.value})}>
                    <option value="">Select Vendor</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Expected Delivery</label><input type="date" value={poForm.expectedDelivery} onChange={e => setPoForm({...poForm, expectedDelivery: e.target.value})} /></div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Order Items *</label>
                {poForm.items.map((item, i) => (
                  <div key={i} className="form-row" style={{ marginBottom: '8px', alignItems: 'end' }}>
                    <div className="form-group" style={{ flex: 2 }}><input placeholder="Item name" value={item.name} onChange={e => updatePOItem(i, 'name', e.target.value)} /></div>
                    <div className="form-group" style={{ flex: 0.5 }}><input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={e => updatePOItem(i, 'quantity', e.target.value)} /></div>
                    <div className="form-group" style={{ flex: 1 }}><input type="number" placeholder="Unit Price ₹" value={item.unitPrice} onChange={e => updatePOItem(i, 'unitPrice', e.target.value)} /></div>
                    <button type="button" className="btn-icon" onClick={() => removePOItem(i)} style={{ marginBottom: '6px' }}>🗑️</button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline" onClick={addPOItem} style={{ fontSize: '0.8rem' }}>+ Add Item</button>
              </div>

              <div style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '6px', marginBottom: '12px' }}>
                <strong>Total: ₹{poForm.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice || 0)), 0).toLocaleString()}</strong>
              </div>

              <div className="form-group"><label>Remarks</label><textarea rows={2} value={poForm.remarks} onChange={e => setPoForm({...poForm, remarks: e.target.value})} /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddPO(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Purchase Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
