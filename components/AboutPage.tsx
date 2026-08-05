import React from 'react';
import { ShieldCheck, Award, Users, HardHat, Sparkles } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <HardHat size={12} className="text-brand-accent animate-pulse" />
          Engineering Trust
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-brand-900 tracking-tight leading-tight">
          Who We Are <br/>
          <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-red-500">D Square Constructions</span>
        </h1>
        <p className="text-slate-600 mt-4 text-lg">
          For over 15 years, we have designed and built custom commercial sites and residential dream homes with structural precision and 100% financial transparency.
        </p>
      </div>

      {/* Grid with Text and Image */}
      <div className="grid lg:grid-cols-2 gap-16 items-center bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm mb-20">
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-brand-900 tracking-tight">Our Mission & Values</h2>
          <p className="text-slate-600 leading-relaxed font-medium">
            At D Square Constructions, we believe turn-key contracting is more than just executing structural blueprints—it's about building a foundation of trust. We are committed to using top-grade civil raw materials, delivering under strict timelines, and providing complete financial transparency.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Through our custom-engineered **D Square Infrazone** digital web portal, we bring our customers directly onto the site. You can monitor daily workforce counts, inspect material invoice dispatches, approve milestone stages, and interact with civil managers with complete ease.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <ShieldCheck className="text-brand-accent shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Certified Engineers</h4>
                <p className="text-xs text-slate-500">100% structural verification</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <Award className="text-brand-primary shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">ISO Certified</h4>
                <p className="text-xs text-slate-500">Quality Management standard</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative aspect-square sm:aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-md">
          <div className="absolute inset-0 bg-brand-primary/5 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80" 
            alt="D Square Construction Site" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Timeline Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-extrabold text-brand-900 text-center tracking-tight mb-12">Our Journey of Excellence</h2>
        <div className="relative max-w-4xl mx-auto">
          {/* Middle Line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2"></div>

          {/* Timeline Milestones */}
          <div className="space-y-12">
            {[
              { year: '2011', title: 'Inception of D Square', desc: 'Started as a small civil design consultancy firm in Solar, Erode, Tamil Nadu.' },
              { year: '2015', title: 'Entering Turn-Key Contracts', desc: 'Transitioned to turn-key building execution, building luxury residential villas and duplexes.' },
              { year: '2019', title: 'Industrial & Commercial Expansion', desc: 'Completed our first premium commercial IT park office space Renovations.' },
              { year: '2026', title: 'Introducing Infrazone Portal', desc: 'Launched our digital customer workspace for real-time logs, material orders, and payment approvals.' }
            ].map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className={`relative flex flex-col sm:flex-row items-start ${isEven ? 'sm:flex-row-reverse' : ''}`}>
                  {/* Dot */}
                  <div className="absolute left-4 sm:left-1/2 w-4 h-4 bg-brand-accent border-4 border-white rounded-full -translate-x-1/2 mt-1.5 shadow z-10"></div>
                  
                  {/* Content Card */}
                  <div className="w-full sm:w-1/2 pl-10 sm:pl-0 sm:px-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-brand-accent font-black text-xl">{item.year}</span>
                      <h4 className="font-extrabold text-slate-800 text-lg mt-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm mt-2 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Board */}
      <section className="mb-8">
        <h2 className="text-3xl font-extrabold text-brand-900 text-center tracking-tight mb-12">Our Civil Leadership Board</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Er. Rajesh Kumar', role: 'Managing Partner & Lead Structural Planner', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80' },
            { name: 'Mrs. Priya Sharma', role: 'Chief Civil Architect & 3D Designer', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
            { name: 'Mr. Vikram Sen', role: 'Head of Project Operations', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80' }
          ].map((leader, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all text-center">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={leader.img} 
                  alt={leader.name} 
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/20 to-transparent"></div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-slate-800 text-lg leading-tight">{leader.name}</h4>
                <p className="text-brand-primary text-xs font-semibold mt-1 uppercase tracking-wider">{leader.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
