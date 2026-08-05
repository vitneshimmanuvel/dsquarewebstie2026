import React, { useState } from 'react';
import { API_BASE } from '../AuthContext';
import { MapPin, Phone, Mail, CheckCircle, Loader2, Sparkles, Plus, Minus } from 'lucide-react';

interface ContactPageProps {
  highlightContact?: boolean;
  setHighlightContact?: (val: boolean) => void;
}

const FAQ_ITEMS = [
  {
    q: 'What is turn-key civil construction?',
    a: 'Turn-key construction means D Square handles your project end-to-end—from initial soil audits and architectural design to bricklaying, structural casting, painting, and modular interior fit-outs. We handover a fully completed structure ready for you to move in.'
  },
  {
    q: 'How does the D Square Infrazone portal work?',
    a: 'Once your project contract is signed, we set up a secure client account. You can log in via this website or our mobile app to view daily worker headcount, inspect material delivery orders, approve payment invoices, download documents, and check milestone approvals.'
  },
  {
    q: 'Can I customize the structural raw materials?',
    a: 'Yes! The portal features a dedicated material approvals tab. Before civil managers cast concrete or lay tiles, they upload the specifications and brands. You can choose to approve or request brand modifications directly through the interface.'
  },
  {
    q: 'What steps are required to setup my account?',
    a: 'New clients do not register directly. You submit your project details using the inquiry form on this page. Our project management team will schedule a site visit, draft the initial budget, and then register your Client Portal account upon signing.'
  }
];

const ContactPage: React.FC<ContactPageProps> = ({ highlightContact = false, setHighlightContact }) => {
  // Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('Residential Villa');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Accordion FAQ State
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const res = await fetch(`${API_BASE}/leads/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          interest: projectType,
          message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setProjectType('Residential Villa');
        setMessage('');
        if (setHighlightContact) {
          setHighlightContact(false);
        }
      } else {
        setSubmitError(data.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      setSubmitError('Connection error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (idx: number) => {
    setActiveFaqIdx(prev => (prev === idx ? null : idx));
  };

  return (
    <div className="pt-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles size={12} className="text-brand-accent animate-pulse" />
          Get In Touch
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-brand-900 tracking-tight leading-tight">
          Start Your Construction <br/>
          <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-red-500">Roadmap Today</span>
        </h1>
        <p className="text-slate-600 mt-4 text-lg font-medium">
          Fill out the inquiry form to contact our civil managers, schedule a layout audit, and set up your Client Portal credentials.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Contact info and FAQ */}
        <div className="space-y-12 animate-fade-in-left">
          {/* Details */}
          <div className="space-y-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-extrabold text-brand-900 tracking-tight">D Square HQ</h2>
            <div className="space-y-4 font-semibold text-sm">
              <div className="flex gap-4">
                <div className="p-3 bg-brand-primary/5 text-brand-primary rounded-xl h-fit shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-slate-800">Head Office</h4>
                  <p className="text-slate-500 font-medium text-xs mt-1 leading-relaxed">
                    D Square Infrazone HQ, Solar, Erode, Tamil Nadu - 638002
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 bg-brand-primary/5 text-brand-primary rounded-xl h-fit shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-slate-800">Call Us</h4>
                  <p className="text-slate-500 font-medium text-xs mt-1">
                    +91 98765 43210 / +91 98765 43211
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 bg-brand-primary/5 text-brand-primary rounded-xl h-fit shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-slate-800">Email Address</h4>
                  <p className="text-slate-500 font-medium text-xs mt-1">
                    info@dsquareconstructions.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-brand-900 tracking-tight mb-6">Frequently Asked Questions</h2>
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = activeFaqIdx === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-extrabold text-slate-800 text-sm tracking-tight">{faq.q}</span>
                    {isOpen ? (
                      <Minus size={16} className="text-brand-accent shrink-0" />
                    ) : (
                      <Plus size={16} className="text-brand-primary shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-slate-500 leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Enquiry form card */}
        <div className={`bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-slate-800 transition-all duration-500 animate-fade-in-right ${
          highlightContact ? 'ring-4 ring-brand-accent/40 shadow-brand-accent/10 scale-[1.01]' : 'border border-slate-100'
        }`}>
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-scale-up">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center border border-green-200 mb-6 shadow-md shadow-green-100">
                <CheckCircle className="text-green-500 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-brand-900 mb-3 tracking-tight">Inquiry Submitted!</h3>
              <p className="text-sm text-slate-600 max-w-sm leading-relaxed mb-6 font-medium">
                Thank you for contacting D Square Constructions. Our team will review your project details, set up your secure Client Portal account, and call you shortly to kickstart the project!
              </p>
              <button 
                onClick={() => setSubmitSuccess(false)}
                className="text-xs text-brand-primary hover:underline font-bold"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center justify-between">
                <span>Send an Inquiry</span>
                {highlightContact && (
                  <span className="text-[10px] text-brand-accent bg-red-50 border border-red-100 px-2 py-0.5 rounded-full font-bold animate-pulse">
                    Account Setup Required
                  </span>
                )}
              </h3>

              {highlightContact && (
                <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-4 mb-6 text-sm text-brand-primary flex flex-col gap-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="bg-brand-accent text-white text-[10px] uppercase px-1.5 py-0.5 rounded font-extrabold tracking-wider">New Account Portal</span>
                    <span>Get Started with D Square</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    To start your construction project and request your Client Portal credentials, please fill out the inquiry form below. Our managers will contact you immediately to finalize your portal setup!
                  </p>
                </div>
              )}

              {submitError && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl mb-4 text-xs font-semibold">
                  {submitError}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleInquirySubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-brand-primary text-sm" 
                      placeholder="John" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-brand-primary text-sm" 
                      placeholder="Doe" 
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-brand-primary text-sm" 
                      placeholder="john@example.com" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-brand-primary text-sm" 
                      placeholder="+91 98765 43210" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Project Type</label>
                  <select 
                    value={projectType}
                    onChange={e => setProjectType(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-brand-primary text-sm"
                  >
                    <option>Residential Villa</option>
                    <option>Apartment Complex</option>
                    <option>Commercial Space</option>
                    <option>Renovation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
                  <textarea 
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-brand-primary h-24 text-sm resize-none" 
                    placeholder="Tell us about your project requirements..."
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-primary text-white font-bold py-4 rounded-lg hover:bg-brand-800 transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : 'Submit Request'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
