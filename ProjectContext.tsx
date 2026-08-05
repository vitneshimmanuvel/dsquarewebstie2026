import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Project } from './types';
import { useAuth, API_BASE } from './AuthContext';

interface ProjectContextType {
  projects: Project[];
  isLoading: boolean;
  updateProject: (id: string, updates: Partial<Project>) => Promise<boolean>;
  addProject: (project: any) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  getProject: (id: string) => Project | undefined;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, token } = useAuth();

  const refreshProjects = async () => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) {
      setProjects([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });
      const data = await res.json();
      if (data.success && data.data) {
        // Map backend Project data structure to our frontend types if necessary
        const mapped: Project[] = data.data.map((p: any) => {
          // Status mapping
          let status = p.status.charAt(0) + p.status.slice(1).toLowerCase();
          if (p.status === 'PLANNING') status = 'Planning';
          else if (p.status === 'FOUNDATION') status = 'Foundation';
          else if (p.status === 'STRUCTURE') status = 'Structure';
          else if (p.status === 'FINISHING') status = 'Finishing';
          else if (p.status === 'COMPLETED') status = 'Completed';

          return {
            id: p.id,
            name: p.name,
            clientName: p.clientName || 'N/A',
            location: p.location || 'N/A',
            status: status as any,
            progress: p.progress || 0,
            startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : '',
            deadline: p.deadline ? new Date(p.deadline).toISOString().split('T')[0] : '',
            budget: p.budget || 0,
            spent: p.spent || 0,
            thumbnail: p.thumbnail || 'https://images.unsplash.com/photo-1600596542815-2ad4d9a44566?auto=format&fit=crop&w=600&q=80',
            description: p.description || '',
            milestones: (p.milestones || []).map((m: any) => ({
              id: m.id,
              title: m.title,
              date: m.date ? new Date(m.date).toISOString().split('T')[0] : '',
              status: m.status === 'COMPLETED' ? 'Completed' : m.status === 'IN_PROGRESS' ? 'In Progress' : 'Pending',
              description: m.description || ''
            })),
            documents: (p.documents || []).map((d: any) => ({
              id: d.id,
              name: d.name,
              type: d.type || 'PDF',
              date: d.uploadedAt ? new Date(d.uploadedAt).toISOString().split('T')[0] : '',
              size: d.size || 'N/A'
            })),
            invoices: (p.invoices || []).map((inv: any) => ({
              id: inv.id,
              number: inv.invoiceNumber || inv.id,
              amount: inv.amount || 0,
              date: inv.date ? new Date(inv.date).toISOString().split('T')[0] : '',
              status: inv.status === 'PAID' ? 'Paid' : inv.status === 'PENDING' ? 'Pending' : 'Overdue',
              stage: inv.stage || ''
            })),
            gallery: p.gallery || []
          };
        });
        setProjects(mapped);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, [user, token]);

  const addProject = async (projectData: any) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return false;
    try {
      // Map status back to uppercase enum
      const statusMap: any = {
        'Planning': 'PLANNING',
        'Foundation': 'FOUNDATION',
        'Structure': 'STRUCTURE',
        'Finishing': 'FINISHING',
        'Completed': 'COMPLETED'
      };
      
      const payload = {
        ...projectData,
        status: statusMap[projectData.status] || 'PLANNING'
      };

      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        await refreshProjects();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding project:', err);
      return false;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return false;
    try {
      const statusMap: any = {
        'Planning': 'PLANNING',
        'Foundation': 'FOUNDATION',
        'Structure': 'STRUCTURE',
        'Finishing': 'FINISHING',
        'Completed': 'COMPLETED'
      };

      const payload: any = { ...updates };
      if (updates.status) {
        payload.status = statusMap[updates.status] || 'PLANNING';
      }

      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        await refreshProjects();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating project:', err);
      return false;
    }
  };

  const deleteProject = async (id: string) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return false;
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        await refreshProjects();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting project:', err);
      return false;
    }
  };

  const getProject = (id: string) => {
    return projects.find(p => p.id === id);
  };

  return (
    <ProjectContext.Provider value={{ projects, isLoading, updateProject, addProject, deleteProject, getProject, refreshProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
