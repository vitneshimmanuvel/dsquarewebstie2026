
import { Project, MaterialOrder, WorkerLog, Transaction, UserRole, User, Notification, Vendor } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Suresh Kumar', role: UserRole.SUPER_ADMIN, email: 'ceo@dsquare.com' },
  { id: 'u2', name: 'Amit Patel', role: UserRole.ADMIN, email: 'manager@dsquare.com' },
  { id: 'u3', name: 'Dr. Rajesh Gupta', role: UserRole.CLIENT, email: 'client@gmail.com' },
];

export const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: 'ABC Traders', contactPerson: 'Ramesh Verma', phone: '+91 98765 43210', email: 'sales@abctraders.com', rating: 4.5, specialty: 'Cement', location: 'Erode' },
  { id: 'v2', name: 'Tata Steel', contactPerson: 'Corporate Sales', phone: '1800-TATA-STEEL', email: 'orders@tatasteel.com', rating: 5.0, specialty: 'Steel', location: 'Mumbai' },
  { id: 'v3', name: 'Local Mines Association', contactPerson: 'K. Rao', phone: '+91 90000 11111', email: 'sand@localmines.com', rating: 3.8, specialty: 'Sand', location: 'Vijayawada' },
  { id: 'v4', name: 'Forest Depot', contactPerson: 'S. Reddy', phone: '040-23456789', email: 'info@forestdepot.in', rating: 4.2, specialty: 'Wood', location: 'Warangal' },
  { id: 'v5', name: 'BuildRight Supplies', contactPerson: 'Manager', phone: '+91 99887 76655', email: 'contact@buildright.com', rating: 4.0, specialty: 'General', location: 'Erode' }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Skyline Heights - Villa A',
    clientName: 'Dr. Rajesh Gupta',
    location: 'Solar, Erode, Tamil Nadu',
    status: 'Structure',
    progress: 45,
    startDate: '2023-11-01',
    deadline: '2024-08-15',
    budget: 8500000,
    spent: 3200000,
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-2ad4d9a44566?auto=format&fit=crop&w=600&q=80',
    description: 'Luxury G+2 Villa with Italian Marble flooring, home automation, and private pool. Currently in structural phase with slab casting scheduled.',
    milestones: [
      { id: 'm1', title: 'Site Clearance & Soil Test', date: '2023-11-05', status: 'Completed', description: 'Ground leveling and soil bearing capacity approved.' },
      { id: 'm2', title: 'Foundation Laying', date: '2023-12-20', status: 'Completed', description: 'Reinforced concrete footing completed.' },
      { id: 'm3', title: 'Ground Floor Slab', date: '2024-02-15', status: 'Completed', description: 'Curing process finished.' },
      { id: 'm4', title: 'First Floor Columns', date: '2024-03-10', status: 'In Progress', description: 'Steel binding ongoing.' },
      { id: 'm5', title: 'Brick Work', date: '2024-04-01', status: 'Pending' }
    ],
    documents: [
      { id: 'd1', name: 'Structural Drawings v2.pdf', type: 'PDF', date: '2023-10-15', size: '4.2 MB' },
      { id: 'd2', name: 'Municipal Approval.pdf', type: 'PDF', date: '2023-10-20', size: '1.5 MB' },
      { id: 'd3', name: 'Floor Plan.dwg', type: 'DWG', date: '2023-10-10', size: '12 MB' }
    ],
    invoices: [
      { id: 'inv1', number: 'INV-23-001', amount: 500000, date: '2023-11-01', status: 'Paid', stage: 'Advance' },
      { id: 'inv2', number: 'INV-23-045', amount: 1200000, date: '2024-01-15', status: 'Paid', stage: 'Foundation' },
      { id: 'inv3', number: 'INV-24-012', amount: 800000, date: '2024-03-01', status: 'Pending', stage: 'Structure L1' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1590077423761-c3b2c25179e5?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?auto=format&fit=crop&w=400&q=80'
    ]
  },
  {
    id: 'p2',
    name: 'Tech Park Renovation',
    clientName: 'Innovate Corp',
    location: 'Whitefield, Bangalore',
    status: 'Finishing',
    progress: 88,
    startDate: '2023-09-10',
    deadline: '2024-04-30',
    budget: 12000000,
    spent: 10500000,
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    description: 'Renovation of Atrium and 3 floors of commercial office space. Installing new HVAC and glass facade.',
    milestones: [
        { id: 'm1', title: 'Demolition', date: '2023-09-15', status: 'Completed' },
        { id: 'm2', title: 'HVAC Installation', date: '2023-12-10', status: 'Completed' },
        { id: 'm3', title: 'Glass Facade', date: '2024-02-01', status: 'Completed' },
        { id: 'm4', title: 'Interior Painting', date: '2024-03-01', status: 'In Progress' }
    ],
    documents: [
        { id: 'd1', name: 'Contract Agreement.pdf', type: 'PDF', date: '2023-09-01', size: '2.1 MB' },
        { id: 'd2', name: 'Material List.xls', type: 'XLS', date: '2023-09-05', size: '0.5 MB' }
    ],
    invoices: [],
    gallery: [
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'
    ]
  },
  {
    id: 'p3',
    name: 'Green Valley Farmhouse',
    clientName: 'Mrs. Sarah Jenkins',
    location: 'Coorg',
    status: 'Foundation',
    progress: 15,
    startDate: '2024-01-15',
    deadline: '2024-12-20',
    budget: 6000000,
    spent: 950000,
    thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
    description: 'Eco-friendly farmhouse using sustainable materials. Rainwater harvesting integration.',
    milestones: [
        { id: 'm1', title: 'Land Survey', date: '2024-01-20', status: 'Completed' },
        { id: 'm2', title: 'Excavation', date: '2024-02-10', status: 'In Progress' }
    ],
    documents: [],
    invoices: [],
    gallery: []
  }
];

