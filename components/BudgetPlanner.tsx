
import React, { useState, useEffect } from 'react';
import { BudgetItem } from '../types';
import { Calculator, Plus, Trash2, X, IndianRupee, PieChart } from 'lucide-react';

interface BudgetPlannerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (total: number, plan: BudgetItem[]) => void;
  initialPlan?: BudgetItem[];
}

const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ isOpen, onClose, onSave, initialPlan = [] }) => {
  const [items, setItems] = useState<BudgetItem[]>(initialPlan);
  const [activeCategory, setActiveCategory] = useState<'Materials' | 'Labor' | 'Equipment' | 'Overhead'>('Materials');
  const [newItem, setNewItem] = useState({ description: '', amount: '' });

  // Reset items when modal opens with new initialPlan
  useEffect(() => {
    if (isOpen) {
      setItems(initialPlan);
    }
  }, [isOpen, initialPlan]);

  if (!isOpen) return null;

  const categories = ['Materials', 'Labor', 'Equipment', 'Overhead'] as const;

  const handleAddItem = () => {
    if (newItem.description && newItem.amount) {
      const item: BudgetItem = {
        id: `b-${Date.now()}`,
        category: activeCategory,
        description: newItem.description,
        amount: parseFloat(newItem.amount)
      };
      setItems([...items, item]);
      setNewItem({ description: '', amount: '' });
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const calculateTotal = () => items.reduce((sum, item) => sum + item.amount, 0);
  
  const calculateCategoryTotal = (cat: string) => 
    items.filter(i => i.category === cat).reduce((sum, i) => sum + i.amount, 0);

  const totalBudget = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <div>
             <h2 className="text-xl font-bold text-brand-900 flex items-center gap-2">
               <Calculator className="text-brand-accent" size={24} /> Detailed Budget Planner
             </h2>
             <p className="text-sm text-slate-500">Itemize costs to calculate total project value.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
               <p className="text-xs font-bold text-slate-400 uppercase">Estimated Total</p>
               <p className="text-2xl font-bold text-brand-primary">₹{totalBudget.toLocaleString()}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Sidebar: Categories & Summary */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
               <PieChart size={16}/> Cost Distribution
             </h3>
             <div className="space-y-2">
               {categories.map(cat => {
                 const catTotal = calculateCategoryTotal(cat);
                 const percentage = totalBudget > 0 ? (catTotal / totalBudget) * 100 : 0;
                 return (
                   <button
                     key={cat}
                     onClick={() => setActiveCategory(cat)}
                     className={`w-full p-3 rounded-xl text-left transition-all border-2 ${
                       activeCategory === cat 
                         ? 'bg-white border-brand-primary shadow-sm' 
                         : 'bg-transparent border-transparent hover:bg-slate-100'
                     }`}
                   >
                     <div className="flex justify-between items-center mb-1">
                       <span className={`font-bold text-sm ${activeCategory === cat ? 'text-brand-primary' : 'text-slate-600'}`}>{cat}</span>
                       <span className="text-xs font-medium text-slate-500">{percentage.toFixed(0)}%</span>
                     </div>
                     <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                       <div 
                         className={`h-full rounded-full ${activeCategory === cat ? 'bg-brand-accent' : 'bg-slate-400'}`} 
                         style={{ width: `${percentage}%` }}
                       ></div>
                     </div>
                     <p className="text-xs text-slate-500 mt-1 text-right font-mono">₹{catTotal.toLocaleString()}</p>
                   </button>
                 );
               })}
             </div>
          </div>

          {/* Main: Items List */}
          <div className="flex-1 flex flex-col p-6 bg-white">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-800">{activeCategory} Breakdown</h3>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                   {items.filter(i => i.category === activeCategory).length} Items
                </span>
             </div>

             {/* Add New Input */}
             <div className="flex gap-3 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
               <input 
                 type="text" 
                 placeholder="Item Description (e.g. Concrete Mixer Rental)" 
                 className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-brand-primary"
                 value={newItem.description}
                 onChange={(e) => setNewItem({...newItem, description: e.target.value})}
               />
               <div className="relative w-32">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                 <input 
                    type="number" 
                    placeholder="Cost" 
                    className="w-full pl-6 p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-brand-primary"
                    value={newItem.amount}
                    onChange={(e) => setNewItem({...newItem, amount: e.target.value})}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                 />
               </div>
               <button 
                 onClick={handleAddItem}
                 className="bg-brand-primary text-white p-2 rounded-lg hover:bg-brand-800 transition-colors"
               >
                 <Plus size={20} />
               </button>
             </div>

             {/* List */}
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
               {items.filter(i => i.category === activeCategory).length === 0 ? (
                 <div className="text-center py-12 text-slate-400 italic border-2 border-dashed border-slate-100 rounded-xl">
                   No items added to this category yet.
                 </div>
               ) : (
                 items.filter(i => i.category === activeCategory).map(item => (
                   <div key={item.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg group border-b border-slate-50 last:border-0">
                      <span className="text-sm font-medium text-slate-700">{item.description}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-900 font-mono">₹{item.amount.toLocaleString()}</span>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                   </div>
                 ))
               )}
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onSave(totalBudget, items); onClose(); }} 
            className="px-8 py-2.5 bg-brand-accent text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-brand-accent/20 transition-all flex items-center gap-2"
          >
            <IndianRupee size={18} /> Apply Budget Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
