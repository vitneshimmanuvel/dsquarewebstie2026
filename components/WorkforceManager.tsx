
import React, { useState } from 'react';
import { useData } from '../DataContext';
import { useAuth } from '../AuthContext';
import { WorkerLog } from '../types';
import { Users, Clock, CalendarCheck, HardHat, IndianRupee, FileText, Download, CheckCircle, Circle, X, Save, Trash2, Percent, MinusCircle } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

interface CategoryStats {
  count: number;
  wage: number;
  shifts: number;
}

const WorkforceManager: React.FC = () => {
  const { workerLogs, addWorkerLog, updateWorkerLog, deleteWorkerLog } = useData();
  const { isAdmin, isSuperAdmin } = useAuth();
  
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  
  // Payroll Adjustments State
  const [taxRate, setTaxRate] = useState<number>(0);
  const [deductionAmount, setDeductionAmount] = useState<number>(0);
  const [deductionReason, setDeductionReason] = useState<string>('');

  // Confirmation States
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [confirmMarkPaid, setConfirmMarkPaid] = useState(false);

  const [newLog, setNewLog] = useState<Partial<WorkerLog>>({
    category: 'Mason', count: 0, shift: 'Morning', totalWage: 0, status: 'Pending', date: new Date().toISOString().split('T')[0]
  });

  const sortedLogs = [...workerLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestDate = sortedLogs[0]?.date;
  
  const activeWorkers = sortedLogs
    .filter(log => log.date === latestDate)
    .reduce((sum, log) => sum + log.count, 0);

  const pendingLogs = workerLogs.filter(log => log.status === 'Pending');
  const grossPendingPayout = pendingLogs.reduce((sum, log) => sum + log.totalWage, 0);

  // Advanced Calculations
  const taxValue = (grossPendingPayout * taxRate) / 100;
  const netPayable = Math.max(0, grossPendingPayout - taxValue - deductionAmount);

  const todaysWage = sortedLogs
    .filter(log => log.date === latestDate)
    .reduce((sum, log) => sum + log.totalWage, 0);

  const categoryBreakdown = pendingLogs.reduce((acc, log) => {
    if (!acc[log.category]) {
      acc[log.category] = { count: 0, wage: 0, shifts: 0 };
    }
    acc[log.category].count += log.count; 
    acc[log.category].wage += log.totalWage;
    acc[log.category].shifts += 1;
    return acc;
  }, {} as Record<string, CategoryStats>);

  const executeMarkAllPaid = () => {
    setIsGenerating(true);
    setTimeout(() => {
      workerLogs.forEach(log => {
        if(log.status === 'Pending') updateWorkerLog(log.id, { status: 'Paid' });
      });
      // Reset adjustments after payment
      setTaxRate(0);
      setDeductionAmount(0);
      setDeductionReason('');
      setIsGenerating(false);
      setShowPayrollModal(false);
      setConfirmMarkPaid(false);
    }, 1500);
  };

  const executeDeleteLog = () => {
    if (logToDelete) {
      deleteWorkerLog(logToDelete);
      setLogToDelete(null);
    }
  };

  const handleSaveAttendance = () => {
    if(newLog.count && newLog.totalWage) {
        const log: WorkerLog = {
            id: `w${Date.now()}`,
            category: newLog.category as any,
            count: newLog.count,
            shift: newLog.shift as any,
            totalWage: newLog.totalWage,
            status: 'Pending',
            date: newLog.date || new Date().toISOString().split('T')[0]
        };
        addWorkerLog(log);
        setIsAttendanceModalOpen(false);
        setNewLog({ category: 'Mason', count: 0, shift: 'Morning', totalWage: 0, status: 'Pending', date: new Date().toISOString().split('T')[0] });
    }
  };

  const handleDownload = () => {
    const content = `Payroll Report - Week of ${new Date().toLocaleDateString()}\n\n` +
                    `Gross Wages: ₹${grossPendingPayout}\n` +
                    `Tax (${taxRate}%): -₹${taxValue}\n` +
                    `Deductions: -₹${deductionAmount} (${deductionReason})\n` +
                    `Net Payable: ₹${netPayable}\n\n` +
                    `Breakdown:\n` +
                    Object.entries(categoryBreakdown).map(([cat, data]) => {
                        const stats = data as CategoryStats;
                        return `${cat}: ${stats.count} workers, ${stats.shifts} shifts, ₹${stats.wage}`;
                    }).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payroll_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Delete Confirmation */}
      <ConfirmationModal 
        isOpen={!!logToDelete}
        onClose={() => setLogToDelete(null)}
        onConfirm={executeDeleteLog}
        title="Delete Worker Log"
        message="Are you sure you want to remove this attendance log? This will affect payroll calculations."
        confirmText="Delete Log"
        isDestructive={true}
      />

      {/* Mark Paid Confirmation */}
      <ConfirmationModal 
        isOpen={confirmMarkPaid}
        onClose={() => setConfirmMarkPaid(false)}
        onConfirm={executeMarkAllPaid}
        title="Process Payroll"
        message={`You are about to mark ${pendingLogs.length} pending logs as PAID. Total net payout amount is ₹${netPayable.toLocaleString()}. Proceed?`}
        confirmText="Process & Pay"
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
          <h2 className="text-2xl font-bold text-slate-900">Workforce & Wages</h2>
          <p className="text-slate-500">Daily logs, attendance and payout calculations.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowPayrollModal(!showPayrollModal)}
            className={`border px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
              showPayrollModal 
                ? 'bg-brand-primary text-white border-brand-primary' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileText size={18} /> {showPayrollModal ? 'Hide Report' : 'Payroll Report'}
          </button>
          {isAdmin && (
            <button 
              onClick={() => setIsAttendanceModalOpen(true)}
              className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <CalendarCheck size={18} /> Mark Attendance
            </button>
          )}
        </div>
      </div>

      {isAttendanceModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Daily Attendance Entry</h3>
              <button onClick={() => setIsAttendanceModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                <input type="date" className="w-full p-2 border rounded-lg" value={newLog.date} onChange={e => setNewLog({...newLog, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                <select className="w-full p-2 border rounded-lg" value={newLog.category} onChange={e => setNewLog({...newLog, category: e.target.value as any})}>
                  <option value="Mason">Mason</option>
                  <option value="Helper">Helper</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Worker Count</label>
                   <input type="number" className="w-full p-2 border rounded-lg" value={newLog.count} onChange={e => setNewLog({...newLog, count: parseInt(e.target.value)})} />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Shift</label>
                   <select className="w-full p-2 border rounded-lg" value={newLog.shift} onChange={e => setNewLog({...newLog, shift: e.target.value as any})}>
                     <option value="Morning">Morning</option>
                     <option value="Evening">Evening</option>
                     <option value="Night">Night</option>
                   </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Wage Calculation</label>
                <input type="number" className="w-full p-2 border rounded-lg" value={newLog.totalWage} onChange={e => setNewLog({...newLog, totalWage: parseInt(e.target.value)})} placeholder="Enter total daily wage" />
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button onClick={() => setIsAttendanceModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">Cancel</button>
              <button onClick={handleSaveAttendance} className="px-4 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-800 flex items-center gap-2">
                <Save size={18} /> Save Log
              </button>
            </div>
          </div>
        </div>
      )}

      {showPayrollModal && (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-brand-primary/20 animate-in fade-in slide-in-from-top-4 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-brand-900">Pending Payroll Report</h3>
              <p className="text-sm text-slate-500">Comprehensive breakdown with tax and deductions.</p>
            </div>
            <div className="flex items-center gap-2">
              {grossPendingPayout > 0 ? (
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-100 px-2 py-1 rounded border border-amber-200">
                  Status: Pending Payment
                </span>
              ) : (
                 <span className="text-xs font-bold text-green-600 uppercase tracking-wider bg-green-100 px-2 py-1 rounded border border-green-200">
                  Status: All Paid
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
             {/* Summary Cards */}
             <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                    <Clock size={12} /> Period
                  </span>
                  <p className="font-bold text-slate-800 mt-1 text-lg">Current Week</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                    <Users size={12} /> Shifts
                  </span>
                  <p className="font-bold text-slate-800 mt-1 text-lg">
                    {Object.values(categoryBreakdown).reduce((a: number, b: CategoryStats) => a + b.count, 0)}
                  </p>
                </div>
                <div className="p-5 bg-brand-900 text-white rounded-xl shadow-lg shadow-brand-900/20">
                  <span className="text-xs font-bold text-blue-200 uppercase flex items-center gap-2">
                    <IndianRupee size={12} /> Net Payable
                  </span>
                  <p className="font-bold text-white mt-1 text-2xl tracking-tight">₹{netPayable.toLocaleString()}</p>
                  <p className="text-xs text-blue-200 mt-1">After Tax & Deductions</p>
                </div>
             </div>

             {/* Adjustment Controls */}
             <div className="lg:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><MinusCircle size={14}/> Adjustments</h4>
                <div className="space-y-3">
                   <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tax Rate (%)</label>
                      <div className="relative">
                        <Percent size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          value={taxRate} 
                          onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                          className="w-full pl-8 p-2 rounded border border-slate-300 outline-none focus:border-brand-primary" 
                        />
                      </div>
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Deductions (₹)</label>
                      <div className="relative">
                        <IndianRupee size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input 
                          type="number" 
                          min="0" 
                          value={deductionAmount} 
                          onChange={(e) => setDeductionAmount(parseFloat(e.target.value) || 0)}
                          className="w-full pl-8 p-2 rounded border border-slate-300 outline-none focus:border-brand-primary" 
                        />
                      </div>
                   </div>
                   <div>
                      <input 
                        type="text" 
                        placeholder="Reason for deduction..." 
                        value={deductionReason}
                        onChange={(e) => setDeductionReason(e.target.value)}
                        className="w-full p-2 rounded border border-slate-300 text-xs outline-none focus:border-brand-primary"
                      />
                   </div>
                </div>
             </div>
          </div>

          {/* Financial Breakdown Table */}
          {grossPendingPayout > 0 && (
            <div className="mb-8 bg-slate-50/50 rounded-lg border border-slate-200 p-4">
               <h4 className="font-bold text-slate-800 mb-3 text-sm">Financial Breakdown</h4>
               <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                     <span className="text-slate-600">Gross Wages</span>
                     <span className="font-medium text-slate-900">₹{grossPendingPayout.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                     <span>Tax ({taxRate}%)</span>
                     <span>- ₹{taxValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                     <span>Deductions {deductionReason ? `(${deductionReason})` : ''}</span>
                     <span>- ₹{deductionAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-300 pt-2 mt-2">
                     <span className="font-bold text-brand-900">Net Payable</span>
                     <span className="font-bold text-brand-primary text-lg">₹{netPayable.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
               </div>
            </div>
          )}

          {grossPendingPayout > 0 ? (
            <div className="overflow-hidden rounded-lg border border-slate-200 mb-8">
               <table className="w-full text-sm text-left">
                 <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                   <tr>
                     <th className="p-4">Worker Category</th>
                     <th className="p-4 text-center">Shifts</th>
                     <th className="p-4 text-center">Headcount</th>
                     <th className="p-4 text-right">Base Wage</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {Object.entries(categoryBreakdown).map(([cat, data]) => {
                     const stats = data as CategoryStats;
                     return (
                     <tr key={cat} className="hover:bg-slate-50/50">
                       <td className="p-4 font-medium text-slate-800">{cat}</td>
                       <td className="p-4 text-center text-slate-600">{stats.shifts}</td>
                       <td className="p-4 text-center text-slate-600">{stats.count}</td>
                       <td className="p-4 text-right font-bold text-slate-700">₹{stats.wage.toLocaleString()}</td>
                     </tr>
                   )})}
                 </tbody>
               </table>
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100 mb-8">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-3" />
              <h3 className="text-lg font-medium text-slate-900">All Caught Up!</h3>
              <p className="text-slate-500">There are no pending wages to process.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end pt-4 border-t border-slate-100 gap-3">
             <button 
                onClick={handleDownload}
                className="px-6 py-3 border border-slate-300 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
             >
                <Download size={18} /> Download Report
             </button>
             {grossPendingPayout > 0 && isAdmin && (
               <button 
                 onClick={() => setConfirmMarkPaid(true)}
                 disabled={isGenerating}
                 className="bg-brand-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-accent/20 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {isGenerating ? (
                   <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Processing...
                   </>
                 ) : (
                   <>
                     <CheckCircle size={18} /> Process & Pay
                   </>
                 )}
               </button>
             )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
             <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
               <HardHat size={32} />
             </div>
             <h3 className="text-3xl font-bold text-slate-800">{activeWorkers}</h3>
             <p className="text-slate-500 text-sm">Active Workers Today</p>
             <p className="text-xs text-slate-400 mt-1">{latestDate}</p>
           </div>
           
           <div className="bg-brand-primary p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <IndianRupee size={64} />
             </div>
             <p className="text-blue-100 text-sm mb-1">Today's Wage Cost</p>
             <h3 className="text-2xl font-bold">₹{todaysWage.toLocaleString()}</h3>
             
             <div className="mt-6 pt-4 border-t border-blue-400/30">
                <p className="text-xs text-blue-200 mb-1">Total Pending Payouts</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-xl text-brand-accent">₹{grossPendingPayout.toLocaleString()}</span>
                  <span className="text-[10px] text-blue-300">Gross</span>
                </div>
             </div>
           </div>
        </div>

        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-6">Recent Shift Logs</h3>
          <div className="grid gap-4">
            {sortedLogs.map((log) => (
              <div key={log.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 gap-4 group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0
                    ${log.category === 'Mason' ? 'bg-orange-500' : 
                      log.category === 'Electrician' ? 'bg-yellow-500' : 
                      log.category === 'Manager' ? 'bg-slate-800' : 'bg-blue-500'}
                  `}>
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      {log.category}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        log.status === 'Paid' 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-amber-100 text-amber-700 border-amber-200'
                      }`}>
                        {log.status}
                      </span>
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={12} /> {log.shift}</span>
                      <span className="flex items-center gap-1"><CalendarCheck size={12} /> {log.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                    <div className="text-center px-4 sm:border-x sm:border-slate-200">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Count</p>
                    <p className="font-bold text-slate-900 text-lg">{log.count}</p>
                    </div>

                    <div className="text-right min-w-[80px]">
                    <p className="text-xs text-slate-400">Wage</p>
                    <p className={`font-bold ${log.status === 'Paid' ? 'text-green-600' : 'text-brand-primary'}`}>₹{log.totalWage.toLocaleString()}</p>
                    </div>

                    {isSuperAdmin && (
                       <button 
                          onClick={() => setLogToDelete(log.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                       >
                          <Trash2 size={16} />
                       </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkforceManager;
