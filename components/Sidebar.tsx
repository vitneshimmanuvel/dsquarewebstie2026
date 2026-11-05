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
  userName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  role, 
  onLogout, 
  isOpen, 
  onClose, 
  unreadCount = 0,
  userName
}) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const displayName = userName || (role === UserRole.CLIENT ? 'Rajesh Gupta' : 'D Square Admin');
  const displayInitials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('') || (role === UserRole.CLIENT ? 'RG' : 'DA');

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

      {/* Sidebar Container - Flex column layout to keep bottom user card & logout visible */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-brand-900 border-r border-brand-800 z-50 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding Header */}
        <div className="p-6 flex flex-col items-start border-b border-brand-800 shrink-0">
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

        {/* Navigation Menu (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
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

          {/* Explicit In-Menu Logout button */}
          <div className="pt-2">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-all duration-200 border border-red-500/20"
            >
              <LogOut size={18} className="text-red-400" />
              <span className="font-bold text-xs uppercase tracking-wider">Log Out</span>
            </button>
          </div>
        </div>

        {/* Bottom Profile Card with Direct Logout Button */}
        <div className="shrink-0 p-4 bg-brand-950 border-t border-brand-800 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold shadow-md shrink-0 text-sm">
              {displayInitials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-bold truncate leading-tight">{displayName}</p>
              <p className="text-slate-400 text-[11px] capitalize truncate mt-0.5">{role.replace('_', ' ').toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Log out of session"
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-red-600/30 transition-all shrink-0 border border-transparent hover:border-red-500/40 ml-2 group"
          >
            <LogOut size={18} className="text-slate-400 group-hover:text-red-400" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
