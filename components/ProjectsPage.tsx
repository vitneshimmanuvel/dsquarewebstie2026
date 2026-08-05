import React, { useState } from 'react';
import { Search, MapPin, X, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';

interface ProjectItem {
  id: string;
  title: string;
  location: string;
  category: 'Residential' | 'Commercial' | 'Renovation';
  budget: string;
  status: string;
  progress: number;
  mainImage: string;
  gallery: string[];
  desc: string;
}

const PROJECTS_POOL: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Skyline Heights Duplex',
    location: 'Solar, Erode, Tamil Nadu',
    category: 'Residential',
    budget: '₹3.5 Cr',
    status: 'Finishing Phase',
    progress: 92,
    mainImage: 'https://images.unsplash.com/photo-1600596542815-2ad4d9a44566?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-2ad4d9a44566?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    desc: 'A luxury residential villa featuring 3D double-height ceilings, a modular Italian kitchen, home automation, and dynamic landscape lighting.'
  },
  {
    id: 'proj-2',
    title: 'Tech Park Atrium HQ',
    location: 'Whitefield, Bangalore',
    category: 'Commercial',
    budget: '₹12.8 Cr',
    status: 'Structure Complete',
    progress: 68,
    mainImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    ],
    desc: 'Turn-key construction of a five-story office building with green energy integration, certified RCC frame casting, and premium glass facade.'
  },
  {
    id: 'proj-3',
    title: 'Emerald Luxury Villa',
    location: 'Coorg, Karnataka',
    category: 'Residential',
    budget: '₹2.9 Cr',
    status: 'Plastering Phase',
    progress: 75,
    mainImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=800&q=80'
    ],
    desc: 'An eco-friendly residential vacation home customized to preserve local landscape, incorporating custom woodwork and rainwater harvesting.'
  },
  {
    id: 'proj-4',
    title: 'Modern Office Space Fit-out',
    location: 'Solar, Erode, Tamil Nadu',
    category: 'Renovation',
    budget: '₹1.2 Cr',
    status: 'Handover Completed',
    progress: 100,
    mainImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80'
    ],
    desc: 'Complete architectural interior redesign. Added modern workspaces, custom acoustics, and a glass-enclosed conference suite.'
  }
];

const ProjectsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  // Lightbox States
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);

  // Filter Logic
  const filteredProjects = PROJECTS_POOL.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const openLightbox = (project: ProjectItem) => {
    setActiveProject(project);
    setActiveImgIdx(0);
  };

  const closeLightbox = () => {
    setActiveProject(null);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeProject) return;
    setActiveImgIdx(prev => (prev === 0 ? activeProject.gallery.length - 1 : prev - 1));
  };

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeProject) return;
    setActiveImgIdx(prev => (prev === activeProject.gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="pt-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles size={12} className="text-brand-accent animate-pulse" />
          Our Portfolio
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-brand-900 tracking-tight leading-tight">
          Featured Structures <br/>
          <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-red-500">& Project Milestones</span>
        </h1>
        <p className="text-slate-600 mt-4 text-lg">
          Browse through our turn-key civil construction projects. View full construction site photos and blueprints.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 mb-12 animate-scale-up">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-all font-medium"
            placeholder="Search projects by name or location..."
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['All', 'Residential', 'Commercial', 'Renovation'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filterCategory === cat
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <p className="text-slate-500 font-medium text-lg">No projects match your search criteria. Try a different term!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {filteredProjects.map((p) => (
            <div 
              key={p.id} 
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image overlay */}
                <div className="relative h-64 overflow-hidden shrink-0">
                  <img 
                    src={p.mainImage} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  <button 
                    onClick={() => openLightbox(p)}
                    className="absolute top-4 right-4 bg-white/95 backdrop-blur shadow p-3 rounded-full hover:bg-white text-brand-primary hover:text-brand-accent transition-all duration-200 hover:scale-110"
                  >
                    <Eye size={18} />
                  </button>

                  <div className="absolute bottom-4 left-6 text-white">
                    <span className="text-[10px] bg-brand-accent font-extrabold uppercase px-2 py-0.5 rounded tracking-widest">
                      {p.category}
                    </span>
                    <h3 className="text-xl font-bold mt-1 text-white leading-tight">{p.title}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{p.desc}</p>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <MapPin size={14} className="text-brand-accent" />
                    <span>{p.location}</span>
                  </div>
                </div>
              </div>

              {/* Progress and status details */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-500 uppercase">Budget: {p.budget}</span>
                  <span className="text-brand-primary">{p.status} ({p.progress}%)</span>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-primary rounded-full transition-all duration-500" 
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>

                <button 
                  onClick={() => openLightbox(p)}
                  className="w-full bg-brand-primary/5 hover:bg-brand-primary hover:text-white text-brand-primary py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 border border-brand-primary/10"
                >
                  View Project Gallery ({p.gallery.length} Photos)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Gallery Viewer */}
      {activeProject && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur z-[80] flex flex-col items-center justify-center p-4">
          {/* Close button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-3 hover:bg-white/10 rounded-full transition-all"
          >
            <X size={28} />
          </button>

          <div className="max-w-5xl w-full flex flex-col items-center space-y-6">
            {/* Project Title */}
            <div className="text-center text-white space-y-1">
              <span className="text-[10px] text-brand-accent uppercase font-black tracking-widest">{activeProject.category}</span>
              <h2 className="text-2xl font-black">{activeProject.title}</h2>
              <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
                <MapPin size={12} className="text-brand-accent" />
                <span>{activeProject.location}</span>
              </p>
            </div>

            {/* Slider frame */}
            <div className="relative w-full aspect-video md:aspect-[21/9] bg-slate-900 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center group">
              <img 
                src={activeProject.gallery[activeImgIdx]} 
                alt={`Gallery ${activeImgIdx + 1}`} 
                className="max-h-full max-w-full object-contain animate-scale-up" 
              />

              {/* Slider Left */}
              <button 
                onClick={handlePrevImg}
                className="absolute left-4 p-3.5 bg-black/60 border border-white/10 text-white rounded-full hover:bg-black transition-all hover:scale-105"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Slider Right */}
              <button 
                onClick={handleNextImg}
                className="absolute right-4 p-3.5 bg-black/60 border border-white/10 text-white rounded-full hover:bg-black transition-all hover:scale-105"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Thumbnails list */}
            <div className="flex gap-2.5 overflow-x-auto max-w-full pb-2">
              {activeProject.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-20 aspect-video rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    activeImgIdx === idx ? 'border-brand-accent scale-105' : 'border-white/20 opacity-50 hover:opacity-85'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Brief info */}
            <p className="text-slate-400 text-xs text-center max-w-md italic">
              Photo {activeImgIdx + 1} of {activeProject.gallery.length}. Clicking the arrows cycles through structural castings, interior framing, and final deliverables.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
