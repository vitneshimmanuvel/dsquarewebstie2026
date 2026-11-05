import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../AuthContext';
import { ArrowRight, Video, Clock, Sparkles, Calculator, ChevronLeft, ChevronRight, Star, Quote, HardHat, Compass, FileText, Smartphone, ClipboardCheck, Leaf, Layers, Building2, Shield, Activity, Award, HelpCircle, ChevronDown, Check, Zap, MapPin } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
];


interface AdvantageItem {
  title: string;
  tag: string;
  desc: string;
  img: string;
  fallbackImg: string;
  icon: any;
  features: string[];
}

const ADVANTAGES_DATA: AdvantageItem[] = [
  {
    title: 'Soil Test',
    tag: 'Foundation Safety',
    desc: 'Geotechnical core soil tests and bearing capacity audits before footing design. Guarantees zero foundation subsidence and crack-free structures.',
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80',
    fallbackImg: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80',
    icon: Layers,
    features: ['SBC Lab Report', 'Soil Strata Mapping', 'Engineered Footings']
  },
  {
    title: 'Digital Marking',
    tag: 'Millimeter Precision',
    desc: 'Laser-guided total station digital marking on site. Ensures exact boundary alignment, square room angles, and 100% adherence to architectural CAD drawings.',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    fallbackImg: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    icon: Compass,
    features: ['Total Station Alignment', 'Vastu Coordinate Marking', 'CAD-to-Ground Mapping']
  },
  {
    title: 'Dedicated Mobile Application',
    tag: 'Real-Time Access',
    desc: 'Our proprietary D Square Infrazone mobile app keeps you connected 24/7. View material dispatches, workforce attendance, payment milestones, and live photo feeds.',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
    fallbackImg: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=600&q=80',
    icon: Smartphone,
    features: ['Live Site Feeds', 'Invoice Approval', 'Milestone Tracking']
  },
  {
    title: '24/7 CCTV Surveillance',
    tag: 'Site Security',
    desc: 'High-definition live camera feeds installed on every construction site. Monitor ongoing RCC casting, material unloading, and night-shift security in real-time.',
    img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    fallbackImg: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
    icon: Video,
    features: ['Live Streaming', 'Theft Prevention', 'Safety Protocol Monitoring']
  },
  {
    title: 'Daily Reports',
    tag: 'Complete Transparency',
    desc: 'Automated daily progress reports delivered directly to your portal. Details artisan attendance, cement bags consumed, steel curing status, and weather conditions.',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
    fallbackImg: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    icon: ClipboardCheck,
    features: ['Worker Headcount', 'Material Inflow Logs', 'Civil Engineer Sign-off']
  },
  {
    title: 'Work Progress Based on Timeline',
    tag: 'Zero Delays',
    desc: 'Strict Gantt-chart scheduled construction milestones. Every phase—from foundation and roof casting to tile finishing—is delivered according to agreed deadlines.',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
    fallbackImg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    icon: Clock,
    features: ['Milestone Deadlines', 'Stage-Wise Verification', 'On-Time Handover']
  }
];

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testiIdx, setTestiIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Background slider timer
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch public testimonials
  useEffect(() => {
    const fetchActiveTestimonials = async () => {
      try {
        const res = await fetch(`${API_BASE}/testimonials`);
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setTestimonials(data.data);
        } else {
          // Default fallbacks
          setTestimonials(DEFAULT_TESTIMONIALS);
        }
      } catch (err) {
        setTestimonials(DEFAULT_TESTIMONIALS);
      }
    };
    fetchActiveTestimonials();
  }, []);

  const handlePrevTesti = () => {
    setTestiIdx(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNextTesti = () => {
    setTestiIdx(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-slate-900 text-white rounded-3xl overflow-hidden mt-6 mx-2 sm:mx-4">
        {/* Background Slider */}
        <div className="absolute inset-0 z-0">
          {HERO_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 ${
                idx === heroIndex ? 'opacity-40 translate-x-0' : 'opacity-0 pointer-events-none'
              }`}
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-left">
            <div className="inline-flex items-center gap-2 bg-brand-primary/85 backdrop-blur-md border border-brand-primary/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
              Modern Construction Portal
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Creating Dreams <br/> 
              With <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-red-400 font-sans">Beams</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-lg border-l-4 border-brand-accent pl-6 font-medium">
              Leading turn-key construction contractors. View daily worker logs, payments, invoices, site photos, and milestones in real-time through our D Square Infrazone web portal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => navigate('/get-quote')} 
                className="bg-brand-accent text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-accent/30 hover:-translate-y-0.5"
              >
                Get Instant Quote <Calculator size={20} />
              </button>
              <button 
                onClick={onLoginClick} 
                className="bg-brand-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/30 hover:-translate-y-0.5"
              >
                Client Portal <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => navigate('/projects')} 
                className="px-6 py-4 rounded-xl font-bold text-white border-2 border-white/20 hover:border-white hover:bg-white/10 transition-all hover:-translate-y-0.5"
              >
                Projects
              </button>
            </div>
          </div>


        </div>
      </section>

      {/* Advantages Section - Added directly below Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 animate-scale-up">
            <Sparkles size={13} className="text-brand-accent animate-pulse" />
            Key Construction Advantages
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-900 tracking-tight leading-tight">
            Advantages of Choosing <br className="hidden sm:inline" />
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-red-600">
              D Square Infrazone
            </span>
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg font-medium">
            From precision soil tests to 24/7 CCTV surveillance and dedicated mobile tracking—every project is executed with turnkey assurance.
          </p>
        </div>

        {/* 6 Advantages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ADVANTAGES_DATA.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image header with overlay badge */}
                  <div className="h-52 overflow-hidden relative">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = item.fallbackImg;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
                    
                    {/* Floating Icon badge */}
                    <div className="absolute top-4 left-4 p-3 bg-brand-primary/95 text-white rounded-2xl shadow-md backdrop-blur-sm group-hover:bg-brand-accent transition-colors duration-300">
                      <Icon size={20} />
                    </div>

                    {/* Tag badge on image */}
                    <span className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-sm text-brand-900 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-sm">
                      {item.tag}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-extrabold text-brand-900 group-hover:text-brand-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Features Footer Pills */}
                <div className="p-6 pt-0 border-t border-slate-50">
                  <div className="flex flex-wrap gap-1.5 pt-4">
                    {item.features.map((feat, fIdx) => (
                      <span 
                        key={fIdx}
                        className="bg-slate-50 border border-slate-200/80 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                      >
                        <Check size={10} className="text-brand-accent" strokeWidth={3} />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 animate-scale-up">
            <Shield size={12} className="text-brand-accent animate-pulse" />
            Reliable Partner
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-900 tracking-tight">Why Choose D Square Infrazone</h2>
          <p className="text-slate-600 mt-3 font-medium">We deliver unmatched quality, digital transparency, and structured engineering.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { icon: Shield, title: 'Structure Security', desc: 'Every structure is engineered using FE550 steel bars, M20/M25 concrete castings, and undergoes rigorous load tests.' },
            { icon: Activity, title: 'Real-Time Updates', desc: 'No more guessworks. Watch daily worker counts, material dispatches, site photos, and payments directly in your portal.' },
            { icon: Zap, title: 'Expert Management', desc: 'Managed by licensed senior structural engineers, layout architects, and certified safety compliance managers.' },
            { icon: Award, title: 'ISO 9001 Standard', desc: 'Certified building processes from excavation to paint, ensuring the highest built-up quality standards in Erode.' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative group hover:shadow-lg transition-all duration-300">
                <div className="p-3 bg-brand-primary/5 text-brand-primary rounded-2xl w-fit mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                  <Icon size={24} />
                </div>
                <h4 className="font-extrabold text-slate-800 text-lg mb-2 leading-tight">{item.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works / Roadmap Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-900 tracking-tight">How It Works</h2>
          <p className="text-slate-600 mt-3 font-medium">From concept to handover—our turn-key construction project stages.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 relative">
          {[
            { step: '01', icon: FileText, title: 'Inquiry & Audit', desc: 'Submit details online; we visit the site and prepare feasibility logs.' },
            { step: '02', icon: Compass, title: '3D Designing', desc: 'Architects model premium floor plans and structural blueprints.' },
            { step: '03', icon: ClipboardCheck, title: 'Contract Signing', desc: 'Sign budget specs and activate your digital Infrazone portal.' },
            { step: '04', icon: HardHat, title: 'Execution Tracking', desc: 'Monitor sand dispatches, worker logs, and milestone details.' },
            { step: '05', icon: Smartphone, title: 'Secure Handover', desc: 'Final civil approvals and seamless turn-key home handover.' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group hover:shadow-md transition-shadow">
                <span className="absolute top-4 right-4 text-slate-100 group-hover:text-brand-accent/10 transition-colors font-black text-4xl leading-none font-mono">
                  {item.step}
                </span>
                <div className="p-3 bg-brand-primary/5 text-brand-primary rounded-xl w-fit mb-6">
                  <Icon size={28} />
                </div>
                <h4 className="font-extrabold text-slate-800 text-base mb-2 leading-tight">{item.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Our Construction & Landscaping Specialties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
            Specialized Capabilities
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-900 tracking-tight">Our Core Specialties</h2>
          <p className="text-slate-600 mt-3 font-medium">What D Square Infrazone builds, casts, and designs with absolute precision.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Civil Structures Specialty */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80" 
                alt="Elite Civil & RCC Structures" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-4 left-4 p-3 bg-brand-primary text-white rounded-2xl shadow-md">
                <Layers size={20} />
              </div>
            </div>
            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-brand-900">Elite Civil & RCC Structures</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-medium">
                  We deliver certified turn-key RCC frame structures. Features M20/M25 grade concrete slab casting, high-tensile FE550 steel columns, double-washed river sand, foundation leveling, and continuous curation audits.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['Foundation Casting', 'RCC Columns', 'Soil Audits', 'Slab Curing'].map((spec, sIdx) => (
                  <span key={sIdx} className="bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-full">{spec}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Premium Landscaping Specialty */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
                }} 
                alt="Accurate Outdoor Landscaping" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-4 left-4 p-3 bg-brand-accent text-white rounded-2xl shadow-md">
                <Leaf size={20} />
              </div>
            </div>
            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-brand-900">Accurate Outdoor Landscaping</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-medium">
                  We engineer accurate, beautiful outdoor living areas. Covering turf grass lawns, stone walkway pavings, vertical garden wall planters, scenic Koi ponds, waterfall fountains, and automated drip irrigation.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['Softscape Turf', 'Stone Pavings', 'Koi Ponds', 'Vertical Gardens'].map((spec, sIdx) => (
                  <span key={sIdx} className="bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-full">{spec}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Commercial & Renovations */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
            <div className="h-48 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" 
                alt="Commercial Construction & Renovation" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-4 left-4 p-3 bg-slate-800 text-white rounded-2xl shadow-md">
                <Building2 size={20} />
              </div>
            </div>
            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-brand-900">Commercial & Fit-Outs</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-medium">
                  Complete building renovations and interior glass office fit-outs. We handle false ceilings with LED lighting patterns, Italian marble flooring, soundproof acoustics, and premium HVAC systems.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['Office Fit-Outs', 'Marble Flooring', 'HVAC Facades', 'LED Ceilings'].map((spec, sIdx) => (
                  <span key={sIdx} className="bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-full">{spec}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Operations & Metrics Panel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-brand-accent text-3xl sm:text-4xl font-black mb-1">150k+</p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Sq. Ft. Completed</p>
          </div>
          <div>
            <p className="text-brand-accent text-3xl sm:text-4xl font-black mb-1">100%</p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Turn-Key Transparency</p>
          </div>
          <div>
            <p className="text-brand-accent text-3xl sm:text-4xl font-black mb-1">50+</p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Artisans & Masons</p>
          </div>
          <div>
            <p className="text-brand-accent text-3xl sm:text-4xl font-black mb-1">15+</p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Structural Engineers</p>
          </div>
        </div>
      </section>

      {/* Recent Site Gallery Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping"></span>
            Live from Sites
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-900 tracking-tight">Active Worksite Feeds</h2>
          <p className="text-slate-600 mt-3 font-medium">Real-time photos uploaded by our site supervisors directly from the field.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80', tag: 'Slab Casting', loc: 'Solar, Erode' },
            { img: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80', tag: 'Foundation', loc: 'Perundurai, Erode' },
            { img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80', tag: 'Column Work', loc: 'Solar, Erode' },
            { img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80', tag: 'Landscaping', loc: 'Erode City' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group hover:shadow-md transition-shadow duration-300">
              <div className="h-44 overflow-hidden relative">
                <img src={item.img} alt={item.tag} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute bottom-3 left-3 bg-brand-primary/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{item.tag}</span>
              </div>
              <div className="p-3 text-[10px] text-slate-500 font-bold flex items-center gap-1">
                <MapPin size={10} className="text-brand-accent shrink-0" /> {item.loc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Engineering Certifications & Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-100">
          <h3 className="text-xl font-extrabold text-brand-900 mb-8">Registered Construction Standards</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
              <Award className="text-brand-accent w-8 h-8" />
              <div className="text-left">
                <p className="text-slate-900 leading-none font-extrabold">ISO 9001:2015</p>
                <p className="text-slate-400 text-[10px] font-medium mt-1">Quality Certified</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
              <Shield className="text-brand-accent w-8 h-8" />
              <div className="text-left">
                <p className="text-slate-900 leading-none font-extrabold">OHSAS 18001</p>
                <p className="text-slate-400 text-[10px] font-medium mt-1">Safety Compliant</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
              <Check className="text-brand-accent w-8 h-8" />
              <div className="text-left">
                <p className="text-slate-900 leading-none font-extrabold">FoSCoS Approved</p>
                <p className="text-slate-400 text-[10px] font-medium mt-1">Licensed Process</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="bg-gradient-to-br from-brand-900 to-brand-950 rounded-3xl p-8 sm:p-12 text-white mx-2 sm:mx-4 relative overflow-hidden shadow-2xl border border-brand-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
            <Quote size={48} className="text-brand-accent opacity-50 shrink-0" />
            
            <div className="min-h-[140px] flex items-center justify-center">
              <p className="text-xl sm:text-2xl font-medium leading-relaxed italic max-w-3xl animate-scale-up">
                "{testimonials[testiIdx].content}"
              </p>
            </div>

            {/* User details */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-md">
                <img 
                  src={testimonials[testiIdx].avatar} 
                  alt={testimonials[testiIdx].name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h4 className="font-bold text-lg">{testimonials[testiIdx].name}</h4>
              <p className="text-xs text-brand-accent font-bold uppercase tracking-wider">{testimonials[testiIdx].role}</p>
              
              {/* Stars */}
              <div className="flex gap-0.5 text-yellow-400 pt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < testimonials[testiIdx].rating ? "currentColor" : "none"} 
                    className={i < testimonials[testiIdx].rating ? "text-yellow-400" : "text-white/20"} 
                  />
                ))}
              </div>
            </div>

            {/* Slider Controls */}
            {testimonials.length > 1 && (
              <div className="flex items-center gap-3 pt-4">
                <button 
                  onClick={handlePrevTesti}
                  className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 backdrop-blur-sm transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={handleNextTesti}
                  className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 backdrop-blur-sm transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Accordion FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 animate-scale-up">
            <HelpCircle size={12} className="text-brand-accent animate-pulse" />
            Client Assistance
          </div>
          <h2 className="text-3xl font-extrabold text-brand-900 tracking-tight animate-fade-in-up">Frequently Asked Questions</h2>
          <p className="text-slate-600 mt-2 font-medium">Answers to common questions regarding our turn-key civil operations.</p>
        </div>

        <div className="space-y-4">
          {[
            { q: 'What is a turn-key construction project?', a: 'A turn-key project is a contract where we manage all aspects of building—from layout blueprints, municipal licensing, steel/cement procurement, foundation/RCC casting, wall masonry, plumbing, electrical installations, to vertical landscaping, handovers, and final safety audits.' },
            { q: 'How does real-time portal tracking work?', a: 'Once the contract is signed, you receive credentials to your Client Portal. On the portal, you can monitor daily site workforce counts, check sand/steel dispatches, view photos uploaded by supervisors, download permit sheets, and approve payment stages.' },
            { q: 'Where does D Square procure materials?', a: 'We source high-grade FE550 steel, certified OPC 53 Grade cement, and double-washed manufactured sand from licensed Erode suppliers. Every batch is validated by our QC managers before curing starts.' },
            { q: 'Do you design custom landscapes and vertical gardens?', a: 'Yes! We provide complete softscape and hardscape options including native lawns, natural stone pathways, vertical wall planters, water fountains, and automated drip irrigation.' }
          ].map((faq, fIdx) => {
            const isOpen = openFaq === fIdx;
            return (
              <div key={fIdx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all shadow-sm">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                  className="w-full flex justify-between items-center p-6 text-left font-bold text-slate-800 hover:text-brand-primary transition-colors text-sm"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-accent' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-slate-500 font-medium text-xs leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Turn-Key CTA Section */}
      <section className="text-center max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-900 tracking-tight leading-tight">
          Ready to Build Your Turn-Key Project?
        </h2>
        <p className="text-slate-600 font-medium text-base sm:text-lg max-w-xl mx-auto">
          Contact our structural experts to receive a free built-up area layout estimate and establish your private portal tracking workspace.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/get-quote')}
            className="inline-flex items-center gap-2 bg-brand-accent text-white font-bold px-8 py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-brand-accent/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            Calculate Material Quote <Calculator size={20} />
          </button>
          <button 
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-brand-800 transition-all shadow-lg shadow-brand-primary/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            Submit an Inquiry <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "dt-1",
    name: "Mr. Vikram Kumar",
    role: "Homeowner",
    content: "D Square Constructions turned my dream villa into reality. The D Square Infrazone portal let me track the progress of foundation casting and material dispatches daily. Highly recommended!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "dt-2",
    name: "Mrs. Anitha Sharma",
    role: "Villa Client",
    content: "The level of transparency offered by D Square is unmatched. I could view workforce logs and approve payment milestones with a single click. Excellent civil management!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "dt-3",
    name: "Mr. Suresh Reddy",
    role: "Commercial Developer",
    content: "Professional turn-key builders. The material tracking feature kept our project within budget, and the weekly progress photos gave us complete peace of mind.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  }
];

export default LandingPage;