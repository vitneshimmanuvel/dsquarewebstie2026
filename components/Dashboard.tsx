
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { UserRole } from '../types';
import { TRANSACTIONS } from '../constants';
import { useProjects } from '../ProjectContext';
import { TrendingUp, Users, AlertTriangle, Clock, ChevronRight } from 'lucide-react';

interface DashboardProps {
  role: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const isClient = role === UserRole.CLIENT;
  
  // Mock data derivation
  const activeProjects = isClient ? 1 : projects.length;
  const totalSpent = isClient ? (projects[0]?.spent || 0) : projects.reduce((acc, p) => acc + p.spent, 0);
  const progress = isClient ? (projects[0]?.progress || 0) : 0;
  
  const StatCard = ({ title, value, icon: Icon, color, trend, path }: any) => (
    <div 
      onClick={() => path && navigate(path)}
      className="bg-white p-6 rounded shadow-sm border-l-4 border-l-transparent hover:border-l-brand-accent hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">
         <ChevronRight size={20} />
      </div>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded ${color} text-white`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="text-brand-primary text-sm font-semibold flex items-center bg-blue-50 px-2 py-1 rounded">
            <TrendingUp size={14} className="mr-1" /> {trend}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
    </div>
  );

  // Chart Data
  const spendData = projects.map(p => ({
    name: p.name.split(' ')[0],
    Budget: p.budget,
    Spent: p.spent
  }));

  const pieData = [
    { name: 'Materials', value: 45 },
    { name: 'Labor', value: 30 },
    { name: 'Machinery', value: 15 },
    { name: 'Overhead', value: 10 },
  ];
  // Updated COLORS to match D Square Brand (Blue, Red, Grey)
  const COLORS = ['#003366', '#ED1C24', '#64748b', '#94a3b8'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-900">Dashboard</h2>
        <p className="text-slate-500">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={isClient ? "My Project Progress" : "Active Projects"}
          value={isClient ? `${progress}%` : activeProjects}
          icon={TrendingUp}
          color="bg-brand-primary"
          trend={!isClient ? "+2 New" : undefined}
          path={isClient ? "/app/my-project" : "/app/projects"}
        />
        <StatCard 
          title="Total Expenditure"
          value={`₹${(totalSpent / 100000).toFixed(1)}L`}
          icon={AlertTriangle}
          color="bg-brand-accent"
          path="/app/projects"
        />
        <StatCard 
          title="Workforce Active"
          value="42"
          icon={Users}
          color="bg-brand-800"
          trend="+5 today"
          path="/app/workforce"
        />
        <StatCard 
          title="Pending Tasks"
          value="12"
          icon={Clock}
          color="bg-slate-600"
          path="/app/projects"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div 
          onClick={() => navigate('/app/projects')}
          className="lg:col-span-2 bg-white p-6 rounded shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer relative group"
        >
           <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
             <ChevronRight size={20} />
           </div>
          <h3 className="text-lg font-bold text-brand-900 mb-6">Financial Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="Budget" fill="#e2e8f0" radius={[2, 2, 0, 0]} barSize={30} />
                <Bar dataKey="Spent" fill="#003366" radius={[2, 2, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div 
          onClick={() => navigate('/app/materials')}
          className="bg-white p-6 rounded shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer relative group"
        >
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
             <ChevronRight size={20} />
           </div>
          <h3 className="text-lg font-bold text-brand-900 mb-6">Cost Distribution</h3>
          <div className="h-60 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="block text-2xl font-bold text-brand-900">100%</span>
                <span className="text-xs text-slate-400">Allocation</span>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm text-slate-600">{entry.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-brand-900 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-100">
                <th className="pb-4 text-sm font-semibold text-slate-400">Description</th>
                <th className="pb-4 text-sm font-semibold text-slate-400">Date</th>
                <th className="pb-4 text-sm font-semibold text-slate-400">Status</th>
                <th className="pb-4 text-sm font-semibold text-slate-400 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TRANSACTIONS.map((t) => (
                <tr 
                  key={t.id} 
                  onClick={() => navigate('/app/projects')}
                  className="group hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-4 text-sm font-medium text-slate-800">{t.description}</td>
                  <td className="py-4 text-sm text-slate-500">{t.date}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                      t.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className={`py-4 text-sm font-bold text-right flex items-center justify-end gap-2 ${t.type === 'Credit' ? 'text-green-600' : 'text-slate-800'}`}>
                    {t.type === 'Credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
