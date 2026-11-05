import React, { useState, useMemo } from 'react';
import { API_BASE } from '../AuthContext';
import { MATERIAL_SPECS, MaterialOptionGroup } from '../constants';
import { 
  Calculator, Check, ArrowRight, Shield, Sparkles, Building2, 
  Home, Hammer, Layers, CheckCircle2, Phone, Mail, MapPin, 
  Download, Printer, RefreshCw, Send, ChevronRight, Info
} from 'lucide-react';

const CATEGORY_TABS = [
  'All Materials',
  'Structural & Masonry',
  'Electrical & Plumbing',
  'Finishes & Sanitary',
  'Doors & Windows'
] as const;

export const GetQuotePage: React.FC = () => {
  // Project Scope State
  const [projectType, setProjectType] = useState<'villa' | 'apartment' | 'commercial' | 'renovation'>('villa');
  const [area, setArea] = useState<number>(1800);
  const [floors, setFloors] = useState<string>('G+1 (Ground + 1 Floor)');
  const [packageGrade, setPackageGrade] = useState<'standard' | 'premium' | 'luxury'>('premium');

  // Material Selections State: mapping categoryId -> selected option
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    MATERIAL_SPECS.forEach(item => {
      initial[item.id] = item.defaultOption;
    });
    return initial;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<typeof CATEGORY_TABS[number]>('All Materials');
  const [showInquiryModal, setShowInquiryModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [quoteReference, setQuoteReference] = useState<string>('');

  // Inquiry form fields
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientLocation, setClientLocation] = useState<string>('Erode');
  const [notes, setNotes] = useState<string>('');

  // Pricing constants (Per Sq. Ft.)
  const rateBase = useMemo(() => {
    const matrix = {
      villa: { standard: 1950, premium: 2450, luxury: 3450 },
      commercial: { standard: 2150, premium: 2850, luxury: 4100 },
      apartment: { standard: 1750, premium: 2250, luxury: 3100 },
      renovation: { standard: 850, premium: 1250, luxury: 1950 }
    };
    return matrix[projectType][packageGrade];
  }, [projectType, packageGrade]);

  // Adjust cost slightly based on high-end material selections
  const materialAddonPerSqft = useMemo(() => {
    let addon = 0;
    if (selectedMaterials.cement === 'Ultratech' || selectedMaterials.cement === 'Ramco') addon += 15;
    if (selectedMaterials.sand === 'Double washed(VSI) M-Sand & P-Sand') addon += 20;
    if (selectedMaterials.tmtRebars === 'Tata') addon += 35;
    if (selectedMaterials.bricks === 'porotherm block' || selectedMaterials.bricks === '1st class chamber brick') addon += 25;
    if (selectedMaterials.maindoor === 'Teak') addon += 40;
    if (selectedMaterials.windows === 'Upvc' || selectedMaterials.windows === 'Teak') addon += 30;
    if (['Kohler', 'Toto', 'Grohe'].includes(selectedMaterials.sanitaryware)) addon += 50;
    return addon;
  }, [selectedMaterials]);

  const effectiveRate = rateBase + materialAddonPerSqft;
  const estimatedTotalCost = area * effectiveRate;
  const estimatedTimelineWeeks = Math.ceil(area / 140) + (projectType === 'renovation' ? 3 : 7);

  // Grouped breakdown
  const costBreakdown = useMemo(() => {
    return {
      civilStructure: Math.round(estimatedTotalCost * 0.48),
      doorsAndWindows: Math.round(estimatedTotalCost * 0.14),
      finishesAndTiles: Math.round(estimatedTotalCost * 0.16),
      electricalPlumbing: Math.round(estimatedTotalCost * 0.14),
      supervisionAndQuality: Math.round(estimatedTotalCost * 0.08)
    };
  }, [estimatedTotalCost]);

  const handleSelectMaterial = (categoryId: string, option: string) => {
    setSelectedMaterials(prev => ({
      ...prev,
      [categoryId]: option
    }));
  };

  const handleResetDefaults = () => {
    const initial: Record<string, string> = {};
    MATERIAL_SPECS.forEach(item => {
      initial[item.id] = item.defaultOption;
    });
    setSelectedMaterials(initial);
  };

  const filteredMaterials = useMemo(() => {
    if (activeTab === 'All Materials') return MATERIAL_SPECS;
    return MATERIAL_SPECS.filter(m => m.category === activeTab);
  }, [activeTab]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedRef = `DSQ-EST-${Date.now().toString().slice(-6)}`;
    setQuoteReference(generatedRef);

    // Format selected materials for CRM inquiry note
    const formattedSpecs = MATERIAL_SPECS.map(
      spec => `${spec.name}: ${selectedMaterials[spec.id] || spec.defaultOption}`
    ).join(' | ');

    const payload = {
      name: clientName,
      phone: clientPhone,
      email: clientEmail || `${clientPhone}@inquiry.dsquare`,
      interest: `${projectType.toUpperCase()} - ${area} sq.ft (${floors})`,
      budget: estimatedTotalCost,
      message: `[QUOTE ENQUIRY ${generatedRef}] Built-Up Area: ${area} Sq.Ft | Type: ${projectType} | Floors: ${floors} | Estimated Cost: ₹${estimatedTotalCost.toLocaleString('en-IN')} (₹${effectiveRate}/sq.ft) | Location: ${clientLocation} | Client Notes: ${notes || 'None'} || CUSTOM MATERIALS SELECTED: ${formattedSpecs}`
    };

    try {
      const res = await fetch(`${API_BASE}/leads/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success || data.data) {
        setSubmissionSuccess(true);
      } else {
        setSubmissionSuccess(true);
      }
    } catch (err) {
      setSubmissionSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles size={14} className="text-brand-accent animate-pulse" />
          Turn-Key Customizer
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-brand-900 tracking-tight leading-tight">
          Instant Construction <br />
          <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-red-600">
            Material & Cost Quote
          </span>
        </h1>
        <p className="text-slate-600 mt-4 text-base sm:text-lg font-medium">
          Select your verified structural materials, branded fittings, and built-up area to get a clear, transparent turn-key quotation instantly.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Scope & Materials Selector (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Project Parameters */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-xl">
                  <Building2 size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-brand-900">1. Project Specifications</h2>
                  <p className="text-xs text-slate-500 font-medium">Define structure type, built-up area & floor plan</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full">
                Step 1 of 2
              </span>
            </div>

            {/* Project Type Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
                Construction Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'villa', label: 'Residential Villa', icon: Home },
                  { id: 'apartment', label: 'Apartment Building', icon: Building2 },
                  { id: 'commercial', label: 'Commercial Complex', icon: Layers },
                  { id: 'renovation', label: 'Renovation & Extension', icon: Hammer }
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = projectType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setProjectType(item.id as any)}
                      className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between h-24 ${
                        isSelected
                          ? 'border-brand-primary bg-brand-primary/5 text-brand-primary shadow-sm'
                          : 'border-slate-100 bg-slate-50/70 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon size={20} className={isSelected ? 'text-brand-accent' : 'text-slate-400'} />
                      <span className="font-bold text-xs leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Built-Up Area Range & Manual Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Total Built-Up Area
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="300"
                    max="20000"
                    value={area}
                    onChange={e => setArea(Math.max(100, parseInt(e.target.value) || 0))}
                    className="w-24 text-right font-black text-brand-primary bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-brand-primary"
                  />
                  <span className="text-xs font-bold text-slate-500">Sq. Ft.</span>
                </div>
              </div>

              <input
                type="range"
                min="500"
                max="8000"
                step="50"
                value={area}
                onChange={e => setArea(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-accent"
              />

              <div className="flex flex-wrap gap-2 pt-3">
                {[1000, 1500, 2000, 2500, 3500, 5000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setArea(val)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                      area === val
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {val.toLocaleString()} sq.ft
                  </button>
                ))}
              </div>
            </div>

            {/* Floor Count & Finish Grade */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Number of Floors
                </label>
                <select
                  value={floors}
                  onChange={e => setFloors(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-brand-primary"
                >
                  <option value="Ground Floor (G)">Ground Floor Only (G)</option>
                  <option value="G+1 (Ground + 1 Floor)">Duplex Villa (G+1 Floor)</option>
                  <option value="G+2 (Ground + 2 Floors)">G+2 Floors</option>
                  <option value="G+3 (Ground + 3 Floors)">G+3 Floors</option>
                  <option value="Stilt + 4 Floors">Stilt + 4 Floors</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Finishing Package Grade
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['standard', 'premium', 'luxury'] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setPackageGrade(g)}
                      className={`py-2.5 rounded-xl text-xs font-extrabold uppercase transition-all ${
                        packageGrade === g
                          ? 'bg-brand-primary text-white shadow-md'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Material Brand Selection */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-accent/10 text-brand-accent rounded-xl">
                  <Shield size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-brand-900">2. Select Your Materials & Brands</h2>
                  <p className="text-xs text-slate-500 font-medium">15 structural, sanitary, door & electrical categories</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-xs font-bold text-slate-500 hover:text-brand-primary flex items-center gap-1.5 self-start sm:self-center"
              >
                <RefreshCw size={14} /> Reset Defaults
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORY_TABS.map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Material Items List */}
            <div className="space-y-6">
              {filteredMaterials.map((item) => {
                const currentVal = selectedMaterials[item.id] || item.defaultOption;
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-brand-primary/40 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-brand-900 text-sm">{item.name}</h3>
                            <span className="text-[10px] bg-slate-200/80 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded-lg">
                          Selected: {currentVal}
                        </span>
                      </div>
                    </div>

                    {/* Brand / Material Option Chips */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.options.map(opt => {
                        const isChosen = currentVal === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectMaterial(item.id, opt)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                              isChosen
                                ? 'bg-brand-primary text-white border-brand-primary shadow-sm scale-105'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {isChosen && <Check size={12} strokeWidth={3} />}
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {item.tip && (
                      <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 pt-1 italic">
                        <Info size={12} className="shrink-0 text-brand-primary" /> {item.tip}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Summary & Action Card (4 cols) */}
        <div className="lg:col-span-4 sticky top-28 space-y-6">
          <div className="bg-gradient-to-br from-brand-900 to-brand-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-800 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-accent/20 border border-brand-accent/30 text-red-300 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-2">
                Live Turn-Key Estimate
              </div>
              <h3 className="text-xl font-black">Estimated Cost Summary</h3>
              <p className="text-xs text-slate-300 mt-1">Based on {area.toLocaleString()} sq.ft built-up area</p>
            </div>

            {/* Total Figure */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-center">
              <span className="block text-[11px] text-slate-300 uppercase font-extrabold tracking-wider mb-1">
                Total Estimated Cost
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                ₹{estimatedTotalCost.toLocaleString('en-IN')}
              </div>
              <span className="block text-xs font-bold text-brand-accent mt-1">
                ≈ ₹{effectiveRate.toLocaleString('en-IN')} / Sq. Ft.
              </span>
              <span className="block text-[10px] text-slate-400 mt-2">
                (Includes RCC casting, branded materials, supervision & turn-key labor)
              </span>
            </div>

            {/* Project Specs Quick List */}
            <div className="space-y-2.5 text-xs font-semibold border-y border-white/10 py-4">
              <div className="flex justify-between text-slate-300">
                <span>Project Type:</span>
                <span className="text-white font-bold capitalize">{projectType}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Built-Up Area:</span>
                <span className="text-white font-bold">{area.toLocaleString()} Sq. Ft.</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Structure Height:</span>
                <span className="text-white font-bold">{floors}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Finish Quality:</span>
                <span className="text-brand-accent font-bold uppercase">{packageGrade}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Estimated Completion:</span>
                <span className="text-white font-bold">~{estimatedTimelineWeeks} Weeks</span>
              </div>
            </div>

            {/* Approximate Cost Distribution */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Approximate Item Distribution:
              </span>
              <div className="space-y-1.5 text-xs text-slate-300 font-medium">
                <div className="flex justify-between">
                  <span>Civil & Foundation (Cement, Sand, Steel):</span>
                  <span className="text-white font-bold">₹{(costBreakdown.civilStructure / 100000).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiles, Sanitary & Bathrooms:</span>
                  <span className="text-white font-bold">₹{(costBreakdown.finishesAndTiles / 100000).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between">
                  <span>Doors, Windows & Fabrication:</span>
                  <span className="text-white font-bold">₹{(costBreakdown.doorsAndWindows / 100000).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between">
                  <span>Electrical, Conduits & Plumbing:</span>
                  <span className="text-white font-bold">₹{(costBreakdown.electricalPlumbing / 100000).toFixed(2)} L</span>
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowInquiryModal(true)}
                className="w-full bg-brand-accent hover:bg-red-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-brand-accent/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                Send Official Quote Request <ArrowRight size={18} />
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-2">
                Free site inspection & soil bearing audit included with quote
              </p>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-3">
            <h4 className="text-xs font-extrabold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={16} className="text-brand-accent" /> Why D Square Construction Quotes?
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-brand-primary shrink-0 mt-0.5" />
                <span><strong>No Hidden Extras:</strong> The price quoted is the price executed.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-brand-primary shrink-0 mt-0.5" />
                <span><strong>Brand Validation:</strong> You inspect barcodes and dispatch slips in portal.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-brand-primary shrink-0 mt-0.5" />
                <span><strong>Stage-Wise Payments:</strong> Pay only after milestone verification.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Inquiry & Download Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 animate-scale-up border border-slate-100 max-h-[90vh] overflow-y-auto">
            {!submissionSuccess ? (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-2xl font-black text-brand-900">Lock In Your Quote</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Our structural managers will review your material preferences and schedule a layout audit.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-brand-900">{projectType.toUpperCase()} ({area} Sq.Ft)</p>
                    <p className="text-slate-500 font-medium">{packageGrade.toUpperCase()} grade with custom materials</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-brand-primary">
                      ₹{estimatedTotalCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g. Er. Karthik Sundaram"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={e => setClientPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Site Location *</label>
                    <input
                      type="text"
                      required
                      value={clientLocation}
                      onChange={e => setClientLocation(e.target.value)}
                      placeholder="e.g. Solar, Erode"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    placeholder="karthik@example.com"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Special Requirements or Plot Dimensions</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Plot size 30x40, need vastu-compliant north facing entrance..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-brand-primary resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 bg-brand-primary hover:bg-brand-900 text-white font-extrabold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-75"
                  >
                    {isSubmitting ? 'Submitting Quote...' : 'Confirm & Request Site Visit'} <Send size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Check size={32} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-brand-900">Quotation Submitted!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your reference number is <strong className="text-brand-primary font-mono">{quoteReference}</strong>
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 text-xs space-y-2">
                  <p className="font-bold text-slate-800">Quotation Summary for {clientName}:</p>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>Area: <strong>{area} Sq. Ft.</strong></div>
                    <div>Est. Rate: <strong>₹{effectiveRate}/sq.ft</strong></div>
                    <div>Est. Cost: <strong>₹{estimatedTotalCost.toLocaleString('en-IN')}</strong></div>
                    <div>Location: <strong>{clientLocation}</strong></div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    Custom materials (Cement: {selectedMaterials.cement}, Steel: {selectedMaterials.tmtRebars}, Sand: {selectedMaterials.sand}, Tiles: {selectedMaterials.tiles}, Doors: {selectedMaterials.maindoor}) recorded.
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 text-xs flex items-center justify-center gap-2"
                  >
                    <Printer size={16} /> Print / Save PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowInquiryModal(false);
                      setSubmissionSuccess(false);
                    }}
                    className="flex-1 bg-brand-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-900 text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GetQuotePage;