export const MATERIAL_ORDERS: MaterialOrder[] = [
  { id: 'm1', item: 'Cement (UltraTech)', supplier: 'ABC Traders', quantity: 500, unit: 'Bags', status: 'Delivered', date: '2024-02-20', cost: 180000 },
  { id: 'm2', item: 'Steel TMT Bars 12mm', supplier: 'Tata Steel', quantity: 2500, unit: 'kg', status: 'Dispatched', date: '2024-02-22', cost: 162500 },
  { id: 'm3', item: 'River Sand', supplier: 'Local Mines Association', quantity: 5, unit: 'Trucks', status: 'Pending', date: '2024-02-24', cost: 75000 },
  { id: 'm4', item: 'Teak Wood', supplier: 'Forest Depot', quantity: 100, unit: 'cft', status: 'Delivered', date: '2024-02-10', cost: 450000 },
];

export const WORKER_LOGS: WorkerLog[] = [
  { id: 'w1', category: 'Mason', count: 12, shift: 'Morning', date: '2024-02-24', totalWage: 12000, status: 'Pending' },
  { id: 'w2', category: 'Helper', count: 20, shift: 'Morning', date: '2024-02-24', totalWage: 10000, status: 'Pending' },
  { id: 'w3', category: 'Electrician', count: 4, shift: 'Morning', date: '2024-02-24', totalWage: 6000, status: 'Pending' },
  { id: 'w4', category: 'Mason', count: 10, shift: 'Morning', date: '2024-02-23', totalWage: 10000, status: 'Paid' },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', description: 'Advance Payment - Foundation Stage', amount: 1500000, type: 'Credit', date: '2024-01-20', status: 'Completed' },
  { id: 't2', description: 'Material Payment - ABC Traders', amount: 180000, type: 'Debit', date: '2024-02-21', status: 'Completed' },
  { id: 't3', description: 'Weekly Wages', amount: 156000, type: 'Debit', date: '2024-02-23', status: 'Pending' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Material Delayed', message: 'Steel delivery delayed by 2 days due to transport strike.', date: '2h ago', read: false, type: 'alert' },
  { id: 'n2', title: 'Payment Received', message: 'Client Rajesh Gupta transferred $5000 for Phase 2.', date: '5h ago', read: false, type: 'success' },
  { id: 'n3', title: 'Site Inspection', message: 'Quality check scheduled for tomorrow at 10 AM.', date: '1d ago', read: true, type: 'info' },
];
