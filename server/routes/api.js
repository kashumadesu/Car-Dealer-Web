const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDbData, saveDbData } = require('../config/db');
const { handleAiQuery } = require('../controllers/aiController');

// -------------------------------------------------------------
// VEHICLES ENDPOINTS
// -------------------------------------------------------------

// Get all vehicles with optional query filtering
router.get('/vehicles', (req, res) => {
  const { category, brand, minPrice, maxPrice, minYear, maxYear, transmission, fuelType, status, search } = req.query;
  const db = getDbData();
  let list = db.vehicles || [];

  if (status && status !== 'ALL') {
    list = list.filter(v => v.status === status);
  }

  if (category && category !== 'all') {
    list = list.filter(v => v.categoryId.toLowerCase() === category.toLowerCase());
  }

  if (brand && brand !== 'all') {
    list = list.filter(v => v.brand.toLowerCase() === brand.toLowerCase());
  }

  if (transmission && transmission !== 'all') {
    list = list.filter(v => v.transmission.toLowerCase() === transmission.toLowerCase());
  }

  if (fuelType && fuelType !== 'all') {
    list = list.filter(v => v.fuelType.toLowerCase() === fuelType.toLowerCase());
  }

  if (minPrice) {
    list = list.filter(v => v.price >= Number(minPrice));
  }

  if (maxPrice) {
    list = list.filter(v => v.price <= Number(maxPrice));
  }

  if (minYear) {
    list = list.filter(v => v.year >= Number(minYear));
  }

  if (maxYear) {
    list = list.filter(v => v.year <= Number(maxYear));
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(v => 
      v.brand.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.variant.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

// Get single vehicle by ID
router.get('/vehicles/:id', (req, res) => {
  const db = getDbData();
  const car = (db.vehicles || []).find(v => v.id === req.params.id);
  if (!car) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  res.json(car);
});

// Create new vehicle listing (Admin)
router.post('/vehicles', (req, res) => {
  const db = getDbData();
  const newVehicle = {
    id: `veh-${Date.now()}`,
    brand: req.body.brand || '',
    model: req.body.model || '',
    variant: req.body.variant || '',
    year: Number(req.body.year) || new Date().getFullYear(),
    categoryId: req.body.categoryId || 'sedan',
    price: Number(req.body.price) || 0,
    previousPrice: req.body.previousPrice ? Number(req.body.previousPrice) : null,
    mileage: Number(req.body.mileage) || 0,
    transmission: req.body.transmission || 'Automatic',
    fuelType: req.body.fuelType || 'Gasoline',
    engine: req.body.engine || '',
    color: req.body.color || '',
    colorCode: req.body.colorCode || '#E11D48',
    condition: req.body.condition || 'Certified Pre-Owned',
    registrationStatus: req.body.registrationStatus || 'Updated',
    status: req.body.status || 'AVAILABLE',
    isFeatured: Boolean(req.body.isFeatured),
    isNewArrival: Boolean(req.body.isNewArrival),
    images: Array.isArray(req.body.images) && req.body.images.length > 0 ? req.body.images : [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    description: req.body.description || '',
    features: Array.isArray(req.body.features) ? req.body.features : []
  };

  db.vehicles.unshift(newVehicle);
  saveDbData(db);
  res.status(201).json(newVehicle);
});

// Update vehicle (Admin)
router.put('/vehicles/:id', (req, res) => {
  const db = getDbData();
  const index = (db.vehicles || []).findIndex(v => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  const updated = {
    ...db.vehicles[index],
    ...req.body,
    id: req.params.id,
    price: req.body.price ? Number(req.body.price) : db.vehicles[index].price,
    mileage: req.body.mileage ? Number(req.body.mileage) : db.vehicles[index].mileage,
    year: req.body.year ? Number(req.body.year) : db.vehicles[index].year
  };

  db.vehicles[index] = updated;
  saveDbData(db);
  res.json(updated);
});

// Patch vehicle status (AVAILABLE, RESERVED, SOLD)
router.patch('/vehicles/:id/status', (req, res) => {
  const { status } = req.body;
  const db = getDbData();
  const car = (db.vehicles || []).find(v => v.id === req.params.id);
  if (!car) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  car.status = status;
  saveDbData(db);
  res.json(car);
});

// Delete vehicle listing (Admin)
router.delete('/vehicles/:id', (req, res) => {
  const db = getDbData();
  const initialLength = db.vehicles.length;
  db.vehicles = db.vehicles.filter(v => v.id !== req.params.id);
  if (db.vehicles.length === initialLength) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  saveDbData(db);
  res.json({ success: true, message: 'Vehicle deleted' });
});

// -------------------------------------------------------------
// CATEGORIES ENDPOINTS
// -------------------------------------------------------------
router.get('/categories', (req, res) => {
  const db = getDbData();
  const categories = (db.categories || []).map(cat => {
    const count = (db.vehicles || []).filter(v => v.categoryId.toLowerCase() === cat.id.toLowerCase() && v.status === 'AVAILABLE').length;
    return { ...cat, count };
  });
  res.json(categories);
});

// -------------------------------------------------------------
// EMPLOYEES / TEAM ENDPOINTS
// -------------------------------------------------------------
router.get('/employees', (req, res) => {
  const db = getDbData();
  res.json(db.employees || []);
});

router.post('/employees', (req, res) => {
  const db = getDbData();
  const newEmp = {
    id: `emp-${Date.now()}`,
    name: req.body.name,
    position: req.body.position,
    phone: req.body.phone,
    email: req.body.email,
    facebookUrl: req.body.facebookUrl || 'https://facebook.com/drivehub',
    profileImage: req.body.profileImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    bio: req.body.bio || '',
    status: 'Active',
    isOnline: true
  };
  db.employees = db.employees || [];
  db.employees.push(newEmp);
  saveDbData(db);
  res.status(201).json(newEmp);
});

router.put('/employees/:id', (req, res) => {
  const db = getDbData();
  const index = (db.employees || []).findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  db.employees[index] = { ...db.employees[index], ...req.body, id: req.params.id };
  saveDbData(db);
  res.json(db.employees[index]);
});

router.delete('/employees/:id', (req, res) => {
  const db = getDbData();
  db.employees = (db.employees || []).filter(e => e.id !== req.params.id);
  saveDbData(db);
  res.json({ success: true });
});

// -------------------------------------------------------------
// LEADS / CRM ENDPOINTS
// -------------------------------------------------------------
router.get('/leads', (req, res) => {
  const db = getDbData();
  res.json(db.leads || []);
});

router.post('/leads', (req, res) => {
  const db = getDbData();
  const newLead = {
    id: `lead-${Date.now()}`,
    customerName: req.body.customerName || 'Interested Buyer',
    phone: req.body.phone || '',
    email: req.body.email || '',
    vehicleTitle: req.body.vehicleTitle || 'General Inquiry',
    vehiclePrice: req.body.vehiclePrice || '',
    assignedTo: req.body.assignedTo || 'John Reyes',
    stage: req.body.stage || 'New Inquiry',
    notes: req.body.notes || '',
    createdAt: new Date().toISOString()
  };
  db.leads = db.leads || [];
  db.leads.unshift(newLead);
  saveDbData(db);
  res.status(201).json(newLead);
});

router.patch('/leads/:id/stage', (req, res) => {
  const db = getDbData();
  const lead = (db.leads || []).find(l => l.id === req.params.id);
  if (!lead) {
    return res.status(404).json({ error: 'Lead not found' });
  }
  lead.stage = req.body.stage;
  saveDbData(db);
  res.json(lead);
});

// -------------------------------------------------------------
// CHAT CONVERSATIONS ENDPOINTS
// -------------------------------------------------------------
router.get('/conversations', (req, res) => {
  const db = getDbData();
  res.json(db.conversations || []);
});

router.get('/conversations/:id', (req, res) => {
  const db = getDbData();
  const conv = (db.conversations || []).find(c => c.id === req.params.id);
  if (!conv) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  res.json(conv);
});

// Create or get conversation for a customer & vehicle
router.post('/conversations', (req, res) => {
  const { customerName, customerPhone, vehicleId, initialMessage } = req.body;
  const db = getDbData();
  db.conversations = db.conversations || [];

  // Check if active conversation exists for this customer & vehicle
  let conv = db.conversations.find(c => c.customerName === customerName && c.vehicleId === vehicleId);

  if (!conv) {
    conv = {
      id: `conv-${Date.now()}`,
      customerId: `cust-${Date.now()}`,
      customerName: customerName || 'Customer',
      customerPhone: customerPhone || '',
      vehicleId: vehicleId || null,
      employeeId: 'emp-1',
      status: 'In Progress',
      lastMessage: initialMessage || 'Started a conversation',
      updatedAt: new Date().toISOString(),
      messages: []
    };

    if (initialMessage) {
      conv.messages.push({
        id: `msg-${Date.now()}`,
        senderId: conv.customerId,
        senderName: conv.customerName,
        isStaff: false,
        text: initialMessage,
        createdAt: new Date().toISOString()
      });
    }

    db.conversations.unshift(conv);

    // Auto-create lead in CRM
    const targetCar = (db.vehicles || []).find(v => v.id === vehicleId);
    db.leads = db.leads || [];
    db.leads.unshift({
      id: `lead-${Date.now()}`,
      customerName: conv.customerName,
      phone: conv.customerPhone,
      email: '',
      vehicleTitle: targetCar ? `${targetCar.year} ${targetCar.brand} ${targetCar.model}` : 'Showroom Inquiry',
      vehiclePrice: targetCar ? `₱${targetCar.price.toLocaleString()}` : '',
      assignedTo: 'John Reyes',
      stage: 'New Inquiry',
      notes: `Initiated live chat: "${initialMessage || 'Vehicle inquiry'}"`,
      createdAt: new Date().toISOString()
    });

    saveDbData(db);
  }

  res.status(201).json(conv);
});

// Send message to conversation
router.post('/conversations/:id/messages', (req, res) => {
  const { senderId, senderName, isStaff, text } = req.body;
  const db = getDbData();
  const conv = (db.conversations || []).find(c => c.id === req.params.id);
  if (!conv) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  const newMsg = {
    id: `msg-${Date.now()}`,
    senderId: senderId || (isStaff ? 'emp-1' : conv.customerId),
    senderName: senderName || (isStaff ? 'Sales Agent' : conv.customerName),
    isStaff: Boolean(isStaff),
    text: text,
    createdAt: new Date().toISOString()
  };

  conv.messages.push(newMsg);
  conv.lastMessage = text;
  conv.updatedAt = new Date().toISOString();
  saveDbData(db);

  res.status(201).json(newMsg);
});

// -------------------------------------------------------------
// AI ASSISTANT ENDPOINT
// -------------------------------------------------------------
router.post('/ai/chat', handleAiQuery);

// -------------------------------------------------------------
// ADMIN STATS OVERVIEW
// -------------------------------------------------------------
router.get('/admin/stats', (req, res) => {
  const db = getDbData();
  const vehicles = db.vehicles || [];
  const leads = db.leads || [];
  const convs = db.conversations || [];

  const stats = {
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter(v => v.status === 'AVAILABLE').length,
    reservedVehicles: vehicles.filter(v => v.status === 'RESERVED').length,
    soldVehicles: vehicles.filter(v => v.status === 'SOLD').length,
    totalInquiries: leads.length,
    activeChats: convs.length,
    totalInventoryValue: vehicles.filter(v => v.status === 'AVAILABLE').reduce((sum, v) => sum + (v.price || 0), 0)
  };

  res.json(stats);
});

module.exports = router;
