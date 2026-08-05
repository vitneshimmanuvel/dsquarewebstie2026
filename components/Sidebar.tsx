
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Truck, 
  Users, 
  FileText, 
  IndianRupee, 
  LogOut,
  PieChart,
  Bell,
  MessageSquare
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  unreadCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout, isOpen, onClose, unreadCount = 0 }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ path, icon: Icon, label, badge }: { path: string, icon: any, label: string, badge?: number }) => (
    <Link
      to={path}
      onClick={onClose}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive(path) 
          ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' 
          : 'text-slate-400 hover:bg-brand-800 hover:text-white'
      }`}
    >
      <Icon size={20} className={isActive(path) ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
      <span className="font-medium flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-brand-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          {badge}
        </span>
      )}
    </Link>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-brand-900 border-r border-brand-800 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col items-start border-b border-brand-800">
          {/* Text Logo Representation */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 border-2 border-brand-accent rounded-lg flex items-center justify-center bg-white shrink-0">
              <span className="text-brand-accent font-bold text-3xl leading-none pt-1">D</span>
              <span className="text-brand-accent font-bold text-sm leading-none self-start -ml-1">2</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white font-bold text-xl leading-none tracking-tight">D SQUARE</h1>
              <h1 className="text-brand-accent font-bold text-lg leading-none tracking-wide">INFRAZONE</h1>
            </div>
          </div>
          <div className="bg-brand-primary px-2 py-0.5 w-full text-center rounded-sm mt-1">
             <p className="text-[10px] text-white font-medium tracking-widest uppercase">Creating Dreams With Beams</p>
          </div>
        </div>

        <div className="px-4 py-6 flex flex-col h-[calc(100%-140px)] justify-between">
          <div className="space-y-6">
            <div>
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
              <div className="space-y-1">
                <NavItem path="/app/dashboard" icon={LayoutDashboard} label="Dashboard" />
                
                {(role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) && (
                  <>
                    <NavItem path="/app/projects" icon={Building2} label="Projects" />
                    <NavItem path="/app/materials" icon={Truck} label="Materials" />
                    <NavItem path="/app/workforce" icon={Users} label="Workforce" />
                    <NavItem path="/app/finance" icon={IndianRupee} label="Financials" />
                    <NavItem path="/app/testimonials" icon={MessageSquare} label="Testimonials" />
                  </>
                )}

                {role === UserRole.CLIENT && (
                   <NavItem path="/app/my-project" icon={Building2} label="My Project" />
                )}
              </div>
            </div>

            <div>
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">System</p>
              <div className="space-y-1">
                <NavItem path="/app/notifications" icon={Bell} label="Notifications" badge={unreadCount} />
                {(role === UserRole.SUPER_ADMIN) && (
                  <NavItem path="/app/reports" icon={PieChart} label="Analytics" />
                )}
                 <NavItem path="/app/documents" icon={FileText} label="Documents" />
              </div>
            </div>
          </div>

          <div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 w-full p-4 bg-brand-950 border-t border-brand-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold shadow-md">
              {role === UserRole.CLIENT ? 'RG' : 'SK'}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{role === UserRole.CLIENT ? 'Rajesh Gupta' : 'Suresh Kumar'}</p>
              <p className="text-slate-400 text-xs capitalize">{role.replace('_', ' ').toLowerCase()}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
