import React, { useState } from 'react';
import { ArrowRight, Sparkles, Shield, Compass, Hammer, Paintbrush, Calculator, HelpCircle, Leaf } from 'lucide-react';

const SERVICES_DETAIL = [
  {
    icon: Compass,
    title: 'Architectural & 3D Design',
    desc: 'Premium building blueprints, engineering drawings, and photorealistic 3D rendering. We conduct professional layout consultations, site soil audits, and ground leveling surveys to draft luxury spaces that match your lifestyle and meet strict municipal codes.',
    details: [
      'Site layout consultation & initial soil bearing audits',
      'Structural engineering design & load calculations',
      'High-resolution 3D walkthroughs & VR space planning',
      'Municipal building approvals & licensing documentation'
    ],
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
  },
  {
    icon: Hammer,
    title: 'Civil Turn-Key Construction',
    desc: 'End-to-end building execution under expert supervision. We handle site excavation, certified foundation layout, RCC frame structural works (M20, M25 concrete casting), structural columns, bricklaying, and premium plaster finishes with certified materials.',
    details: [
      'RCC structural frames, column casting & curing management',
      'Certified steel bars, premium cement & river/manufactured sand',
      'Daily site logs, workforce management & material tracking',
      'Plumbing, sanitation & electrical concealed conduits'
    ],
    img: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80'
  },
  {
    icon: Paintbrush,
    title: 'Interior Design & Fit-Outs',
    desc: 'Transforming interiors into luxury spaces. We customize woodwork, wardrobe fittings, premium flooring (Italian marble / wooden laminates), false ceilings, lighting layouts, and smart home automation systems.',
    details: [
      'Custom modular kitchen planning with chimneys',
      'False ceiling & decorative ambient LED profiles',
      'Italian marble laying & premium vitrified tiling',
      'Smart home automation and home theater acoustics'
    ],
    img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80'
  },
  {
    icon: Leaf,
    title: 'Premium Landscaping & Outdoor Architecture',
    desc: 'Expert landscape designs and outdoor layout engineering. We craft premium external environments covering native lawns, stone pavements, water streams, vertical planters, and green energy solutions to create perfect outdoor aesthetics.',
    details: [
      'Softscaping: Lawns, native shrubs, organic plants, turf installation',
      'Hardscaping: Stone patios, walkway paver blocks, retaining walls, firepits',
      'Water Features: Koi ponds, custom waterfalls, modern fountains, automated irrigation',
      'Green Energy & Lighting: Drip automation, low-voltage LED path lights, solar uplights',
      'Rooftop & Vertical Gardens: Balcony planters, green living walls, rooftop terrace layouts'
    ],
    img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80'
  }
];

