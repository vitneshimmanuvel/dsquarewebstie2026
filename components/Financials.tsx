import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
import { useData } from '../DataContext';

const Financials: React.FC = () => {
  const { transactions } = useData();

  const monthlyData = [
    { month: 'Oct', revenue: 40000, expense: 24000 },
    { month: 'Nov', revenue: 30000, expense: 13980 },
    { month: 'Dec', revenue: 20000, expense: 9800 },
    { month: 'Jan', revenue: 27800, expense: 39080 },
    { month: 'Feb', revenue: 18900, expense: 4800 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Financial Overview</h2>
        <p className="text-slate-500">Company-wide revenue, profit margins, and expenses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-brand-900 text-white p-6 rounded-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-10"><IndianRupee size={64} /></div>
           <p className="text-blue-200 text-sm mb-1">Total Revenue (YTD)</p>
           <h3 className="text-3xl font-bold">₹12,45,000</h3>
           <div className="mt-4 flex items-center gap-2 text-sm text-green-400 bg-white/10 w-fit px-2 py-1 rounded">
              <TrendingUp size={14} /> +12.5% vs last year
           </div>
         </div>
         <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
           <p className="text-slate-500 text-sm mb-1">Total Expenses</p>
           <h3 className="text-3xl font-bold text-slate-800">₹8,65,000</h3>
           <div className="mt-4 flex items-center gap-2 text-sm text-red-500 bg-red-50 w-fit px-2 py-1 rounded">
              <TrendingDown size={14} /> +5.2% (Material Cost)
           </div>
         </div>
         <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
           <p className="text-slate-500 text-sm mb-1">Net Profit Margin</p>
           <h3 className="text-3xl font-bold text-green-600">30.5%</h3>
           <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
             <div className="bg-green-500 w-[30.5%] h-full"></div>
           </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Cash Flow Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip />
                <Bar dataKey="revenue" name="Income" fill="#003366" radius={[4,4,0,0]} />
                <Bar dataKey="expense" name="Expense" fill="#ED1C24" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <h3 className="font-bold text-slate-900 mb-6">Recent Transactions</h3>
           <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
             {transactions.map(t => (
               <div key={t.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                 <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-full ${t.type === 'Credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                     {t.type === 'Credit' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                   </div>
                   <div>
                     <p className="font-medium text-slate-800 text-sm">{t.description}</p>
                     <p className="text-xs text-slate-400">{t.date}</p>
                   </div>
                 </div>
                 <span className={`font-bold text-sm ${t.type === 'Credit' ? 'text-green-600' : 'text-slate-800'}`}>
                   {t.type === 'Credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                 </span>
               </div>
             ))}
           </div>
           <button className="w-full mt-6 py-2 text-sm text-brand-primary font-medium border border-brand-primary/20 rounded-lg hover:bg-brand-primary/5">
             View All Transactions
           </button>
        </div>
      </div>
    </div>
  );
};

export default Financials;