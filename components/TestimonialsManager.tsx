import React, { useState, useEffect } from 'react';
import { API_BASE } from '../AuthContext';
import { Star, Plus, Edit2, Trash2, CheckCircle2, XCircle, Sparkles, Loader2, Save } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  isActive: boolean;
  isFallback?: boolean;
}

const TestimonialsManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form States
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('Client');
  const [formContent, setFormContent] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formAvatar, setFormAvatar] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  const token = localStorage.getItem('token');

  const fetchTestimonials = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/testimonials/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.data);
      } else {
        setErrorMsg(data.message || 'Failed to fetch testimonials.');
      }
    } catch (err) {
      setErrorMsg('Failed to load testimonials from backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleEditClick = (t: Testimonial) => {
    setIsEditing(true);
    setEditId(t.id);
    setFormName(t.name);
    setFormRole(t.role);
    setFormContent(t.content);
    setFormRating(t.rating);
    setFormAvatar(t.avatar || '');
    setFormIsActive(t.isActive);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    clearForm();
  };

  const clearForm = () => {
    setFormName('');
    setFormRole('Client');
    setFormContent('');
    setFormRating(5);
    setFormAvatar('');
    setFormIsActive(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      name: formName,
      role: formRole,
      content: formContent,
      rating: formRating,
      avatar: formAvatar || undefined,
      isActive: formIsActive
    };

    try {
      const url = isEditing && editId 
        ? `${API_BASE}/testimonials/${editId}` 
        : `${API_BASE}/testimonials`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(isEditing ? 'Testimonial updated successfully!' : 'Testimonial added successfully!');
        setIsEditing(false);
        setEditId(null);
        clearForm();
        fetchTestimonials();
      } else {
        setErrorMsg(data.message || 'Failed to save testimonial.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to communicate with server.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${API_BASE}/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Testimonial deleted successfully.');
        fetchTestimonials();
      } else {
        setErrorMsg(data.message || 'Failed to delete testimonial.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to delete testimonial.');
    }
  };

  const toggleActiveStatus = async (t: Testimonial) => {
    try {
      const res = await fetch(`${API_BASE}/testimonials/${t.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !t.isActive })
      });
      const data = await res.json();
      if (data.success) {
        fetchTestimonials();
      }
    } catch (err) {
      setErrorMsg('Failed to update visibility status.');
    }
  };

  return (
    <div className="space-y-8 animate-scale-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-900 flex items-center gap-2">
            <Sparkles className="text-brand-accent animate-pulse" size={24} />
            <span>Public Testimonials Manager</span>
          </h2>
          <p className="text-slate-500 text-sm">Create, edit, and control the active client reviews displayed on the website landing page.</p>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-xl text-xs font-semibold">
          {successMsg}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Editor Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:col-span-1 h-fit">
          <h3 className="text-lg font-bold text-brand-900 mb-4 border-b border-slate-50 pb-2">
            {isEditing ? 'Edit Testimonial' : 'Create New Testimonial'}
          </h3>
          
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Client Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-brand-primary"
                placeholder="Vikram Kumar"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Client Role / Subtitle</label>
              <input
                type="text"
                required
                value={formRole}
                onChange={e => setFormRole(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-brand-primary"
                placeholder="Homeowner / Duplex Client"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rating (1 - 5 Stars)</label>
              <select
                value={formRating}
                onChange={e => setFormRating(parseInt(e.target.value, 10))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-brand-primary"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
                <option value={2}>⭐⭐ (2 Stars)</option>
                <option value={1}>⭐ (1 Star)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Avatar Image URL (Optional)</label>
              <input
                type="url"
                value={formAvatar}
                onChange={e => setFormAvatar(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-brand-primary"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Review Content</label>
              <textarea
                required
                value={formContent}
                onChange={e => setFormContent(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-brand-primary h-24 resize-none"
                placeholder="Share client's feedback here..."
              />
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="isActiveCheckbox"
                checked={formIsActive}
                onChange={e => setFormIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary"
              />
              <label htmlFor="isActiveCheckbox" className="text-xs text-slate-600 font-bold uppercase cursor-pointer">
                Display on Homepage immediately
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-brand-primary hover:bg-brand-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow disabled:opacity-75"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save size={14} />
                    {isEditing ? 'Update Review' : 'Save Review'}
                  </>
                )}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-4 py-3 rounded-xl text-xs"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Testimonials List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:col-span-2 overflow-x-auto">
          <h3 className="text-lg font-bold text-brand-900 mb-4 border-b border-slate-50 pb-2">
            Active & Stored Testimonials
          </h3>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
              <p className="text-slate-500 font-medium text-xs">Loading testimonials feed...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-medium text-xs">
              No reviews stored yet. Create one on the left panel!
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.map(t => (
                <div 
                  key={t.id} 
                  className={`border rounded-2xl p-5 hover:border-slate-300 transition-all ${
                    t.isActive ? 'border-slate-100 bg-white' : 'border-slate-100 bg-slate-50/50 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    {/* User Profile info */}
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200">
                        <img 
                          src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                          alt={t.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{t.name}</h4>
                        <p className="text-slate-500 text-xs mt-0.5">{t.role}</p>
                        
                        {/* Stars */}
                        <div className="flex gap-0.5 mt-1.5 text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              fill={i < t.rating ? "currentColor" : "none"} 
                              className={i < t.rating ? "text-yellow-400" : "text-slate-300"} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions and Status */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2.5 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                      {/* Active Status toggle */}
                      <button
                        onClick={() => toggleActiveStatus(t)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                          t.isActive 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {t.isActive ? (
                          <>
                            <CheckCircle2 size={12} />
                            <span>Displayed</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={12} />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>

                      {/* Edit / Delete Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(t)}
                          className="p-2 bg-slate-50 border border-slate-200 text-slate-600 hover:text-brand-primary rounded-lg transition-all"
                          title="Edit Review"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(t.id)}
                          className="p-2 bg-red-50 border border-red-100 text-red-600 hover:text-red-700 rounded-lg transition-all"
                          title="Delete Review"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs mt-4 leading-relaxed font-medium bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    "{t.content}"
                  </p>
                  
                  {t.isFallback && (
                    <div className="text-[9px] text-brand-primary font-semibold mt-2 text-right">
                      * Running in Fallback Offline Mode
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsManager;
