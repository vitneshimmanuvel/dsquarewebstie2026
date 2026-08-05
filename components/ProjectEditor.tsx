
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../ProjectContext';
import { useAuth } from '../AuthContext';
import { Project, Milestone, BudgetItem } from '../types';
import { Save, ArrowLeft, Plus, Trash2, Calendar, IndianRupee, MapPin, Layout, User, Image, Upload, Calculator } from 'lucide-react';
import BudgetPlanner from './BudgetPlanner';

const ProjectEditor: React.FC = () => {
  const { id } = useParams();
  const useNavigateHook = useNavigate();
  const navigate = useNavigateHook;
  const { getProject, updateProject, addProject } = useProjects();
  const { isSuperAdmin } = useAuth();
  const [formData, setFormData] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isBudgetPlannerOpen, setIsBudgetPlannerOpen] = useState(false);

  const isNew = !id;

  useEffect(() => {
    if (isNew) {
      setFormData({
        id: `p${Date.now()}`,
        name: '',
        clientName: '',
        location: '',
        status: 'Planning',
        progress: 0,
        startDate: new Date().toISOString().split('T')[0],
        deadline: '',
        budget: 0,
        spent: 0,
        thumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
        description: '',
        milestones: [],
        documents: [],
        invoices: [],
        gallery: [],
        budgetPlan: []
      });
    } else {
      const project = getProject(id);
      if (project) {
        setFormData(JSON.parse(JSON.stringify(project)));
      } else {
        navigate('/app/projects');
      }
    }
  }, [id, getProject, navigate, isNew]);

  if (!formData) return <div className="p-8 text-center">Loading editor...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({ ...prev, [name]: parseFloat(value) || 0 }) : null);
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => prev ? ({ ...prev, thumbnail: reader.result as string }) : null);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleMilestoneChange = (index: number, field: keyof Milestone, value: any) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
    setFormData(prev => prev ? ({ ...prev, milestones: updatedMilestones }) : null);
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `m-${Date.now()}`,
      title: 'New Milestone',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      description: ''
    };
    setFormData(prev => prev ? ({ ...prev, milestones: [...prev.milestones, newMilestone] }) : null);
  };

  const removeMilestone = (index: number) => {
    const updatedMilestones = formData.milestones.filter((_, i) => i !== index);
    setFormData(prev => prev ? ({ ...prev, milestones: updatedMilestones }) : null);
  };

  const handleSave = () => {
    if (formData) {
      setIsSaving(true);
      setTimeout(() => {
        if (isNew) {
           addProject(formData);
        } else {
           updateProject(id!, formData);
        }
        setIsSaving(false);
        navigate(isNew ? '/app/projects' : `/app/projects/${id}`);
      }, 800);
    }
  };

  const handleBudgetPlanSave = (total: number, plan: BudgetItem[]) => {
    setFormData(prev => prev ? ({ ...prev, budget: total, budgetPlan: plan }) : null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <BudgetPlanner 
        isOpen={isBudgetPlannerOpen}
        onClose={() => setIsBudgetPlannerOpen(false)}
        onSave={handleBudgetPlanSave}
        initialPlan={formData.budgetPlan}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-0 z-20">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 mb-1 hover:text-brand-primary">
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold text-brand-900">{isNew ? 'Create New Project' : `Edit: ${formData.name}`}</h1>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={() => navigate(-1)} className="px-6 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 flex-1 sm:flex-none">
            Cancel
          </button>
          <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-800 flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 flex-1 sm:flex-none disabled:opacity-70">
            {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Save size={20} />}
            {isNew ? 'Create Project' : 'Save Changes'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-brand-900 mb-6 flex items-center gap-2">
              <Layout size={20} className="text-brand-accent" /> General Information
            </h3>
            
            <div className="mb-6 pb-6 border-b border-slate-100">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Project Thumbnail</label>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-24 h-24 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative flex items-center justify-center group">
                  {formData.thumbnail ? (
                    <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <Image size={24} className="text-slate-400" />
                  )}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1 w-full">
                  <div className="relative">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 transition-all cursor-pointer border border-slate-200 rounded-lg p-1"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <Upload size={12} /> Upload a high-quality cover image (JPG/PNG).
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Project Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Skyline Apartments" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none font-semibold text-slate-800" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><User size={12}/> Client Name</label>
                  <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><MapPin size={12}/> Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-brand-900 flex items-center gap-2">
                <Calendar size={20} className="text-brand-accent" /> Timeline & Stages
              </h3>
              <button onClick={addMilestone} className="text-sm text-brand-primary font-bold hover:underline flex items-center gap-1">
                <Plus size={16} /> Add Stage
              </button>
            </div>
            <div className="space-y-4">
              {formData.milestones.map((milestone, index) => (
                <div key={milestone.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 group">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-2">
                    <div className="flex-1 w-full">
                      <input type="text" value={milestone.title} onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)} className="w-full bg-transparent font-bold text-slate-800 border-b border-transparent focus:border-brand-primary outline-none placeholder-slate-400" placeholder="Stage Title"/>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <input type="date" value={milestone.date} onChange={(e) => handleMilestoneChange(index, 'date', e.target.value)} className="bg-white border border-slate-200 text-xs rounded px-2 py-1" />
                      <select value={milestone.status} onChange={(e) => handleMilestoneChange(index, 'status', e.target.value)} className={`text-xs rounded px-2 py-1 font-bold outline-none border border-slate-200 ${milestone.status === 'Completed' ? 'text-green-600 bg-green-50' : milestone.status === 'In Progress' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 bg-white'}`}>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button onClick={() => removeMilestone(index)} className="text-slate-400 hover:text-red-500 px-1"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <input type="text" value={milestone.description || ''} onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)} placeholder="Optional description..." className="w-full text-sm text-slate-500 bg-transparent outline-none border-none p-0"/>
                </div>
              ))}
              {formData.milestones.length === 0 && (
                <div className="text-center py-4 text-slate-400 text-sm italic">No stages defined. Add one above.</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-800 mb-4">Project Status</h3>
             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Phase</label>
                 <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary font-medium">
                   <option value="Planning">Planning</option>
                   <option value="Foundation">Foundation</option>
                   <option value="Structure">Structure</option>
                   <option value="Finishing">Finishing</option>
                   <option value="Completed">Completed</option>
                 </select>
               </div>
               <div>
                 <div className="flex justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Progress</label>
                    <span className="text-xs font-bold text-brand-primary">{formData.progress}%</span>
                 </div>
                 <input type="range" name="progress" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"/>
               </div>
               <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deadline</label>
                    <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm" />
                  </div>
               </div>
             </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <IndianRupee size={18} /> Financials
               </h3>
               {isSuperAdmin && (
                 <button 
                   onClick={() => setIsBudgetPlannerOpen(true)}
                   className="text-[10px] font-bold text-brand-primary bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1 transition-colors"
                   title="Open Budget Planner"
                 >
                   <Calculator size={12} /> Plan Budget
                 </button>
               )}
             </div>
             <div className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Budget</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <input type="number" name="budget" value={formData.budget} onChange={handleNumberChange} className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary"/>
                  </div>
                  {isSuperAdmin && formData.budgetPlan && formData.budgetPlan.length > 0 && (
                    <p className="text-[10px] text-slate-400 mt-1 italic">
                      Calculated from {formData.budgetPlan.length} plan items.
                    </p>
                  )}
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount Spent</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <input type="number" name="spent" value={formData.spent} onChange={handleNumberChange} className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-brand-primary"/>
                  </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;
