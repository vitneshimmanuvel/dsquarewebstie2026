import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { MaterialOrder, WorkerLog, Transaction, Vendor } from './types';
import { useAuth, API_BASE } from './AuthContext';

interface DataContextType {
  materials: MaterialOrder[];
  addMaterial: (item: any) => Promise<boolean>;
  updateMaterial: (id: string, updates: Partial<MaterialOrder>) => Promise<boolean>;
  deleteMaterial: (id: string) => Promise<boolean>;

  workerLogs: WorkerLog[];
  addWorkerLog: (log: any) => Promise<boolean>;
  updateWorkerLog: (id: string, updates: Partial<WorkerLog>) => Promise<boolean>;
  deleteWorkerLog: (id: string) => Promise<boolean>;

  transactions: Transaction[];
  addTransaction: (t: any) => Promise<boolean>;

  vendors: Vendor[];
  addVendor: (v: any) => Promise<boolean>;
  deleteVendor: (id: string) => Promise<boolean>;
  refreshAllData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [materials, setMaterials] = useState<MaterialOrder[]>([]);
  const [workerLogs, setWorkerLogs] = useState<WorkerLog[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const { user, token } = useAuth();

  const refreshAllData = async () => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) {
      setMaterials([]);
      setWorkerLogs([]);
      setTransactions([]);
      setVendors([]);
      return;
    }

