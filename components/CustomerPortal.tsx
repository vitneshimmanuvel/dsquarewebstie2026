import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE } from '../AuthContext';
import { CustomerStep, Project } from '../types';
import { 
  CheckCircle2, Circle, AlertCircle, Calendar, IndianRupee, FileText, 
  Image as ImageIcon, User, Phone, MapPin, Send, HelpCircle, 
  ArrowRight, Download, LogOut, Loader2, Sparkles, Building
} from 'lucide-react';

const CustomerPortal: React.FC = () => {
  const { user, logout, token } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [steps, setSteps] = useState<CustomerStep[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | 'gallery' | 'financials' | 'documents'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStep, setSelectedStep] = useState<CustomerStep | null>(null);
  
  // Response submission fields
  const [responseText, setResponseText] = useState('');
  const [responseFile, setResponseFile] = useState('');
  const [responseDate, setResponseDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New user project inquiry form fields
  const [inquirySubmitted, setInquirySubmitted] = useState<boolean>(() => {
    return !!localStorage.getItem(`project_inquiry_${user?.id || 'guest'}`);
  });
  const [inqName, setInqName] = useState('');
  const [inqLocation, setInqLocation] = useState('');
  const [inqBudget, setInqBudget] = useState('');
  const [inqType, setInqType] = useState('Residential');
  const [inqDescription, setInqDescription] = useState('');
  const [inqDetails, setInqDetails] = useState<any>(() => {
    const saved = localStorage.getItem(`project_inquiry_${user?.id || 'guest'}`);
    return saved ? JSON.parse(saved) : null;
  });

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const details = {
      name: inqName,
      location: inqLocation,
      budget: inqBudget,
      type: inqType,
      description: inqDescription,
      date: new Date().toLocaleDateString()
    };
    localStorage.setItem(`project_inquiry_${user?.id || 'guest'}`, JSON.stringify(details));
    setInqDetails(details);
    setInquirySubmitted(true);
  };

  const fetchCustomerData = async () => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return;
    setIsLoading(true);
    try {
      // 1. Fetch Customer's Projects
      const projectsRes = await fetch(`${API_BASE}/customer-steps/my/projects`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const projectsData = await projectsRes.json();
      if (projectsData.success && projectsData.data && projectsData.data.length > 0) {
        setProject(projectsData.data[0]);
      } else {
        // Fallback: fetch from general projects endpoint
        const fallbackRes = await fetch(`${API_BASE}/projects`, {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackData.success && fallbackData.data && fallbackData.data.length > 0) {
          setProject(fallbackData.data[0]);
        }
      }

      // 2. Fetch Customer's Steps
      const stepsRes = await fetch(`${API_BASE}/customer-steps/my/steps`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const stepsData = await stepsRes.json();
      if (stepsData.success && stepsData.data) {
        setSteps(stepsData.data.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0)));
      }
    } catch (err) {
      console.error('Failed to load customer portal data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [user, token]);

  const handleStepClick = (step: CustomerStep) => {
    setSelectedStep(step);
    setResponseText(step.responseText || '');
    setResponseFile(step.responseFile || '');
    setResponseDate(step.responseDate ? new Date(step.responseDate).toISOString().split('T')[0] : '');
  };

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStep) return;
    setIsSubmitting(true);

    const activeToken = token || localStorage.getItem('token');
    try {
      const payload: any = {};
      if (selectedStep.fieldType === 'TEXT' || selectedStep.fieldType === 'NUMBER' || selectedStep.fieldType === 'DROPDOWN') {
        payload.responseText = responseText;
      } else if (selectedStep.fieldType === 'DATE') {
        payload.responseDate = responseDate;
      } else if (selectedStep.fieldType === 'FILE' || selectedStep.fieldType === 'IMAGE') {
        payload.responseFile = responseFile || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80';
        payload.responseText = responseText || 'Uploaded attachment';
      }

      const res = await fetch(`${API_BASE}/customer-steps/${selectedStep.id}/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        // Refresh
        await fetchCustomerData();
        setSelectedStep(null);
      }
    } catch (err) {
      console.error('Error submitting step response:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcknowledge = async (stepId: string) => {
    setIsSubmitting(true);
    const activeToken = token || localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/customer-steps/${stepId}/acknowledge`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        await fetchCustomerData();
        setSelectedStep(null);
      }
    } catch (err) {
      console.error('Error acknowledging step:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
         <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
         <p className="text-slate-500 font-medium">Securing connection to Infrazone Server...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-brand-900 text-white h-20 px-4 sm:px-8 flex items-center justify-between shadow-md relative z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border border-brand-accent rounded flex items-center justify-center bg-white shadow-sm">
             <span className="text-brand-accent font-bold text-lg leading-none pt-0.5">D</span>
             <span className="text-brand-accent font-bold text-[9px] leading-none self-start -ml-0.5">2</span>
          </div>
          <div className="flex flex-col">
             <span className="text-white font-bold text-base leading-none tracking-tight">D SQUARE</span>
             <span className="text-brand-accent font-bold text-xs leading-none">CLIENT PORTAL</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="hidden md:flex flex-col text-right">
              <span className="font-bold text-sm text-slate-100">{user?.name}</span>
              <span className="text-xs text-blue-300 capitalize">{user?.email}</span>
           </div>
           <button 
             onClick={logout} 
             className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 active:bg-white/5 text-sm font-semibold rounded-xl transition-all"
           >
             <LogOut size={16} /> Sign Out
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 overflow-y-auto space-y-6">
         {project ? (
           <>
             {/* Project Banner Card */}
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row gap-6 items-start animate-fade-in-up">
                <img 
                  src={project.thumbnail || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'} 
                  alt={project.name} 
                  className="w-full md:w-56 h-36 object-cover rounded-xl shadow-md shrink-0"
                />
                <div className="flex-1 w-full space-y-4">
                   <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                     <div>
                       <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-full mb-2">
                          <Building size={10} /> Active Project
                       </span>
                       <h1 className="text-2xl font-black text-brand-900 leading-tight">{project.name}</h1>
                       <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                          <MapPin size={14} /> {project.location || 'Site Location'}
                       </p>
                     </div>
                     <span className="bg-brand-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {project.status || 'IN_PROGRESS'}
                     </span>
                   </div>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-100 pt-4">
                      <div>
                         <span className="block text-[10px] text-slate-400 uppercase font-bold">Contact Manager</span>
                         <p className="font-semibold text-slate-800 text-sm">{project.admin?.name || 'Supervisor'}</p>
                      </div>
                      <div>
                         <span className="block text-[10px] text-slate-400 uppercase font-bold">Project Budget</span>
                         <p className="font-semibold text-slate-800 text-sm">${(project.budget || 0).toLocaleString()}</p>
                      </div>
                      <div>
                         <span className="block text-[10px] text-slate-400 uppercase font-bold">Expected Deadline</span>
                         <p className="font-semibold text-slate-800 text-sm">
                           {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
                         </p>
                      </div>
                      <div>
                         <span className="block text-[10px] text-slate-400 uppercase font-bold">Site Progress</span>
                         <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-brand-accent" style={{ width: `${project.progress || 0}%` }}></div>
                            </div>
                            <span className="text-xs font-black text-brand-accent">{project.progress || 0}%</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Tab Buttons */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex overflow-x-auto p-1.5 scrollbar-hide shrink-0">
                {[
                  { id: 'overview', label: 'Overview', icon: Building },
                  { id: 'steps', label: 'Workflow Steps', icon: CheckCircle2, count: steps.filter(s => s.status !== 'COMPLETED').length },
                  { id: 'gallery', label: 'Visual Gallery', icon: ImageIcon },
                  { id: 'financials', label: 'Financial Logs', icon: IndianRupee },
                  { id: 'documents', label: 'Site Docs', icon: FileText }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-lg transition-all whitespace-nowrap ${
                      activeTab === t.id 
                        ? 'bg-brand-primary text-white shadow-md' 
                        : 'text-slate-500 hover:text-brand-primary hover:bg-slate-50'
                    }`}
                  >
                    <t.icon size={16} />
                    {t.label}
                    {t.count !== undefined && t.count > 0 && (
                      <span className="w-5 h-5 flex items-center justify-center bg-brand-accent text-white text-[10px] rounded-full">
                         {t.count}
                      </span>
                    )}
                  </button>
                ))}
             </div>

             {/* Dynamic Content Panel */}
             <div className="min-h-[400px]">
                {/* 1. Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-scale-up">
                     <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                           <h3 className="text-lg font-black text-brand-900 flex items-center gap-2">
                             <Sparkles size={18} className="text-brand-accent" /> Description & Scope
                           </h3>
                           <p className="text-slate-600 leading-relaxed text-sm">{project.description || 'No description provided.'}</p>
                        </div>
                        
                        {/* Profile Info */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                           <h3 className="text-lg font-black text-brand-900 flex items-center gap-2">
                             <User size={18} className="text-brand-accent" /> Customer Details
                           </h3>
                           <div className="grid sm:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl">
                                 <User className="text-slate-400" size={18} />
                                 <div>
                                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Client Name</span>
                                    <span className="font-semibold text-slate-800">{user?.name}</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl">
                                 <Phone className="text-slate-400" size={18} />
                                 <div>
                                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Phone Number</span>
                                    <span className="font-semibold text-slate-800">{project.clientPhone || user?.phone || 'N/A'}</span>
                                 </div>
                              </div>
                              <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl sm:col-span-2">
                                 <MapPin className="text-slate-400 mt-1" size={18} />
                                 <div>
                                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Billing Address</span>
                                    <span className="font-semibold text-slate-800">{project.clientAddress || 'N/A'}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Progress Timeline */}
                     <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-black text-brand-900 flex items-center gap-2">
                           <Calendar size={18} className="text-brand-accent" /> Construction Timeline
                        </h3>
                        <div className="relative border-l border-slate-100 pl-4 ml-2 space-y-6">
                           {(project.stages ? (typeof project.stages === 'string' ? JSON.parse(project.stages) : project.stages) : []).map((stage: any, idx: number) => (
                             <div key={idx} className="relative">
                                <div className={`absolute -left-6.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
                                  stage.status === 'COMPLETED' ? 'bg-green-500' : stage.status === 'IN_PROGRESS' ? 'bg-brand-accent animate-pulse' : 'bg-slate-200'
                                }`}>
                                   {stage.status === 'COMPLETED' && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                                </div>
                                <div className="pl-2">
                                   <h4 className="text-sm font-bold text-slate-800 leading-tight">{stage.name}</h4>
                                   <p className="text-xs text-slate-400 mt-0.5">{stage.status.replace('_', ' ')} • {stage.progress}%</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                )}

                {/* 2. Steps Tab (Workflow Action Items) */}
                {activeTab === 'steps' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-scale-up">
                     {/* Steps List */}
                     <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                           <h3 className="text-lg font-black text-brand-900 mb-2">Pending Actions</h3>
                           <p className="text-xs text-slate-400 mb-6">Complete the following requirements configured by your site admin to progress your build.</p>
                           
                           {steps.length > 0 ? (
                             <div className="divide-y divide-slate-100">
                               {steps.map((s) => (
                                 <div 
                                   key={s.id} 
                                   onClick={() => handleStepClick(s)}
                                   className={`py-4 flex items-center justify-between cursor-pointer group transition-all rounded-xl px-3 hover:bg-slate-50 ${
                                     selectedStep?.id === s.id ? 'bg-brand-primary/5 border border-brand-primary/10' : ''
                                   }`}
                                 >
                                    <div className="flex items-start gap-3">
                                       <div className="mt-1">
                                          {s.status === 'COMPLETED' ? (
                                            <CheckCircle2 className="text-green-500" size={18} />
                                          ) : s.status === 'IN_PROGRESS' ? (
                                            <Circle className="text-amber-500 fill-amber-500/20" size={18} />
                                          ) : (
                                            <Circle className="text-slate-300" size={18} />
                                          )}
                                       </div>
                                       <div>
                                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-primary transition-colors flex items-center gap-2">
                                             {s.title}
                                             {s.requiresAcknowledgment && !s.customerAcknowledged && (
                                               <span className="text-[9px] font-extrabold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Requires Approval</span>
                                             )}
                                          </h4>
                                          <p className="text-xs text-slate-400 mt-1 max-w-md truncate">{s.description || 'No details provided.'}</p>
                                       </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                                 </div>
                               ))}
                             </div>
                           ) : (
                             <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                <CheckCircle2 size={36} className="mx-auto mb-2 opacity-40 text-green-500" />
                                <p className="font-semibold text-sm">All steps completed!</p>
                                <p className="text-xs mt-1">There are no pending actions on your profile right now.</p>
                             </div>
                           )}
                        </div>
                     </div>

                     {/* Step Action Details Form */}
                     <div className="lg:col-span-1">
                        {selectedStep ? (
                          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg space-y-6 sticky top-6 animate-fade-in-up">
                             <div className="flex justify-between items-start">
                                <div>
                                   <span className="text-[9px] font-extrabold bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
                                     Field Type: {selectedStep.fieldType}
                                   </span>
                                   <h3 className="text-lg font-black text-brand-900 mt-2">{selectedStep.title}</h3>
                                </div>
                                <button onClick={() => setSelectedStep(null)} className="text-slate-400 hover:text-slate-600 text-xs">Close</button>
                             </div>

                             <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                {selectedStep.description || 'No instructions provided.'}
                             </p>

                             {/* Response Submission */}
                             {selectedStep.status !== 'COMPLETED' ? (
                               <form onSubmit={handleRespond} className="space-y-4">
                                  {selectedStep.fieldType === 'TEXT' && (
                                    <div>
                                       <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Your Response</label>
                                       <textarea 
                                         required={selectedStep.isRequired}
                                         value={responseText}
                                         onChange={e => setResponseText(e.target.value)}
                                         className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-primary h-24 text-sm"
                                         placeholder="Type your response here..."
                                       />
                                    </div>
                                  )}

                                  {selectedStep.fieldType === 'NUMBER' && (
                                    <div>
                                       <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Value (Number)</label>
                                       <input 
                                         type="number"
                                         required={selectedStep.isRequired}
                                         value={responseText}
                                         onChange={e => setResponseText(e.target.value)}
                                         className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-primary text-sm"
                                         placeholder="Enter numeric response"
                                       />
                                    </div>
                                  )}

                                  {selectedStep.fieldType === 'DATE' && (
                                    <div>
                                       <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Select Date</label>
                                       <input 
                                         type="date"
                                         required={selectedStep.isRequired}
                                         value={responseDate}
                                         onChange={e => setResponseDate(e.target.value)}
                                         className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-primary text-sm text-slate-700"
                                       />
                                    </div>
                                  )}

                                  {selectedStep.fieldType === 'DROPDOWN' && (
                                    <div>
                                       <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Choose Option</label>
                                       <select 
                                         required={selectedStep.isRequired}
                                         value={responseText}
                                         onChange={e => setResponseText(e.target.value)}
                                         className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-primary text-sm bg-white text-slate-700"
                                       >
                                         <option value="">Select an option</option>
                                         {selectedStep.dropdownOptions.map((opt, idx) => (
                                           <option key={idx} value={opt}>{opt}</option>
                                         ))}
                                       </select>
                                    </div>
                                  )}

                                  {(selectedStep.fieldType === 'FILE' || selectedStep.fieldType === 'IMAGE') && (
                                    <div className="space-y-3">
                                       <div>
                                         <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mock Attachment URL</label>
                                         <input 
                                           type="text"
                                           value={responseFile}
                                           onChange={e => setResponseFile(e.target.value)}
                                           className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-primary text-sm text-slate-700"
                                           placeholder="Enter file URL (e.g. image link)"
                                         />
                                       </div>
                                       <div>
                                         <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Attachment Note</label>
                                         <input 
                                           type="text"
                                           value={responseText}
                                           onChange={e => setResponseText(e.target.value)}
                                           className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-primary text-sm text-slate-700"
                                           placeholder="Add a brief description..."
                                         />
                                       </div>
                                    </div>
                                  )}

                                  <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-brand-800 transition-colors shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-75"
                                  >
                                     {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
                                     Submit Response
                                  </button>
                               </form>
                             ) : (
                               <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 text-xs flex gap-2">
                                  <CheckCircle2 size={16} className="shrink-0 text-green-600 mt-0.5" />
                                  <div>
                                     <p className="font-bold">Requirement Met</p>
                                     <p className="mt-1">Response: {selectedStep.responseText || 'Provided'}</p>
                                     {selectedStep.responseFile && (
                                       <a href={selectedStep.responseFile} target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold mt-1 block">View File</a>
                                     )}
                                  </div>
                               </div>
                             )}

                             {/* Acknowledgment Option */}
                             {selectedStep.requiresAcknowledgment && (
                               <div className="border-t border-slate-100 pt-6 space-y-3">
                                  <h4 className="text-xs font-bold text-slate-400 uppercase">Two-Sided Approval</h4>
                                  <div className="flex gap-2">
                                     <button
                                       disabled={selectedStep.customerAcknowledged || isSubmitting}
                                       onClick={() => handleAcknowledge(selectedStep.id)}
                                       className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all border flex items-center justify-center gap-1.5 ${
                                         selectedStep.customerAcknowledged 
                                           ? 'bg-green-50 border-green-200 text-green-700' 
                                           : 'bg-white border-brand-accent text-brand-accent hover:bg-brand-accent/5'
                                       }`}
                                     >
                                        <CheckCircle2 size={12} />
                                        {selectedStep.customerAcknowledged ? 'Approved by You' : 'Approve Project Stage'}
                                     </button>
                                     <div className={`px-3 py-2 text-[10px] font-bold rounded-lg border flex items-center gap-1.5 ${
                                       selectedStep.adminAcknowledged
                                         ? 'bg-green-50 border-green-200 text-green-700'
                                         : 'bg-slate-50 border-slate-200 text-slate-500'
                                     }`}>
                                        {selectedStep.adminAcknowledged ? 'Approved by Admin' : 'Awaiting Admin Approval'}
                                     </div>
                                  </div>
                               </div>
                             )}
                          </div>
                        ) : (
                          <div className="bg-slate-100 border border-slate-200 text-center py-12 text-slate-400 rounded-2xl flex flex-col items-center justify-center p-6 text-sm">
                             <HelpCircle size={32} className="mb-2 opacity-50" />
                             <p className="font-semibold">No step selected</p>
                             <p className="text-xs mt-1">Select any action item from the workflow checklist to answer, upload files, or approve milestones.</p>
                          </div>
                        )}
                     </div>
                  </div>
                )}

                {/* 3. Visual Gallery Tab */}
                {activeTab === 'gallery' && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 animate-scale-up">
                     <div className="flex justify-between items-center">
                        <h3 className="text-lg font-black text-brand-900 flex items-center gap-2">
                          <ImageIcon size={18} className="text-brand-accent" /> Site Photo Stream
                        </h3>
                        <span className="text-xs text-slate-400 font-medium">{(project.gallery || []).length} site photos</span>
                     </div>
                     
                     {(project.gallery && project.gallery.length > 0) ? (
                       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                          {project.gallery.map((img: string, idx: number) => (
                            <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all">
                               <img 
                                 src={img} 
                                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                 alt={`Site Progress ${idx}`} 
                               />
                               <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/20 transition-colors"></div>
                            </div>
                          ))}
                       </div>
                     ) : (
                       <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                          <ImageIcon size={36} className="mx-auto mb-2 opacity-40" />
                          <p className="font-semibold text-sm">No photos uploaded</p>
                          <p className="text-xs mt-1">Your builder hasn't uploaded photos of your site progress yet.</p>
                       </div>
                     )}
                  </div>
                )}

                {/* 4. Financials Tab */}
                {activeTab === 'financials' && (
                  <div className="space-y-6 animate-scale-up">
                     <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                           <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
                             <IndianRupee size={24} />
                           </div>
                           <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-bold">Total Budget</span>
                              <h4 className="text-2xl font-black text-brand-900">₹{(project.budget || 0).toLocaleString()}</h4>
                           </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                           <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
                             <IndianRupee size={24} />
                           </div>
                           <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-bold">Spent to Date</span>
                              <h4 className="text-2xl font-black text-brand-900">₹{(project.spent || 0).toLocaleString()}</h4>
                           </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                           <div className="p-3 bg-green-50 rounded-xl text-green-700">
                             <IndianRupee size={24} />
                           </div>
                           <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-bold">Paid Batch</span>
                              <h4 className="text-2xl font-black text-brand-900">₹{(project.spent || 0).toLocaleString()}</h4>
                           </div>
                        </div>
                     </div>

                     {/* Invoices List */}
                     <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-black text-brand-900 mb-6">Payment Schedule & Invoices</h3>
                        {(project.invoices && project.invoices.length > 0) ? (
                          <div className="overflow-x-auto">
                             <table className="w-full">
                               <thead>
                                  <tr className="text-left border-b border-slate-100 text-slate-400 text-xs uppercase font-extrabold tracking-wider">
                                     <th className="pb-3">Invoice No</th>
                                     <th className="pb-3">Stage</th>
                                     <th className="pb-3">Date</th>
                                     <th className="pb-3">Status</th>
                                     <th className="pb-3 text-right">Amount</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100 text-sm">
                                  {project.invoices.map((inv: any) => (
                                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                       <td className="py-4 font-bold text-slate-800">{inv.invoiceNumber || inv.id}</td>
                                       <td className="py-4 text-slate-600">{inv.stage || 'Advance'}</td>
                                       <td className="py-4 text-slate-500">
                                         {inv.date ? new Date(inv.date).toLocaleDateString() : 'N/A'}
                                       </td>
                                       <td className="py-4">
                                          <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-bold ${
                                            inv.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                          }`}>
                                             {inv.status}
                                          </span>
                                       </td>
                                       <td className="py-4 font-bold text-right text-slate-800">₹{(inv.amount || 0).toLocaleString()}</td>
                                    </tr>
                                  ))}
                               </tbody>
                             </table>
                          </div>
                        ) : (
                          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                             <IndianRupee size={32} className="mx-auto mb-2 opacity-40" />
                             <p className="font-semibold text-sm">No invoices generated</p>
                             <p className="text-xs mt-1">There are no billing records logged for this project.</p>
                          </div>
                        )}
                     </div>
                  </div>
                )}

                {/* 5. Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 animate-scale-up">
                     <h3 className="text-lg font-black text-brand-900 flex items-center gap-2">
                       <FileText size={18} className="text-brand-accent" /> Municipal Approvals & Blueprints
                     </h3>
                     
                     {(project.documents && project.documents.length > 0) ? (
                       <div className="grid sm:grid-cols-2 gap-4">
                          {project.documents.map((doc: any) => (
                            <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-primary/20 transition-all group">
                               <div className="flex items-center gap-3">
                                  <div className="p-3 bg-white border border-slate-200 text-brand-primary rounded-lg">
                                     <FileText size={20} />
                                  </div>
                                  <div>
                                     <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-primary transition-colors truncate max-w-[200px] sm:max-w-xs">{doc.name}</h4>
                                     <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{doc.type || 'PDF'} • {doc.size || 'Unknown Size'}</p>
                                  </div>
                               </div>
                               <button 
                                 onClick={() => window.open(doc.url || '#', '_blank')}
                                 className="p-2 text-slate-400 hover:text-brand-primary hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 shadow-sm"
                               >
                                  <Download size={16} />
                               </button>
                            </div>
                          ))}
                       </div>
                     ) : (
                       <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                          <FileText size={36} className="mx-auto mb-2 opacity-40" />
                          <p className="font-semibold text-sm">No files uploaded</p>
                          <p className="text-xs mt-1">There are no blueprints, agreements, or approvals attached to your profile.</p>
                       </div>
                     )}
                  </div>
                )}
             </div>
           </>
          ) : (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
               <Building size={48} className="mx-auto mb-3 text-slate-300" />
               <h2 className="text-xl font-bold text-slate-800">No project associated with your account</h2>
               <p className="text-slate-500 text-sm mt-1">Please contact your D Square Admin/Supervisor to link your client account to your building project.</p>
            </div>
          )}
      </main>
    </div>
  );
};

export default CustomerPortal;
