import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { UserRole, User } from './types';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import ProjectEditor from './components/ProjectEditor';
import MaterialManager from './components/MaterialManager';
import WorkforceManager from './components/WorkforceManager';
import NotificationCenter from './components/NotificationCenter';
import NotificationsPage from './components/NotificationsPage';
import DocumentManager from './components/Documents';
import Financials from './components/Financials';
import CustomerPortal from './components/CustomerPortal';
import ServicesPage from './components/ServicesPage';
import AboutPage from './components/AboutPage';
import ProjectsPage from './components/ProjectsPage';
import ContactPage from './components/ContactPage';
import GetQuotePage from './components/GetQuotePage';
import TestimonialsManager from './components/TestimonialsManager';
import { ProjectProvider } from './ProjectContext';
import { NotificationProvider, useNotifications } from './NotificationContext';
import { DataProvider } from './DataContext';
import { AuthProvider, useAuth } from './AuthContext';
import { Menu, Bell, Loader2, Lock, Mail, Eye, EyeOff, ArrowUp, LogOut } from 'lucide-react';

const PublicLayout: React.FC<{
  onLoginClick: () => void;
  highlightContact: boolean;
  setHighlightContact: (val: boolean) => void;
}> = ({ onLoginClick, highlightContact, setHighlightContact }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
             <div className="w-10 h-10 border-2 border-brand-accent rounded bg-white flex items-center justify-center shadow-sm">
               <span className="text-brand-accent font-bold text-2xl leading-none pt-1">D</span>
               <span className="text-brand-accent font-bold text-xs leading-none self-start -ml-0.5">2</span>
             </div>
             <div className="flex flex-col">
                <span className="text-brand-primary font-bold text-lg leading-none tracking-tight">D SQUARE</span>
                <span className="text-brand-accent font-bold text-sm leading-none tracking-wide">INFRAZONE</span>
             </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => navigate('/')} 
              className={`transition-colors py-2 relative group ${isActive('/') ? 'text-brand-primary font-bold' : 'hover:text-brand-primary'}`}
            >
              Home
              <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-primary transition-all duration-300 ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
            <button 
              onClick={() => navigate('/services')} 
              className={`transition-colors py-2 relative group ${isActive('/services') ? 'text-brand-primary font-bold' : 'hover:text-brand-primary'}`}
            >
              Services
              <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-primary transition-all duration-300 ${isActive('/services') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
            <button 
              onClick={() => navigate('/get-quote')} 
              className={`transition-colors py-2 relative group ${isActive('/get-quote') ? 'text-brand-primary font-bold' : 'hover:text-brand-primary'}`}
            >
              Get Quote
              <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-primary transition-all duration-300 ${isActive('/get-quote') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
            <button 
              onClick={() => navigate('/about')} 
              className={`transition-colors py-2 relative group ${isActive('/about') ? 'text-brand-primary font-bold' : 'hover:text-brand-primary'}`}
            >
              About
              <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-primary transition-all duration-300 ${isActive('/about') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
            <button 
              onClick={() => navigate('/projects')} 
              className={`transition-colors py-2 relative group ${isActive('/projects') ? 'text-brand-primary font-bold' : 'hover:text-brand-primary'}`}
            >
              Projects
              <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-primary transition-all duration-300 ${isActive('/projects') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
            <button 
              onClick={() => navigate('/contact')} 
              className={`transition-colors py-2 relative group ${isActive('/contact') ? 'text-brand-primary font-bold' : 'hover:text-brand-primary'}`}
            >
              Contact
              <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-primary transition-all duration-300 ${isActive('/contact') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
          </div>
          
          <button 
            onClick={onLoginClick}
            className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-900 transition-all shadow-lg shadow-brand-primary/20 hover:-translate-y-0.5 active:translate-y-0 duration-200 animate-scale-up flex items-center gap-2"
          >
            <Lock size={15} /> Sign In 
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-brand-950 text-slate-400 py-12 border-t border-brand-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
             <div className="w-8 h-8 border border-brand-accent rounded flex items-center justify-center bg-white shadow-sm">
               <span className="text-brand-accent font-bold text-lg leading-none pt-0.5">D</span>
               <span className="text-brand-accent font-bold text-[10px] leading-none self-start -ml-0.5">2</span>
             </div>
             <div className="flex flex-col">
                <span className="text-white font-bold text-sm leading-none">D SQUARE</span>
                <span className="text-brand-accent font-bold text-xs leading-none">INFRAZONE</span>
             </div>
          </div>
          <div className="flex gap-6 text-sm">
            <button className="hover:text-white transition-colors" onClick={() => navigate('/about')}>About Us</button>
            <button className="hover:text-white transition-colors" onClick={() => navigate('/services')}>Services</button>
            <button className="hover:text-white transition-colors" onClick={() => navigate('/contact')}>Contact Support</button>
            <button className="hover:text-brand-accent transition-colors font-bold text-xs" onClick={onLoginClick}>Admin / Client Login</button>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            © 2026 D Square Constructions. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-4 bg-brand-primary text-white rounded-full shadow-2xl hover:bg-brand-800 transition-all hover:-translate-y-1 z-50 border border-white/10"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

const ProtectedLayout: React.FC<{
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const titleMap: Record<string, string> = {
    '/app/dashboard': 'Dashboard',
    '/app/projects': 'Projects',
    '/app/projects/new': 'New Project',
    '/app/materials': 'Materials',
    '/app/workforce': 'Workforce',
    '/app/finance': 'Financials',
    '/app/documents': 'Documents',
    '/app/reports': 'Reports',
    '/app/notifications': 'Notifications'
  };
  
  let currentTitle = titleMap[location.pathname] || 'D Square Infozone';
  if(location.pathname.includes('/app/projects/')) {
      if(location.pathname.includes('/edit')) currentTitle = 'Edit Project';
      else if(location.pathname.includes('/new')) currentTitle = 'Create Project';
      else currentTitle = 'Project Details';
  }

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();

  if (!user) return <Navigate to="/" />;

  // Redirect customers to the landing path, they will be caught by CustomerPortal router
  if (user.role === UserRole.CUSTOMER) return <Navigate to="/client" />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      <Sidebar 
        role={user.role} 
        onLogout={logout} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        unreadCount={unreadCount}
        userName={user.name}
      />
      
      <div className="flex-1 md:ml-72 flex flex-col min-w-0">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setSidebarOpen(true)}
               className="md:hidden text-slate-500 hover:text-slate-800"
             >
               <Menu size={24} />
             </button>
             <h1 className="text-xl font-bold text-slate-800 hidden sm:block">{currentTitle}</h1>
           </div>
           <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className={`relative p-2 rounded-full transition-all duration-200 ${isNotificationOpen ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-brand-accent rounded-full border border-white ring-1 ring-white"></span>
                  )}
                </button>
                <NotificationCenter 
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                  notifications={notifications}
                  onMarkAsRead={markAsRead}
                  onMarkAllRead={markAllAsRead}
                />
              </div>

              {/* Top Header Logout Button */}
              <button 
                onClick={logout}
                title="Sign Out"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-bold transition-all shadow-sm"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
           </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto animate-scale-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, login, isLoading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      if (!user && (window.location.hash === '#/login' || window.location.hash === '#/admin')) {
        setIsLoginOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [user]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [highlightContact, setHighlightContact] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    
    try {
      const res = await login(email, password);
      if (res.success) {
        setIsLoginOpen(false);
        setEmail('');
        setPassword('');
      } else {
        setErrorMsg(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setErrorMsg('Connection error. Is the server running?');
    } finally {
      setIsSubmitting(false);
    }
  };
  const LoginModal = () => {
    if (!isLoginOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100 animate-scale-up relative">
          <div className="flex justify-between items-start mb-6">
             <div>
               <h2 className="text-2xl font-black text-brand-900 leading-tight">Sign In</h2>
               <p className="text-slate-400 text-xs mt-1">Access your turn-key construction project logs</p>
             </div>
             <button 
               onClick={() => { setIsLoginOpen(false); setErrorMsg(''); }} 
               className="text-slate-400 hover:text-slate-600 font-bold text-sm"
             >
               Close
             </button>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4 border border-red-100 text-xs font-semibold">
               {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={16} />
                </span>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-primary text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={16} />
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-primary text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-primary hover:bg-brand-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 text-sm disabled:opacity-75"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="text-center pt-6 mt-6 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => {
                setIsLoginOpen(false);
                setErrorMsg('');
                setHighlightContact(true);
                window.location.hash = '#/contact';
              }}
              className="text-xs text-brand-primary hover:underline font-bold text-center w-full"
            >
              New to D Square? Create an account (Request Setup)
            </button>
          </div>
        </div>
      </div>
    );
  };;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
         <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
         <p className="text-slate-500 font-medium">Securing connection to Infrazone Server...</p>
      </div>
    );
  }

  return (
    <Router>
      <LoginModal />
      <Routes>
        {/* Public Routes wrapped in PublicLayout */}
        <Route element={
          <PublicLayout 
            onLoginClick={() => setIsLoginOpen(true)} 
            highlightContact={highlightContact}
            setHighlightContact={setHighlightContact}
          />
        }>
          <Route 
            path="/" 
            element={
              user 
                ? (user.role === UserRole.CUSTOMER ? <Navigate to="/client" replace /> : <Navigate to="/app/dashboard" replace />) 
                : <LandingPage onLoginClick={() => setIsLoginOpen(true)} />
            } 
          />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/get-quote" element={<GetQuotePage />} />
          <Route path="/quote" element={<GetQuotePage />} />
          <Route 
            path="/login" 
            element={
              user 
                ? (user.role === UserRole.CUSTOMER ? <Navigate to="/client" replace /> : <Navigate to="/app/dashboard" replace />) 
                : <LandingPage onLoginClick={() => setIsLoginOpen(true)} />
            } 
          />
          <Route 
            path="/admin" 
            element={
              user 
                ? (user.role === UserRole.CUSTOMER ? <Navigate to="/client" replace /> : <Navigate to="/app/dashboard" replace />) 
                : <LandingPage onLoginClick={() => setIsLoginOpen(true)} />
            } 
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route 
            path="/contact" 
            element={
              <ContactPage 
                highlightContact={highlightContact} 
                setHighlightContact={setHighlightContact} 
              />
            } 
          />
          <Route 
            path="/register" 
            element={
              <ContactPage 
                highlightContact={true} 
                setHighlightContact={setHighlightContact} 
              />
            } 
          />
          <Route 
            path="/signup" 
            element={
              <ContactPage 
                highlightContact={true} 
                setHighlightContact={setHighlightContact} 
              />
            } 
          />
        </Route>
        
        {/* Customer Routing Path */}
        <Route 
          path="/client" 
          element={
            user && user.role === UserRole.CUSTOMER 
              ? <CustomerPortal /> 
              : <Navigate to="/" replace />
          } 
        />

        {/* Administrative Routing Path */}
        <Route element={
          <ProtectedLayout 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
          />
        }>
          <Route path="/app/dashboard" element={<Dashboard role={user?.role || UserRole.CUSTOMER} />} />
          <Route path="/app/projects" element={<ProjectList />} />
          <Route path="/app/projects/new" element={<ProjectEditor />} />
          <Route path="/app/projects/:id" element={<ProjectDetails />} />
          <Route path="/app/projects/:id/edit" element={<ProjectEditor />} />
          
          <Route path="/app/materials" element={<MaterialManager />} />
          <Route path="/app/workforce" element={<WorkforceManager />} />
          <Route path="/app/finance" element={<Financials />} />
          <Route path="/app/documents" element={<DocumentManager />} />
          <Route path="/app/notifications" element={<NotificationsPage />} />
          <Route path="/app/testimonials" element={<TestimonialsManager />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProjectProvider>
        <NotificationProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </NotificationProvider>
      </ProjectProvider>
    </AuthProvider>
  );
};

export default App;