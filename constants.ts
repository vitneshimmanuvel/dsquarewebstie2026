
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


export interface MaterialOptionGroup {
  id: string;
  name: string;
  category: 'Structural & Masonry' | 'Electrical & Plumbing' | 'Finishes & Sanitary' | 'Doors & Windows';
  icon: string;
  description: string;
  options: string[];
  defaultOption: string;
  tip?: string;
}

export const MATERIAL_SPECS: MaterialOptionGroup[] = [
  // 1. Cement
  {
    id: 'cement',
    name: 'Cement',
    category: 'Structural & Masonry',
    icon: '🏗️',
    description: 'Foundation, RCC pillars, slab casting & plastering',
    options: ['Ultratech', 'Ramco', 'Dalmia', 'Chettinad', 'Acc', 'Maha', 'Priya', 'Zuari', 'Jsw'],
    defaultOption: 'Ultratech',
    tip: 'Grade 53 OPC for RCC columns & Grade 43 PPC for masonry plastering'
  },
  // 2. Sand
  {
    id: 'sand',
    name: 'Sand',
    category: 'Structural & Masonry',
    icon: '⏳',
    description: 'Fine aggregate for casting & brick plastering',
    options: ['River sand', 'Standard M-sand & P-sand', 'Double washed(VSI) M-Sand & P-Sand'],
    defaultOption: 'Double washed(VSI) M-Sand & P-Sand',
    tip: 'VSI double-washed sand offers the highest concrete compressive strength'
  },
  // 3. Blue metals:(Aggregate)
  {
    id: 'blueMetals',
    name: 'Blue metals (Aggregate)',
    category: 'Structural & Masonry',
    icon: '🪨',
    description: 'Coarse aggregate 20mm & 40mm for high-tensile concrete',
    options: ['Standard', 'Finest quality(VSI)'],
    defaultOption: 'Finest quality(VSI)',
    tip: 'VSI cubical shaped aggregate ensures zero air pockets during concrete vibration'
  },
  // 4. TMT rebars
  {
    id: 'tmtRebars',
    name: 'TMT rebars',
    category: 'Structural & Masonry',
    icon: '🔩',
    description: 'Reinforcement thermo-mechanically treated steel rods',
    options: ['Tata', 'jsw', 'vizag', 'jindal panther', 'SSI', 'Shyam', 'pulkit', 'prime gold', 'Agni', 'ARS'],
    defaultOption: 'Tata',
    tip: 'Fe-550D grade steel with earthquake resistance and corrosion resistance'
  },
  // 5. Bricks
  {
    id: 'bricks',
    name: 'Bricks & Masonry Blocks',
    category: 'Structural & Masonry',
    icon: '🧱',
    description: 'Outer load-bearing & inner partition wall masonry',
    options: ['1st class chamber brick', 'Wirecut brick', 'Flyash brick', 'Solid block', 'porotherm block', 'AAC block', 'Interlock block'],
    defaultOption: '1st class chamber brick',
    tip: 'Chamber bricks and Porotherm clay hollow blocks offer natural thermal insulation'
  },
  // 6. Electrical Wires/Pipes
  {
    id: 'electricalWires',
    name: 'Electrical Wires & Conduits',
    category: 'Electrical & Plumbing',
    icon: '⚡',
    description: 'Internal concealed wiring & fire-resistant conduits',
    options: ['RR kabel', 'Finolex', 'Kundan', 'Havells', 'V-guard', 'EFAB', 'R Miller', 'Polycab', 'KEI', 'Anchor'],
    defaultOption: 'Finolex',
    tip: 'FRLS (Flame Retardant Low Smoke) 100% pure electrolytic grade copper'
  },
  // 7. Electrical switches
  {
    id: 'electricalSwitches',
    name: 'Electrical Switches & Sockets',
    category: 'Electrical & Plumbing',
    icon: '🔌',
    description: 'Modular switch plates, MCBs, DBs & safety breakers',
    options: ['Legarant', 'Lish', 'GM', 'Havells', 'Schneider', 'L&T', 'Elleys', 'Norisys', 'Anchor'],
    defaultOption: 'Schneider',
    tip: 'Modular anti-microbial plates with shock-proof polycarbonate covers'
  },
  // 8. Plumping (Plumbing)
  {
    id: 'plumbing',
    name: 'Plumbing & Drainage Pipes',
    category: 'Electrical & Plumbing',
    icon: '🚰',
    description: 'Hot & cold CPVC lines, UPVC water supply & SWR drainage',
    options: ['Finolex', 'Astral', 'supreme', 'prince'],
    defaultOption: 'Astral',
    tip: 'Lead-free NSF-certified CPVC pipes tested for high water pressure'
  },
  // 9. Cp/ Sanitarywares
  {
    id: 'sanitaryware',
    name: 'CP Fittings & Sanitarywares',
    category: 'Finishes & Sanitary',
    icon: '🚿',
    description: 'Water closets, faucets, showers, wash basins & divertors',
    options: ['Kohler', 'Jaquar', 'parryware', 'Roca', 'Toto', 'Cera', 'Hindware', 'Johnson', 'RAK', 'Grohe', 'Duravit', 'American standard', 'Somany', 'Simpolo'],
    defaultOption: 'Jaquar',
    tip: 'Water-saving dual-flush ceramic closets & 10-year warranty brass taps'
  },
  // 10. Tiles
  {
    id: 'tiles',
    name: 'Flooring & Wall Tiles',
    category: 'Finishes & Sanitary',
    icon: '⬜',
    description: 'Living room vitrified tiles, anti-skid bathroom & kitchen dados',
    options: ['Simpolo', 'simero', 'Kajaria', 'KAG', 'Somany', 'Orientbell', 'Johnson', 'Nitco', 'RAK', 'Varmora', 'Qutone', 'AGL'],
    defaultOption: 'Kajaria',
    tip: 'Double-charged GVT/PGVT vitrified tiles with nano polish coating'
  },
  // 11. Maindoor
  {
    id: 'maindoor',
    name: 'Main Entrance Door',
    category: 'Doors & Windows',
    icon: '🚪',
    description: 'Solid heavy entrance door with traditional / modern carving',
    options: ['Teak', 'Sal', 'Mahogany'],
    defaultOption: 'Teak',
    tip: 'First-quality seasoned Burma/First class Teakwood frame and engraved shutter'
  },
  // 12. Window grill square rod
  {
    id: 'windowGrill',
    name: 'Window Grill Square Rod',
    category: 'Doors & Windows',
    icon: '🛡️',
    description: 'Safety grills welded into RCC lintels & window reveals',
    options: ['13mmpolished', '16mm polished'],
    defaultOption: '13mmpolished',
    tip: 'Solid MS square rods painted with anti-rust zinc phosphate primer'
  },
  // 13. Windows
  {
    id: 'windows',
    name: 'Windows & Glazing',
    category: 'Doors & Windows',
    icon: '🪟',
    description: 'Window frames, mosquito mesh shutters & soundproof glass',
    options: ['Upvc', 'Sal', 'Mahogany', 'Teak', 'Aluminium'],
    defaultOption: 'Upvc',
    tip: 'Multi-chamber German UPVC profile with 5mm toughened Saint-Gobain glass'
  },
  // 14. Bedroom doors
  {
    id: 'bedroomDoors',
    name: 'Bedroom Doors',
    category: 'Doors & Windows',
    icon: '🚪',
    description: 'Internal room doors with locks, handles & door stoppers',
    options: ['Mica(Customised design)', 'Flush door', 'Membrane door', 'Fibre door', 'Upvc'],
    defaultOption: 'Mica(Customised design)',
    tip: 'Factory-pressed waterproof core with 1mm designer matte laminate'
  },
  // 15. Bathroom doors
  {
    id: 'bathroomDoors',
    name: 'Bathroom Doors',
    category: 'Doors & Windows',
    icon: '🚿',
    description: '100% waterproof, termite-proof moisture-resistant doors',
    options: ['Pvc', 'Pvc heavy', 'Upvc', 'Fibre', 'Wpc(customised)', 'Frosted Glass'],
    defaultOption: 'Wpc(customised)',
    tip: 'High-density Wood Polymer Composite (WPC) with lifetime warranty against water'
  }
];
