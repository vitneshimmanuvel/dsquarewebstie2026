
import React, { useState } from 'react';
import { useData } from '../DataContext';
import { useAuth } from '../AuthContext';
import { MaterialOrder, Vendor } from '../types';
import { Filter, Plus, Search, Truck, X, Save, Trash2, Edit2, Building2, Star, Phone, Mail, MapPin } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

const MaterialManager: React.FC = () => {
  const { materials, addMaterial, updateMaterial, deleteMaterial, vendors, addVendor, deleteVendor } = useData();
  const { isSuperAdmin, isAdmin } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'vendors'>('orders');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({ name: '', contactPerson: '', phone: '', email: '', specialty: 'General', rating: 0, location: '' });
  
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<MaterialOrder>>({
    item: '', supplier: '', quantity: 0, unit: 'Units', cost: 0, status: 'Pending', date: new Date().toISOString().split('T')[0]
  });

  const getVendorSuggestions = (itemName: string) => {
    if (!itemName) return [];
    const keywords = itemName.toLowerCase().split(' ');
    return vendors.filter(v => 
      keywords.some(k => v.specialty.toLowerCase().includes(k) || v.name.toLowerCase().includes(k)) ||
      (v.specialty === 'General' && keywords.length > 0)
    );
  };

  const suggestions = getVendorSuggestions(formData.item || '');
  const selectedVendor = vendors.find(v => v.name === formData.supplier);

  const handleEditClick = (order: MaterialOrder) => {
    setEditingId(order.id);
    setFormData(order);
    setIsModalOpen(true);
  };

  const handleNewClick = () => {
    setEditingId(null);
    setFormData({
      item: '', supplier: '', quantity: 0, unit: 'Units', cost: 0, status: 'Pending', date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (formData.item && formData.supplier) {
      if (editingId) {
        updateMaterial(editingId, formData);
      } else {
        const order: MaterialOrder = {
          id: `m${Date.now()}`,
          item: formData.item!,
          supplier: formData.supplier!,
          quantity: formData.quantity || 0,
          unit: formData.unit || 'Units',
          cost: formData.cost || 0,
          status: formData.status as any || 'Pending',
          date: formData.date || new Date().toISOString().split('T')[0]
        };
        addMaterial(order);
      }
      setIsModalOpen(false);
    }
  };

  const handleSaveVendor = () => {
    if (newVendor.name && newVendor.contactPerson) {
      const vendor: Vendor = {
        id: `v${Date.now()}`,
        name: newVendor.name!,
        contactPerson: newVendor.contactPerson!,
        phone: newVendor.phone || '',
        email: newVendor.email || '',
        rating: newVendor.rating || 0,
        specialty: newVendor.specialty || 'General',
        location: newVendor.location || ''
      };
      addVendor(vendor);
      setIsVendorModalOpen(false);
      setNewVendor({ name: '', contactPerson: '', phone: '', email: '', specialty: 'General', rating: 0, location: '' });
    }
  };

  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      deleteMaterial(orderToDelete);
      setOrderToDelete(null);
    }
  };

  const confirmDeleteVendor = () => {
    if (vendorToDelete) {
      deleteVendor(vendorToDelete);
      setVendorToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <ConfirmationModal 
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={confirmDeleteOrder}
        title="Delete Order"
        message="Are you sure you want to delete this material order?"
        confirmText="Delete"
        isDestructive={true}
      />

      <ConfirmationModal 
        isOpen={!!vendorToDelete}
        onClose={() => setVendorToDelete(null)}
        onConfirm={confirmDeleteVendor}
        title="Delete Vendor"
        message="Are you sure you want to remove this vendor from the directory?"
        confirmText="Delete Vendor"
        isDestructive={true}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Material & Vendors</h2>
          <p className="text-slate-500">Manage procurement orders and supplier directory.</p>
        </div>
        
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
           <button 
             onClick={() => setActiveTab('orders')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Orders
           </button>
           <button 
             onClick={() => setActiveTab('vendors')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'vendors' ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Vendor Directory
           </button>
        </div>
      </div>

      {/* Create Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">{editingId ? 'Edit Order' : 'Create New Order'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Material Name</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none font-semibold" value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})} placeholder="e.g. Cement Bags" />
              </div>
              
              {/* Vendor Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Supplier / Vendor</label>
                <div className="relative">
                    <input 
                        type="text" 
                        list="vendor-list"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" 
                        value={formData.supplier} 
                        onChange={e => setFormData({...formData, supplier: e.target.value})} 
                        placeholder="Select or type supplier name" 
                    />
                    <datalist id="vendor-list">
                        {vendors.map(v => <option key={v.id} value={v.name}>{v.specialty} • {v.rating}★</option>)}
                    </datalist>
                </div>
                
                {suggestions.length > 0 && !selectedVendor && (
                    <div className="mt-2">
                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Suggested Vendors</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map(v => (
                                <button 
                                    key={v.id}
                                    onClick={() => setFormData({...formData, supplier: v.name})}
                                    className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs hover:bg-blue-100 transition-colors border border-blue-100"
                                >
                                    {v.name} <span className="text-amber-500 font-bold">★{v.rating}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {selectedVendor ? (
                    <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2">
                           <h4 className="text-sm font-bold text-brand-900 flex items-center gap-2">
                             <Building2 size={14} /> {selectedVendor.name}
                           </h4>
                           <span className="text-xs font-medium px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full flex items-center gap-1">
                              <Star size={10} fill="currentColor" /> {selectedVendor.rating}
                           </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                             <div>
                                <span className="block text-[10px] text-slate-400 uppercase font-bold">Contact Person</span>
                                <span className="text-slate-700 font-medium">{selectedVendor.contactPerson}</span>
                             </div>
                             <div>
                                <span className="block text-[10px] text-slate-400 uppercase font-bold">Phone</span>
                                <span className="text-slate-700 font-medium">{selectedVendor.phone}</span>
                             </div>
                             <div className="col-span-2">
                                <span className="block text-[10px] text-slate-400 uppercase font-bold">Email</span>
                                <span className="text-slate-700 font-medium">{selectedVendor.email}</span>
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-400 text-xs italic">
                        Select a vendor to view details.
                    </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
                  <input type="number" className="w-full p-3 border border-slate-200 rounded-lg" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unit</label>
                  <input type="text" className="w-full p-3 border border-slate-200 rounded-lg" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="kg/tons/bags" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Est. Cost</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <input type="number" className="w-full pl-6 p-3 border border-slate-200 rounded-lg" value={formData.cost} onChange={e => setFormData({...formData, cost: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                  <select className="w-full p-3 border border-slate-200 rounded-lg" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                    <option value="Pending">Pending</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-800 flex items-center gap-2">
                <Save size={18} /> {editingId ? 'Update Order' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-lg text-slate-800">Add New Vendor</h3>
               <button onClick={() => setIsVendorModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
             </div>
             <div className="p-6 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company Name</label>
                    <input type="text" className="w-full p-2 border rounded-lg" value={newVendor.name} onChange={e => setNewVendor({...newVendor, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specialty</label>
                    <select className="w-full p-2 border rounded-lg" value={newVendor.specialty} onChange={e => setNewVendor({...newVendor, specialty: e.target.value})}>
                        <option>General</option>
                        <option>Cement</option>
                        <option>Steel</option>
                        <option>Sand</option>
                        <option>Wood</option>
                        <option>Electrical</option>
                        <option>Plumbing</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Person</label>
                        <input type="text" className="w-full p-2 border rounded-lg" value={newVendor.contactPerson} onChange={e => setNewVendor({...newVendor, contactPerson: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rating (1-5)</label>
                        <input type="number" max="5" min="1" step="0.1" className="w-full p-2 border rounded-lg" value={newVendor.rating} onChange={e => setNewVendor({...newVendor, rating: parseFloat(e.target.value)})} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                        <input type="text" className="w-full p-2 border rounded-lg" value={newVendor.phone} onChange={e => setNewVendor({...newVendor, phone: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                        <input type="email" className="w-full p-2 border rounded-lg" value={newVendor.email} onChange={e => setNewVendor({...newVendor, email: e.target.value})} />
                    </div>
                </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                    <input type="text" className="w-full p-2 border rounded-lg" value={newVendor.location} onChange={e => setNewVendor({...newVendor, location: e.target.value})} />
                </div>
             </div>
             <div className="p-6 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
                <button onClick={() => setIsVendorModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">Cancel</button>
                <button onClick={handleSaveVendor} className="px-4 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-800 flex items-center gap-2">
                    <Save size={18} /> Add Vendor
                </button>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white/10 p-2 rounded-lg"><Truck size={24} /></div>
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">This Month</span>
              </div>
              <p className="text-slate-400 text-sm">Total Orders</p>
              <h3 className="text-3xl font-bold">{materials.length}</h3>
            </div>
             <div className="bg-white border border-slate-200 p-6 rounded-2xl">
               <p className="text-slate-500 text-sm mb-1">Pending Deliveries</p>
               <h3 className="text-3xl font-bold text-slate-800">{materials.filter(o => o.status === 'Pending').length}</h3>
               <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-brand-accent h-full w-3/4"></div>
               </div>
             </div>
             <div className="bg-white border border-slate-200 p-6 rounded-2xl">
               <p className="text-slate-500 text-sm mb-1">Total Cost</p>
               <h3 className="text-3xl font-bold text-slate-800">₹{(materials.reduce((sum, o) => sum + o.cost, 0) / 1000).toFixed(1)}k</h3>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex gap-3 w-full md:w-auto items-center">
                 <div className="relative flex-1 md:w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input 
                       type="text" 
                       placeholder="Search orders..." 
                       className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
                     />
                 </div>
                 {isAdmin && (
                     <button 
                       onClick={handleNewClick}
                       className="bg-brand-accent text-brand-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium flex items-center gap-2 whitespace-nowrap text-sm"
                     >
                       <Plus size={18} /> New Order
                     </button>
                 )}
              </div>
              <button className="text-slate-500 hover:text-brand-primary flex items-center gap-1 text-sm font-medium">
                <Filter size={16} /> Filter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100 bg-slate-50">
                    <th className="p-4 font-medium">Item Name</th>
                    <th className="p-4 font-medium">Supplier</th>
                    <th className="p-4 font-medium">Quantity</th>
                    <th className="p-4 font-medium">Order Date</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Cost</th>
                    {isAdmin && <th className="p-4 font-medium text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {materials.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4 font-semibold text-slate-800">{order.item}</td>
                      <td className="p-4 text-slate-600">{order.supplier}</td>
                      <td className="p-4 text-slate-800 font-medium">{order.quantity} <span className="text-slate-400 text-xs font-normal">{order.unit}</span></td>
                      <td className="p-4 text-slate-500 text-sm">{order.date}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5
                          ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                            order.status === 'Dispatched' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}
                        `}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                             order.status === 'Delivered' ? 'bg-green-500' : 
                             order.status === 'Dispatched' ? 'bg-blue-500' : 'bg-amber-500'
                          }`}></span>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium text-slate-800">₹{order.cost.toLocaleString()}</td>
                      {isAdmin && (
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                               onClick={() => handleEditClick(order)}
                               className="p-1.5 text-slate-400 hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors"
                               title="Edit Order"
                             >
                               <Edit2 size={16} />
                             </button>
                             {isSuperAdmin && (
                               <button 
                                 onClick={() => setOrderToDelete(order.id)}
                                 className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                 title="Delete Order"
                               >
                                 <Trash2 size={16} />
                               </button>
                             )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        // Vendor Directory Tab
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search vendors by name or specialty..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50" />
                </div>
                {isAdmin && (
                    <button 
                        onClick={() => setIsVendorModalOpen(true)}
                        className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-800 transition-colors font-medium flex items-center gap-2"
                    >
                        <Plus size={18} /> Add Vendor
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map(vendor => (
                    <div key={vendor.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center border border-brand-primary/10">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{vendor.name}</h3>
                                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{vendor.specialty}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                                    <Star size={14} fill="currentColor" /> {vendor.rating}
                                </span>
                                {isAdmin && (
                                    <button onClick={() => setVendorToDelete(vendor.id)} className="mt-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-3 text-sm text-slate-600">
                            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                                <Phone size={16} className="text-slate-400" />
                                <span>{vendor.phone} <span className="text-xs text-slate-400">({vendor.contactPerson})</span></span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                                <Mail size={16} className="text-slate-400" />
                                <span className="truncate">{vendor.email}</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                                <MapPin size={16} className="text-slate-400" />
                                <span>{vendor.location}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default MaterialManager;