    try {
      // 1. Fetch Materials
      const materialsRes = await fetch(`${API_BASE}/materials`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const materialsData = await materialsRes.json();
      if (materialsData.success && materialsData.data) {
        const mappedMaterials: MaterialOrder[] = materialsData.data.map((m: any) => {
          let status: any = 'Pending';
          if (m.status === 'DELIVERED') status = 'Delivered';
          else if (m.status === 'SHIPPED' || m.status === 'ORDERED') status = 'Dispatched';

          return {
            id: m.id,
            item: m.item,
            supplier: m.vendor?.name || m.supplier || 'Unknown Supplier',
            quantity: m.quantity || 0,
            unit: m.unit || 'Units',
            status,
            date: m.orderDate ? new Date(m.orderDate).toISOString().split('T')[0] : '',
            cost: m.totalCost || 0
          };
        });
        setMaterials(mappedMaterials);
      }

      // 2. Fetch Workforce logs
      const workforceRes = await fetch(`${API_BASE}/workforce`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const workforceData = await workforceRes.json();
      if (workforceData.success && workforceData.data) {
        const mappedLogs: WorkerLog[] = workforceData.data.map((w: any) => {
          let shift: any = 'Morning';
          if (w.shift === 'NIGHT') shift = 'Evening';
          
          let status: any = 'Pending';
          if (w.status === 'PAID') status = 'Paid';

          return {
            id: w.id,
            category: w.category,
            count: w.count || 0,
            shift,
            date: w.date ? new Date(w.date).toISOString().split('T')[0] : '',
            totalWage: w.totalWage || 0,
            status
          };
        });
        setWorkerLogs(mappedLogs);
      }

      // 3. Fetch Transactions
      const transRes = await fetch(`${API_BASE}/transactions`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const transData = await transRes.json();
      if (transData.success && transData.data) {
        const mappedTrans: Transaction[] = transData.data.map((t: any) => ({
          id: t.id,
          description: t.description,
          amount: t.amount || 0,
          type: t.type === 'CREDIT' ? 'Credit' : 'Debit',
          date: t.date ? new Date(t.date).toISOString().split('T')[0] : '',
          status: t.status === 'COMPLETED' ? 'Completed' : 'Pending'
        }));
        setTransactions(mappedTrans);
      }

      // 4. Fetch Vendors
      const vendorsRes = await fetch(`${API_BASE}/vendors`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const vendorsData = await vendorsRes.json();
      if (vendorsData.success && vendorsData.data) {
        setVendors(vendorsData.data);
      }

    } catch (err) {
      console.error('Error refreshing backend data:', err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [user, token]);

  // Materials
  const addMaterial = async (itemData: any) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return false;
    try {
      const selectedVendorObj = vendors.find(v => v.name === itemData.supplier);
      
      const payload = {
        item: itemData.item,
        supplier: itemData.supplier,
        quantity: itemData.quantity,
        unit: itemData.unit,
        unitPrice: itemData.cost / (itemData.quantity || 1),
        vendorId: selectedVendorObj?.id || null,
        expectedDelivery: new Date(itemData.date),
        notes: `Ordered from D Square Web Panel`
      };

      const res = await fetch(`${API_BASE}/materials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding material:', err);
      return false;
    }
  };

  const updateMaterial = async (id: string, updates: Partial<MaterialOrder>) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return false;
    try {
      // Map status
      let backendStatus = 'PENDING';
      if (updates.status === 'Delivered') backendStatus = 'DELIVERED';
      else if (updates.status === 'Dispatched') backendStatus = 'SHIPPED';

      // We can use the delivery endpoint if status is delivered
      let url = `${API_BASE}/materials/${id}`;
      let method = 'PUT';
      let body: any = { ...updates };

      if (updates.status === 'Delivered') {
        url = `${API_BASE}/materials/${id}/deliver`;
        body = {
          receivedQuantity: updates.quantity,
          qualityCheck: true,
          qualityNotes: 'Verified via Web Portal'
        };
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating material:', err);
      return false;
    }
  };

  const deleteMaterial = async (id: string) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return false;
    try {
      const res = await fetch(`${API_BASE}/materials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const data = await res.json();
      if (data.success) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting material:', err);
      return false;
    }
  };

  // Workforce
  const addWorkerLog = async (logData: any) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return false;
    try {
      // Map shift
      const backendShift = logData.shift === 'Evening' ? 'NIGHT' : 'DAY';
      
      const payload = {
        category: logData.category,
        count: logData.count,
        shift: backendShift,
        date: new Date(logData.date),
        hoursWorked: 8,
        ratePerWorker: logData.totalWage / (logData.count || 1),
        notes: 'Logged via Web Portal'
      };

      const res = await fetch(`${API_BASE}/workforce`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding worker log:', err);
      return false;
    }
  };

  const updateWorkerLog = async (id: string, updates: Partial<WorkerLog>) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return false;
    try {
      // If verifying
      let url = `${API_BASE}/workforce/${id}`;
      let body: any = { ...updates };
      
      if (updates.status === 'Paid') {
        url = `${API_BASE}/workforce/${id}/verify`;
        body = {};
      }

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating worker log:', err);
      return false;
    }
  };

  const deleteWorkerLog = async (id: string) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return false;
    try {
      const res = await fetch(`${API_BASE}/workforce/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const data = await res.json();
      if (data.success) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting worker log:', err);
      return false;
    }
  };

  // Transactions
  const addTransaction = async (tData: any) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return false;
    try {
      const payload = {
        description: tData.description,
        amount: tData.amount,
        type: tData.type === 'Credit' ? 'CREDIT' : 'DEBIT',
        date: new Date(tData.date),
        status: tData.status === 'Completed' ? 'COMPLETED' : 'PENDING'
      };

      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding transaction:', err);
      return false;
    }
  };

  // Vendors
  const addVendor = async (vData: any) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return false;
    try {
      const res = await fetch(`${API_BASE}/vendors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(vData)
      });
      const data = await res.json();
      if (data.success) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding vendor:', err);
      return false;
    }
  };

  const deleteVendor = async (id: string) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return false;
    try {
      const res = await fetch(`${API_BASE}/vendors/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const data = await res.json();
      if (data.success) {
        await refreshAllData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deactivating vendor:', err);
      return false;
    }
  };

  return (
    <DataContext.Provider value={{
      materials, addMaterial, updateMaterial, deleteMaterial,
      workerLogs, addWorkerLog, updateWorkerLog, deleteWorkerLog,
      transactions, addTransaction,
      vendors, addVendor, deleteVendor,
      refreshAllData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
