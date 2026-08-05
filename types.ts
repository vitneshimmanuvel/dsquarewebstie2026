
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  CUSTOMER = 'CUSTOMER'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  description?: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: 'PDF' | 'DWG' | 'IMG' | 'XLS';
  date: string;
  size: string;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  stage: string;
}

export interface BudgetItem {
  id: string;
  category: 'Materials' | 'Labor' | 'Equipment' | 'Overhead';
  description: string;
  amount: number;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  location: string;
  status: 'Planning' | 'Foundation' | 'Structure' | 'Finishing' | 'Completed';
  progress: number; // 0-100
  startDate: string;
  deadline: string;
  budget: number;
  budgetPlan?: BudgetItem[]; // Optional detail breakdown
  spent: number;
  thumbnail: string;
  description: string;
  milestones: Milestone[];
  documents: ProjectDocument[];
  invoices: Invoice[];
  gallery: string[];
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  rating: number; // 1-5
  specialty: string; // e.g. 'Cement', 'Steel', 'General'
  location: string;
}

export interface MaterialOrder {
  id: string;
  item: string;
  supplier: string;
  quantity: number;
  unit: string;
  status: 'Pending' | 'Dispatched' | 'Delivered';
  date: string;
  cost: number;
}

export interface WorkerLog {
  id: string;
  category: 'Mason' | 'Helper' | 'Electrician' | 'Plumber' | 'Carpenter' | 'Manager';
  count: number;
  shift: 'Morning' | 'Evening' | 'Night';
  date: string;
  totalWage: number;
  status: 'Pending' | 'Paid';
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'Credit' | 'Debit';
  date: string;
  status: 'Pending' | 'Completed';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
}

export interface CustomerStep {
  id: string;
  customerId: string;
  title: string;
  description?: string;
  projectId?: string;
  stage?: string;
  fieldType: string; // TEXT, NUMBER, FILE, DATE, DROPDOWN, NOTIFICATION, IMAGE
  dropdownOptions: string[];
  isRequired: boolean;
  sortOrder: number;
  responseText?: string;
  responseFile?: string;
  responseDate?: string;
  requiresAcknowledgment: boolean;
  customerAcknowledged: boolean;
  customerAcknowledgedAt?: string;
  adminAcknowledged: boolean;
  adminAcknowledgedAt?: string;
  notificationSent: boolean;
  notificationMessage?: string;
  status: string; // PENDING, IN_PROGRESS, COMPLETED
  createdAt: string;
  updatedAt: string;
}
