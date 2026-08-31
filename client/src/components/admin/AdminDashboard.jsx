import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  MessageSquare, 
  Search, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  X, 
  Save, 
  RefreshCw,
  Phone,
  Mail,
  Filter
} from 'lucide-react';

export default function AdminDashboard({ onRefreshData }) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'leads', 'employees'
  const [vehicles, setVehicles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    reservedVehicles: 0,
    soldVehicles: 0,
    totalInquiries: 0,
    totalInventoryValue: 0
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Form State for Vehicle
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    variant: '',
    year: 2021,
    categoryId: 'sedan',
    price: 750000,
    previousPrice: '',
    mileage: 35000,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    engine: '1.5L 4-Cylinder',
    color: 'Platinum White',
    condition: 'Certified Pre-Owned',
    registrationStatus: 'Updated 2026',
    status: 'AVAILABLE',
    images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
    description: '',
    features: ['Touchscreen Audio', 'Reverse Camera', 'ABS with EBD', 'Push Start']
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [vRes, eRes, lRes, sRes] = await Promise.all([
        fetch('/api/vehicles?status=ALL'),
        fetch('/api/employees'),
        fetch('/api/leads'),
        fetch('/api/admin/stats')
      ]);

      if (vRes.ok) setVehicles(await vRes.json());
      if (eRes.ok) setEmployees(await eRes.json());
      if (lRes.ok) setLeads(await lRes.json());
      if (sRes.ok) setStats(await sRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAdminData();
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm("Are you sure you want to delete this vehicle listing?")) return;
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdminData();
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
    }
  };

  const handleLeadStageChange = async (leadId, newStage) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error('Failed to update lead stage:', err);
    }
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      brand: '',
      model: '',
      variant: '',
      year: 2021,
      categoryId: 'sedan',
      price: 680000,
      previousPrice: '',
      mileage: 35000,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      engine: '1.5L 4-Cylinder',
      color: 'Solid Red',
      condition: 'Certified Pre-Owned',
      registrationStatus: 'Updated 2026',
      status: 'AVAILABLE',
      images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
      description: 'Well-maintained, clean papers, showroom condition.',
      features: ['Apple CarPlay', 'Reverse Camera', 'Dual Airbags', 'Keyless Entry']
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (v) => {
    setEditingVehicle(v);
    setFormData({
      ...v,
      images: v.images || ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
      features: v.features || []
    });
    setIsAddModalOpen(true);
  };

  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    try {
      const url = editingVehicle ? `/api/vehicles/${editingVehicle.id}` : '/api/vehicles';
      const method = editingVehicle ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        fetchAdminData();
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error('Error saving vehicle:', err);
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.categoryId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-zinc-100 min-h-screen py-8 text-left select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Stats Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-950 text-white p-6 rounded-2xl border border-zinc-800 shadow-md">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-rose-500" />
              <h1 className="text-xl font-bold tracking-tight">Dealership Control Console</h1>
            </div>
            <p className="text-xs text-zinc-400">Manage vehicle listings, availability, team roster, and customer lead inquiries.</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchAdminData}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={openAddModal}
              className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* 5 Stats Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Total Inventory</span>
            <span className="text-2xl font-black text-zinc-900 mt-1 block">{stats.totalVehicles}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Available Units</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{stats.availableVehicles}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Reserved Units</span>
            <span className="text-2xl font-black text-amber-500 mt-1 block">{stats.reservedVehicles}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Sold Records</span>
            <span className="text-2xl font-black text-zinc-600 mt-1 block">{stats.soldVehicles}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm col-span-2 lg:col-span-1">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Active Leads</span>
            <span className="text-2xl font-black text-rose-600 mt-1 block">{stats.totalInquiries}</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 border-b border-zinc-200">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'inventory'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Vehicles Inventory ({vehicles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'leads'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Customer Inquiries CRM ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('employees')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'employees'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Sales Representatives ({employees.length})</span>
          </button>
        </div>

        {/* TAB 1: INVENTORY TABLE */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden space-y-4 p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Filter inventory table..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-rose-500"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              </div>

              <div className="text-xs text-zinc-500">
                Showing {filteredVehicles.length} of {vehicles.length} listings
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-semibold border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Mileage & Gear</th>
                    <th className="py-3 px-4">Status Toggle</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={v.images?.[0]}
                            alt={v.model}
                            className="w-12 h-9 rounded-lg object-cover border border-zinc-200 shrink-0"
                          />
                          <div>
                            <strong className="text-zinc-900 block font-bold">{v.year} {v.brand} {v.model}</strong>
                            <span className="text-[11px] text-zinc-400 block truncate max-w-xs">{v.variant}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 capitalize font-medium text-zinc-600">
                        {v.categoryId}
                      </td>

                      <td className="py-3 px-4 font-bold text-rose-600">
                        ₱{v.price.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-zinc-600">
                        <div>{v.mileage.toLocaleString()} km</div>
                        <div className="text-[11px] text-zinc-400">{v.transmission} • {v.fuelType}</div>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={v.status}
                          onChange={(e) => handleStatusChange(v.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                            v.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            v.status === 'RESERVED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-zinc-100 text-zinc-600 border-zinc-200'
                          }`}
                        >
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="RESERVED">RESERVED</option>
                          <option value="SOLD">SOLD</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(v)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                          title="Edit Vehicle"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(v.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: LEADS CRM TABLE */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-5 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">
              Customer Inquiries Pipeline
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-semibold border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Vehicle Inquired</th>
                    <th className="py-3 px-4">Assigned Agent</th>
                    <th className="py-3 px-4">Inquiry Notes</th>
                    <th className="py-3 px-4">Pipeline Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3 px-4">
                        <strong className="text-zinc-900 block font-bold">{l.customerName}</strong>
                        <span className="text-zinc-400 text-[11px]">{l.phone || l.email || 'Web Chat Lead'}</span>
                      </td>

                      <td className="py-3 px-4 font-medium text-zinc-800">
                        {l.vehicleTitle}
                        {l.vehiclePrice && <span className="block text-[11px] text-rose-600 font-bold">{l.vehiclePrice}</span>}
                      </td>

                      <td className="py-3 px-4 text-zinc-600">
                        {l.assignedTo}
                      </td>

                      <td className="py-3 px-4 text-zinc-500 max-w-xs">
                        {l.notes}
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={l.stage}
                          onChange={(e) => handleLeadStageChange(l.id, e.target.value)}
                          className="bg-zinc-50 border border-zinc-300 text-zinc-800 font-medium px-2.5 py-1 rounded-lg text-xs"
                        >
                          <option value="New Inquiry">New Inquiry</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Viewing Scheduled">Viewing Scheduled</option>
                          <option value="Negotiation">Negotiation</option>
                          <option value="Sold">Sold / Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: EMPLOYEES ROSTER */}
        {activeTab === 'employees' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {employees.map((emp) => (
              <div key={emp.id} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={emp.profileImage}
                    alt={emp.name}
                    className="w-12 h-12 rounded-xl object-cover border border-zinc-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{emp.name}</h4>
                    <span className="text-xs text-rose-600 font-semibold">{emp.position}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-zinc-500 pt-2 border-t border-zinc-100">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{emp.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{emp.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD / EDIT VEHICLE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200">
            <div className="px-6 py-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
              <h3 className="text-base font-bold">
                {editingVehicle ? 'Edit Vehicle Listing' : 'Publish New Vehicle Listing'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-zinc-800"
                    placeholder="e.g. Toyota"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-zinc-800"
                    placeholder="e.g. Vios"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Year</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-zinc-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Variant</label>
                  <input
                    type="text"
                    value={formData.variant}
                    onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-zinc-800"
                    placeholder="e.g. 1.3 XLE Dual VVT-i"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-zinc-800"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="van">Van</option>
                    <option value="pickup">Pickup</option>
                    <option value="mpv">MPV</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="coupe">Coupe</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Price (₱)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-zinc-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Mileage (km)</label>
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-zinc-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Transmission</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-zinc-800"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-zinc-800"
                  >
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-zinc-800 font-bold"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RESERVED">RESERVED</option>
                    <option value="SOLD">SOLD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Main Image URL</label>
                <input
                  type="url"
                  value={formData.images[0] || ''}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-zinc-800"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-zinc-800"
                  placeholder="Vehicle history, condition, maintenance details..."
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center space-x-1.5 shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish Vehicle</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
