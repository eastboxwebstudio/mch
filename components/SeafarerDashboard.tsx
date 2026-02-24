import React, { useState, useEffect } from 'react';
import { Profile, EmploymentRecord, EmploymentStatus, AvailabilityStatus, EventType } from '../types';
import { MockService } from '../services/mockService';

interface Props {
  userId: string;
}

export const SeafarerDashboard: React.FC<Props> = ({ userId }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [history, setHistory] = useState<EmploymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit Form State
  const [editForm, setEditForm] = useState<Partial<Profile>>({});

  // Movement Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEvent, setNewEvent] = useState<{ type: EventType; vessel: string; port: string; date: string }>({
    type: EventType.SIGN_ON,
    vessel: '',
    port: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    const p = await MockService.getProfileById(userId);
    const h = await MockService.getEmploymentRecords(userId);
    setProfile(p || null);
    setEditForm(p || {});
    setHistory(h);
    setLoading(false);
  };

  const toggleAvailability = async () => {
    if (!profile) return;
    const newStatus = profile.availability_status === AvailabilityStatus.AVAILABLE 
      ? AvailabilityStatus.NOT_AVAILABLE 
      : AvailabilityStatus.AVAILABLE;
    
    // Optimistic update
    setProfile({ ...profile, availability_status: newStatus });
    await MockService.updateProfileStatus(profile.id, { availability_status: newStatus });
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSubmitting(true);
    
    await MockService.createEmploymentRecord({
      seafarer_id: profile.id,
      event_type: newEvent.type,
      vessel_name: newEvent.vessel,
      port: newEvent.port,
      event_date: newEvent.date,
      source: 'Seafarer'
    });

    setNewEvent({ ...newEvent, vessel: '', port: '' });
    await loadData();
    setIsSubmitting(false);
    alert('Employment record submitted for verification.');
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    // Convert comma separated string to array for ship types if needed
    const updatedProfile = { ...editForm };
    
    await MockService.updateProfileStatus(profile.id, updatedProfile);
    setProfile({ ...profile, ...updatedProfile } as Profile);
    setIsEditing(false);
    alert("Profile updated successfully.");
  };

  const getExpiryStatusColor = (dateString?: string) => {
    if (!dateString) return 'text-slate-400';
    const date = new Date(dateString);
    const now = new Date();
    const monthsDiff = (date.getTime() - now.getTime()) / (1000 * 3600 * 24 * 30);
    
    if (date < now) return 'text-red-500 font-bold'; 
    if (monthsDiff < 6) return 'text-amber-500 font-medium'; 
    return 'text-emerald-600 font-medium';
  };

  if (loading) return <div className="flex h-64 items-center justify-center text-slate-400">Loading profile data...</div>;
  if (!profile) return <div className="p-8 text-center text-red-500">Profile not found.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
      
      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-900">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-8">
              {/* Personal Section */}
              <section className="space-y-4">
                <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide">Personal Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editForm.full_name || ''}
                      onChange={e => setEditForm({...editForm, full_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Nationality</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editForm.nationality || ''}
                      onChange={e => setEditForm({...editForm, nationality: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editForm.phone || ''}
                      onChange={e => setEditForm({...editForm, phone: e.target.value})}
                    />
                  </div>
                   <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Email (Read Only)</label>
                    <input 
                      type="text" 
                      disabled
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                      value={editForm.email || ''}
                    />
                  </div>
                </div>
              </section>

              {/* Professional Section */}
              <section className="space-y-4 border-t border-slate-100 pt-6">
                <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide">Professional Info</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Rank</label>
                    <select 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editForm.rank || ''}
                      onChange={e => setEditForm({...editForm, rank: e.target.value})}
                    >
                      <option value="Captain">Captain</option>
                      <option value="Chief Officer">Chief Officer</option>
                      <option value="Second Officer">Second Officer</option>
                      <option value="Chief Engineer">Chief Engineer</option>
                      <option value="Second Engineer">Second Engineer</option>
                      <option value="Able Seaman">Able Seaman</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Years of Experience</label>
                    <input 
                      type="number" 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editForm.years_of_experience || 0}
                      onChange={e => setEditForm({...editForm, years_of_experience: Number(e.target.value)})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Certificate of Competency (CoC)</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editForm.coc || ''}
                      onChange={e => setEditForm({...editForm, coc: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-xs font-semibold text-slate-500 mb-1">Ship Types (Comma separated)</label>
                     <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editForm.ship_type_experience?.join(', ') || ''}
                      onChange={e => setEditForm({...editForm, ship_type_experience: e.target.value.split(',').map(s => s.trim())})}
                      placeholder="e.g. Tanker, LNG, Bulk Carrier"
                    />
                  </div>
                </div>
              </section>

              {/* Documents & Certs */}
              <section className="space-y-4 border-t border-slate-100 pt-6">
                <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide">Documents & Certificates</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Passport Number</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      value={editForm.ic_passport || ''}
                      onChange={e => setEditForm({...editForm, ic_passport: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">SID Number</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      value={editForm.sid || ''}
                      onChange={e => setEditForm({...editForm, sid: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                   <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase">Basic Training Expiry</label>
                      <input 
                        type="date" 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                        value={editForm.cert_basic_training_expiry || ''}
                        onChange={e => setEditForm({...editForm, cert_basic_training_expiry: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase">Adv. Fire Fighting Expiry</label>
                      <input 
                        type="date" 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                        value={editForm.cert_adv_fire_fighting_expiry || ''}
                        onChange={e => setEditForm({...editForm, cert_adv_fire_fighting_expiry: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase">Survival Craft Expiry</label>
                      <input 
                        type="date" 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                        value={editForm.cert_survival_craft_expiry || ''}
                        onChange={e => setEditForm({...editForm, cert_survival_craft_expiry: e.target.value})}
                      />
                   </div>
                </div>
              </section>

              <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-slate-100 pb-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEFT COLUMN: PROFILE CARD */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-28 group relative">
          
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="Edit Profile"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </button>

          {/* Header Profile */}
          <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center text-4xl shadow-inner border border-blue-100">
                👨‍✈️
              </div>
              <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-white ${profile.availability_status === AvailabilityStatus.AVAILABLE ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{profile.full_name}</h2>
            <p className="text-blue-600 font-medium text-sm mt-1">{profile.rank}</p>
            <p className="text-slate-400 text-xs mt-1 uppercase tracking-wide font-medium">{profile.nationality}</p>
          </div>

          {/* Status Actions */}
          <div className="py-6 space-y-3">
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Employment</span>
                  <span className={`text-sm font-semibold ${profile.employment_status === EmploymentStatus.ONBOARD ? 'text-blue-600' : 'text-slate-700'}`}>
                    {profile.employment_status.replace('_', ' ')}
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</span>
                  <button 
                    onClick={toggleAvailability}
                    className={`text-xs px-2 py-0.5 rounded-md font-medium transition-colors ${
                      profile.availability_status === AvailabilityStatus.AVAILABLE 
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {profile.availability_status}
                  </button>
                </div>
             </div>
          </div>

          {/* Documents */}
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Documents</h3>
              <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Passport</span>
                   <span className="font-mono text-slate-700 font-medium">{profile.ic_passport || '—'}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">SID</span>
                   <span className="font-mono text-slate-700 font-medium">{profile.sid || '—'}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Total Exp.</span>
                   <span className="text-slate-900 font-medium">{profile.years_of_experience} Years</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Phone</span>
                   <span className="text-slate-700">{profile.phone || '—'}</span>
                 </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Certificates</h3>
              <div className="space-y-3">
                 {[
                   { label: 'Basic Training', date: profile.cert_basic_training_expiry },
                   { label: 'Adv. Fire Fighting', date: profile.cert_adv_fire_fighting_expiry },
                   { label: 'Survival Craft', date: profile.cert_survival_craft_expiry }
                 ].map((cert, i) => (
                   <div key={i} className="flex justify-between items-center text-sm group">
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${cert.date && new Date(cert.date) < new Date() ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                         <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{cert.label}</span>
                      </div>
                      <span className={`font-mono text-xs ${getExpiryStatusColor(cert.date)}`}>
                        {cert.date || 'N/A'}
                      </span>
                   </div>
                 ))}
                 <div className="pt-3 mt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Certificate of Competency</p>
                    <p className="text-sm font-medium text-slate-800 leading-tight">{profile.coc || 'Not set'}</p>
                 </div>
              </div>
            </div>
            
             <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Experience</h3>
              <div className="flex flex-wrap gap-2">
                {profile.ship_type_experience && profile.ship_type_experience.length > 0 ? profile.ship_type_experience.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-md shadow-sm">
                    {tag}
                  </span>
                )) : <span className="text-xs text-slate-400 italic">No specific experience listed</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIONS & HISTORY */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Modern Form */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
             <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Report Movement</h3>
             <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-medium">New Entry</span>
          </div>
          <div className="p-6">
            <form onSubmit={handleEventSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Event Type</label>
                <div className="relative">
                   <select 
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value as EventType})}
                  >
                    <option value={EventType.SIGN_ON}>Sign On (Embark)</option>
                    <option value={EventType.SIGN_OFF}>Sign Off (Disembark)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vessel Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                  value={newEvent.vessel}
                  onChange={(e) => setNewEvent({...newEvent, vessel: e.target.value})}
                  placeholder="e.g. MV Pacific Star"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Port Location</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                  value={newEvent.port}
                  onChange={(e) => setNewEvent({...newEvent, port: e.target.value})}
                  placeholder="e.g. Singapore"
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting Record...' : 'Submit Employment Record'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Modern List/Table */}
        <section>
           <h3 className="text-lg font-bold text-slate-900 mb-4 px-1">Employment History</h3>
           {history.length === 0 ? (
             <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
               <p className="text-slate-400 text-sm">No records found. Submit your first movement above.</p>
             </div>
           ) : (
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                     <tr>
                       <th className="px-6 py-4 font-semibold w-10"></th>
                       <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Event</th>
                       <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Vessel / Port</th>
                       <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Date</th>
                       <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider text-right">Verification</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {history.map(record => (
                       <tr key={record.id} className="group hover:bg-slate-50/50 transition-colors">
                         <td className="px-6 py-4">
                           <div className={`w-2 h-2 rounded-full ${record.event_type === EventType.SIGN_ON ? 'bg-blue-500' : 'bg-orange-400'}`}></div>
                         </td>
                         <td className="px-6 py-4">
                           <span className={`font-semibold ${record.event_type === EventType.SIGN_ON ? 'text-slate-900' : 'text-slate-500'}`}>
                             {record.event_type}
                           </span>
                         </td>
                         <td className="px-6 py-4">
                           <div className="flex flex-col">
                             <span className="font-medium text-slate-900">{record.vessel_name}</span>
                             <span className="text-xs text-slate-400">{record.port}</span>
                           </div>
                         </td>
                         <td className="px-6 py-4 font-mono text-slate-600 text-xs">
                           {record.event_date}
                         </td>
                         <td className="px-6 py-4 text-right">
                           <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                             record.verification_status === 'Verified' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                             record.verification_status === 'Flagged' ? 'bg-red-50 border-red-100 text-red-700' :
                             'bg-amber-50 border-amber-100 text-amber-700'
                           }`}>
                             {record.verification_status}
                           </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
           )}
        </section>
      </div>
    </div>
  );
};