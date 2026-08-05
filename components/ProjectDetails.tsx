import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../ProjectContext';
import { 
  Calendar, MapPin, IndianRupee, CheckCircle, Circle, 
  FileText, Download, Image, Clock, ArrowLeft, 
  LayoutDashboard, ChevronRight, Edit2
} from 'lucide-react';

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject } = useProjects();
  const project = getProject(id || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'financials' | 'documents'>('overview');

  if (!project) return <div className="p-8 text-center text-slate-500">Project not found</div>;

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 ${
        activeTab === id 
          ? 'border-brand-accent text-brand-primary bg-blue-50/50' 
          : 'border-transparent text-slate-500 hover:text-brand-primary hover:bg-slate-50'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <button onClick={() => navigate('/app/projects')} className="text-slate-400 hover:text-brand-primary flex items-center gap-1 text-sm">
            <ArrowLeft size={16} /> Back to Projects
          </button>
          <button 
            onClick={() => navigate(`/app/projects/${id}/edit`)}
            className="flex items-center gap-2 bg-slate-50 text-brand-primary hover:bg-brand-primary hover:text-white px-4 py-2 rounded-lg transition-all text-sm font-bold border border-brand-primary/20"
          >
            <Edit2 size={14} /> Edit Project
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img 
            src={project.thumbnail} 
            alt={project.name} 
            className="w-full md:w-48 h-32 object-cover rounded-lg shadow-md"
          />
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <div>
                <h1 className="text-2xl font-bold text-brand-900">{project.name}</h1>
                <p className="text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin size={16} /> {project.location}
                </p>
              </div>
              <span className="bg-brand-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide self-start">
                {project.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
               <div className="bg-slate-50 p-3 rounded-lg">
                 <span className="text-xs text-slate-400 uppercase font-bold">Client</span>
                 <p className="font-semibold text-slate-800 text-sm truncate">{project.clientName}</p>
               </div>
               <div className="bg-slate-50 p-3 rounded-lg">
                 <span className="text-xs text-slate-400 uppercase font-bold">Deadline</span>
                 <p className="font-semibold text-slate-800 text-sm">{project.deadline}</p>
               </div>
               <div className="bg-slate-50 p-3 rounded-lg">
                 <span className="text-xs text-slate-400 uppercase font-bold">Budget</span>
                  <p className="font-semibold text-slate-800 text-sm">₹{(project.budget/100000).toFixed(1)}L</p>
               </div>
               <div className="bg-slate-50 p-3 rounded-lg">
                 <span className="text-xs text-slate-400 uppercase font-bold">Progress</span>
                 <div className="flex items-center gap-2">
                   <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                     <div className="h-full bg-brand-accent" style={{ width: `${project.progress}%` }}></div>
                   </div>
                   <span className="text-xs font-bold text-brand-accent">{project.progress}%</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-t-2xl border-b border-slate-200 flex overflow-x-auto scrollbar-hide">
        <TabButton id="overview" label="Overview" icon={LayoutDashboard} />
        <TabButton id="timeline" label="Timeline" icon={Calendar} />
        <TabButton id="financials" label="Financials" icon={IndianRupee} />
        <TabButton id="documents" label="Documents" icon={FileText} />
      </div>

      <div className="bg-white p-6 rounded-b-2xl shadow-sm min-h-[400px] border border-t-0 border-slate-100">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                   <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <FileText size={20} className="text-brand-accent" /> Project Scope
                   </h3>
                   <p className="text-slate-600 leading-relaxed text-sm md:text-base">{project.description}</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                   <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                         <Image size={20} className="text-brand-accent" /> Site Gallery
                      </h3>
                      <span className="text-xs font-medium text-slate-500">{project.gallery.length} Photos</span>
                   </div>
                   <div className="p-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {project.gallery.length > 0 ? project.gallery.map((img, idx) => (
                            <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all">
                                <img 
                                  src={img} 
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                  alt={`Site ${idx}`} 
                                />
                                <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/20 transition-colors"></div>
                            </div>
                          )) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
                               <Image size={32} className="mb-2 opacity-50" />
                               <p>No photos uploaded yet.</p>
                            </div>
                          )}
                      </div>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-1">
                <div className="bg-brand-900 text-white p-6 rounded-2xl shadow-xl shadow-brand-900/10 h-full">
                 <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-brand-accent" /> Recent Activity
                 </h3>
                 <div className="relative space-y-8 before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-brand-800">
                   <div className="relative flex items-start group pl-8">
                     <div className="absolute left-0 h-5 w-5 flex items-center justify-center">
                        <div className="h-2.5 w-2.5 bg-brand-accent rounded-full ring-4 ring-brand-900"></div>
                     </div>
                     <div>
                       <p className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">Material Delivered</p>
                       <p className="text-xs text-slate-400 mt-1 leading-relaxed">500 bags of Cement delivered by ABC Traders.</p>
                       <p className="text-[10px] text-brand-primary mt-2 font-medium bg-brand-950 inline-block px-2 py-0.5 rounded">Today, 10:00 AM</p>
                     </div>
                   </div>
                   
                   <div className="relative flex items-start group pl-8">
                     <div className="absolute left-0 h-5 w-5 flex items-center justify-center">
                        <div className="h-2.5 w-2.5 bg-blue-500 rounded-full ring-4 ring-brand-900"></div>
                     </div>
                     <div>
                       <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Milestone Completed</p>
                       <p className="text-xs text-slate-400 mt-1 leading-relaxed">Foundation Laying marked as complete.</p>
                       <p className="text-[10px] text-brand-primary mt-2 font-medium bg-brand-950 inline-block px-2 py-0.5 rounded">Yesterday, 4:30 PM</p>
                     </div>
                   </div>
                 </div>
                 
                 <button className="w-full mt-8 py-3 bg-brand-800 hover:bg-brand-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 group">
                    View All Logs <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </button>
               </div>
             </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {project.milestones.map((milestone) => (
                <div key={milestone.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10
                    ${milestone.status === 'Completed' ? 'bg-green-500 text-white shadow-green-200 shadow-lg' : 
                      milestone.status === 'In Progress' ? 'bg-brand-primary text-white shadow-blue-200 shadow-lg' : 'bg-slate-200 text-slate-400'}
                  `}>
                    {milestone.status === 'Completed' ? <CheckCircle size={18} /> : 
                     milestone.status === 'In Progress' ? <Clock size={18} /> : <Circle size={18} />}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-slate-800">{milestone.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        milestone.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        milestone.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {milestone.status}
                      </span>
                    </div>
                    <time className="block mb-2 text-xs font-medium text-slate-400 uppercase">{milestone.date}</time>
                    {milestone.description && <p className="text-slate-600 text-sm">{milestone.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Budget</p>
                <h3 className="text-2xl font-bold text-slate-800">₹{(project.budget).toLocaleString()}</h3>
              </div>
              <div className="p-6 bg-white rounded-xl border border-brand-primary/20 shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent"></div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Paid</p>
                <h3 className="text-2xl font-bold text-brand-primary">₹{(project.spent).toLocaleString()}</h3>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Pending Invoices</p>
                <h3 className="text-2xl font-bold text-amber-600">
                  ₹{project.invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                </h3>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 mb-4">Payment History</h3>
            {project.invoices.length > 0 ? (
              <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="p-4">Invoice #</th>
                      <th className="p-4">Stage</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {project.invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="p-4 font-medium">{inv.number}</td>
                        <td className="p-4">{inv.stage}</td>
                        <td className="p-4 text-slate-500">{inv.date}</td>
                        <td className="p-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>{inv.status}</span>
                        </td>
                         <td className="p-4 text-right font-bold">₹{inv.amount.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <button className="text-brand-primary hover:text-brand-800">
                            <Download size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8 border border-dashed border-slate-300 rounded-lg text-slate-400">No invoices generated yet.</div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-brand-primary hover:text-brand-primary hover:bg-blue-50/50 transition-all cursor-pointer group h-32">
                <div className="p-2 bg-slate-100 rounded-full mb-2 group-hover:bg-white">
                   <Download size={20} className="rotate-180" />
                </div>
                <span className="text-sm font-medium">Upload New File</span>
             </div>
             {project.documents.map(doc => (
               <div key={doc.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow flex items-start gap-3 group">
                  <div className={`p-3 rounded-lg shrink-0 ${doc.type === 'PDF' ? 'bg-red-100 text-red-600' : doc.type === 'XLS' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {doc.type === 'IMG' ? <Image size={20} /> : <FileText size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm truncate" title={doc.name}>{doc.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{doc.date} • {doc.size}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-primary transition-all"><Download size={18} /></button>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;