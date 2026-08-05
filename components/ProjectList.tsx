
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../ProjectContext';
import { useAuth } from '../AuthContext';
import { ArrowRight, Calendar, IndianRupee, MapPin, X, CheckCircle, Clock, Circle, ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const { projects, deleteProject } = useProjects();
  const { isAdmin, isSuperAdmin } = useAuth();
  const [expandedProgressId, setExpandedProgressId] = useState<string | null>(null);
  
  // Delete Modal State
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleProgressClick = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    setExpandedProgressId(expandedProgressId === projectId ? null : projectId);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
       <ConfirmationModal 
         isOpen={!!projectToDelete}
         onClose={() => setProjectToDelete(null)}
         onConfirm={confirmDelete}
         title="Delete Project"
         message="Are you sure you want to delete this project? This action cannot be undone and all associated data will be lost."
         confirmText="Delete Project"
         isDestructive={true}
       />

       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">All Projects</h2>
          <p className="text-slate-500">Manage ongoing construction sites.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => navigate('/app/projects/new')}
            className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-brand-primary/20"
          >
            + New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => (
          <div 
            key={project.id} 
            onClick={() => navigate(`/app/projects/${project.id}`)}
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col"
          >
            <div className="h-48 bg-slate-200 relative overflow-hidden shrink-0">
              <img 
                src={project.thumbnail} 
                alt={project.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-primary shadow-sm uppercase tracking-wide">
                {project.status}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{project.name}</h3>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/app/projects/${project.id}/edit`);
                        }}
                        className="text-slate-400 hover:text-brand-primary p-1.5 hover:bg-slate-100 rounded-full transition-colors shrink-0"
                        title="Edit Project"
                      >
                        <Edit2 size={16} />
                      </button>
                      {isSuperAdmin && (
                        <button 
                          onClick={(e) => {
                              e.stopPropagation();
                              setProjectToDelete(project.id);
                          }}
                          className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-full transition-colors shrink-0"
                          title="Delete Project"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  )}
              </div>

              <p className="text-slate-500 text-sm mb-4 flex items-center gap-1">
                <MapPin size={14} /> {project.location}
              </p>

              <div className="mb-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">Progress</span>
                  <span className="text-brand-primary font-bold">{project.progress}%</span>
                </div>
                
                <div 
                  onClick={(e) => handleProgressClick(e, project.id)}
                  className="h-3 w-full bg-slate-100 rounded-full overflow-hidden cursor-pointer relative group/bar hover:ring-2 hover:ring-brand-primary/20 transition-all"
                  title="Click to toggle details"
                >
                  <div 
                    className="h-full bg-brand-primary rounded-full transition-all duration-1000 group-hover/bar:bg-brand-accent" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                
                <button 
                  onClick={(e) => handleProgressClick(e, project.id)}
                  className="flex items-center justify-end gap-1 w-full text-[10px] text-slate-400 mt-1 hover:text-brand-primary transition-colors outline-none"
                >
                  {expandedProgressId === project.id ? 'Hide breakdown' : 'View breakdown'}
                  {expandedProgressId === project.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                {expandedProgressId === project.id && (
                  <div className="mt-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm animate-in slide-in-from-top-2 fade-in duration-200 shadow-inner">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200">
                        <span className="font-bold text-brand-900 text-xs uppercase tracking-wider">Milestone Status</span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setExpandedProgressId(null); }}
                            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-full transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                    <div className="space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                        {project.milestones.length > 0 ? project.milestones.map(m => (
                            <div key={m.id} className="flex items-center justify-between group/item">
                                <div className="flex items-center gap-2 min-w-0">
                                  {m.status === 'Completed' ? <CheckCircle size={14} className="text-green-500 shrink-0" /> :
                                   m.status === 'In Progress' ? <Clock size={14} className="text-brand-primary shrink-0" /> :
                                   <Circle size={14} className="text-slate-300 shrink-0" />}
                                  <span className={`truncate text-xs ${m.status === 'Completed' ? 'text-slate-500 line-through' : 'text-slate-700 font-medium'}`}>
                                      {m.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[10px] text-slate-400">{m.date}</span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${
                                      m.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                      m.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                      'bg-slate-200 text-slate-500'
                                  }`}>
                                      {m.status === 'In Progress' ? 'Active' : m.status}
                                  </span>
                                </div>
                            </div>
                        )) : <p className="text-xs text-slate-400 italic text-center py-2">No milestones defined yet.</p>}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <IndianRupee size={12} /> Budget
                  </div>
                  <p className="text-slate-800 font-semibold text-sm">₹{(project.budget / 100000).toFixed(1)}L</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Calendar size={12} /> Deadline
                  </div>
                  <p className="text-slate-800 font-semibold text-sm">{project.deadline}</p>
                </div>
              </div>

              <div className="w-full py-3 border border-brand-primary text-brand-primary rounded-xl font-medium hover:bg-brand-primary hover:text-white transition-colors flex items-center justify-center gap-2">
                View Details <ArrowRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