const ServicesPage: React.FC = () => {
  // Estimator States
  const [projectType, setProjectType] = useState<'villa' | 'apartment' | 'commercial' | 'renovation'>('villa');
  const [area, setArea] = useState<number>(1500);
  const [grade, setGrade] = useState<'standard' | 'premium' | 'luxury'>('premium');

  // Calculation Constants
  const baseRates = {
    villa: { standard: 1800, premium: 2400, luxury: 3500 },
    apartment: { standard: 1500, premium: 2000, luxury: 3000 },
    commercial: { standard: 2000, premium: 2800, luxury: 4200 },
    renovation: { standard: 600, premium: 1000, luxury: 1800 }
  };

  const estimatedRate = baseRates[projectType][grade];
  const totalCost = area * estimatedRate;
  const estimatedTimeline = Math.ceil(area / 150) + (projectType === 'renovation' ? 2 : 6); // in weeks

  return (
    <div className="pt-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles size={12} className="text-brand-accent animate-pulse" />
          Turn-Key Deliverables
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-brand-900 tracking-tight leading-tight">
          Elite Construction <br/>
          <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-red-500">Services & Solutions</span>
        </h1>
        <p className="text-slate-600 mt-4 text-lg">
          We bring structural engineering excellence, complete budget control, and real-time site updates directly to your screen.
        </p>
      </div>

      {/* Services Grid */}
      <div className="space-y-16">
        {SERVICES_DETAIL.map((s, idx) => {
          const Icon = s.icon;
          const isEven = idx % 2 === 0;
          return (
            <div 
              key={idx} 
              className={`flex flex-col lg:flex-row gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 ${
                isEven ? '' : 'lg:flex-row-reverse'
              }`}
            >
              {/* Image side */}
              <div className="w-full lg:w-1/2 aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-md relative group shrink-0">
                <img 
                  src={s.img} 
                  alt={s.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              {/* Text side */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="p-3 bg-brand-primary/5 rounded-2xl w-fit text-brand-primary">
                  <Icon size={32} />
                </div>
                <h2 className="text-3xl font-extrabold text-brand-900 tracking-tight">{s.title}</h2>
                <p className="text-slate-600 leading-relaxed font-medium">{s.desc}</p>
                
                <ul className="grid sm:grid-cols-2 gap-3 pt-2">
                  {s.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2 text-sm text-slate-500 font-medium">
                      <Shield className="text-brand-accent w-4 h-4 mt-0.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cost Estimator Section */}
      <section className="mt-24 bg-gradient-to-br from-brand-900 to-brand-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-brand-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">Interactive Cost Estimator</h2>
            <p className="text-slate-300 mt-2 text-sm">
              Estimate your turn-key construction project budget and tentative completion timeline instantly.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Input Form */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Project Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['villa', 'apartment', 'commercial', 'renovation'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setProjectType(type)}
                      className={`py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                        projectType === type 
                          ? 'bg-brand-accent text-white shadow-lg' 
                          : 'bg-white/10 text-slate-200 hover:bg-white/20'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Built-Up Area: <span className="text-brand-accent font-black">{area} Sq. Ft.</span>
                </label>
                <input 
                  type="range" 
                  min="500" 
                  max="10000" 
                  step="100" 
                  value={area}
                  onChange={e => setArea(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                  <span>500 sq.ft</span>
                  <span>5,000 sq.ft</span>
                  <span>10,000 sq.ft</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2 font-sans">Specification Quality Grade</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['standard', 'premium', 'luxury'] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className={`py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                        grade === g 
                          ? 'bg-brand-primary text-white shadow-lg' 
                          : 'bg-white/10 text-slate-200 hover:bg-white/20'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="bg-white rounded-2xl p-8 text-slate-800 space-y-6 shadow-xl h-full flex flex-col justify-between border border-slate-100">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-brand-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Calculator className="text-brand-accent" size={20} />
                  <span>Budget Summary</span>
                </h3>
                
                <div className="space-y-3 font-semibold text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Rate per Sq. Ft.</span>
                    <span className="text-slate-800">₹{estimatedRate.toLocaleString('en-IN')} / sq.ft</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Estimated Timeline</span>
                    <span className="text-slate-800">{estimatedTimeline} Weeks ({Math.ceil(estimatedTimeline / 4.3)} Months)</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Quality Specifications</span>
                    <span className="text-brand-primary capitalize font-bold">{grade} Finish</span>
                  </div>
                </div>

                <div className="bg-brand-primary/5 rounded-xl p-4 border border-brand-primary/10 mt-4 text-center">
                  <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Estimated Project Cost</span>
                  <span className="text-3xl font-black text-brand-primary">
                    ₹{totalCost.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1 italic">
                    (Excludes site registration and utility deposits)
                  </span>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <a 
                  href="#/get-quote" 
                  className="w-full bg-brand-accent text-white py-3.5 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-accent/25 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-sm"
                >
                  Customize Materials & Get Quote <ArrowRight size={18} />
                </a>
                <a 
                  href="#/contact" 
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs"
                >
                  Request General Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
