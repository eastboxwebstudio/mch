import React, { useState, useEffect } from 'react';
import { Profile, UserRole, AvailabilityStatus } from '../types';
import { MockService } from '../services/mockService';

interface Props {
  userId: string;
}

export const AgentDashboard: React.FC<Props> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'profile'>('directory');
  const [seafarers, setSeafarers] = useState<Profile[]>([]);
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());
  
  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    const users = await MockService.getProfiles(UserRole.SEAFARER);
    const me = await MockService.getProfileById(userId);
    const myRequests = await MockService.getContactRequests(UserRole.AGENT, userId);
    
    setSeafarers(users);
    setMyProfile(me || null);
    setEditForm(me || {});
    setRequestedIds(new Set(myRequests.map(r => r.seafarer_id)));
    setLoading(false);
  };

  const handleRequestContact = async (seafarerId: string) => {
    await MockService.createContactRequest(userId, seafarerId);
    setRequestedIds(new Set([...requestedIds, seafarerId]));
    alert("Contact request sent to Admin.");
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myProfile) return;
    
    const updatedProfile = { ...editForm };
    await MockService.updateProfileStatus(myProfile.id, updatedProfile);
    setMyProfile({ ...myProfile, ...updatedProfile } as Profile);
    setIsEditing(false);
    alert("Company profile updated successfully.");
  };

  if (loading) return <div className="flex h-64 items-center justify-center text-slate-400">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Header with Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Agent Portal</h2>
           <p className="text-slate-500 mt-1">Manage crew sourcing and company details.</p>
        </div>
        
        <div className="bg-slate-100 p-1 rounded-lg flex items-center shadow-inner">
          <button 
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'directory' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Crew Directory
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'profile' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            My Company
          </button>
        </div>
      </div>

      {/* CREW DIRECTORY TAB */}
      {activeTab === 'directory' && (
        <>
          <div className="flex justify-end gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              Sort by Rank
            </button>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
              Filter Available
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seafarers.map(seafarer => {
                const isAvailable = seafarer.availability_status === AvailabilityStatus.AVAILABLE;
                const isRequested = requestedIds.has(seafarer.id);

                return (
                  <div key={seafarer.id} className="group bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 flex flex-col relative overflow-hidden">
                    {/* Status Strip */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${isAvailable ? 'bg-emerald-500' : 'bg-red-400'}`}></div>

                    <div className="flex justify-between items-start mb-5 pl-2">
                       <div>
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{seafarer.full_name}</h3>
                          <p className="text-blue-600 font-medium text-sm">{seafarer.rank}</p>
                       </div>
                       <div className="text-right">
                           <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">{seafarer.nationality}</span>
                       </div>
                    </div>
                    
                    <div className="space-y-3 mb-6 pl-2 flex-grow">
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                         <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Experience</span>
                         <span className="text-sm font-bold text-slate-900">{seafarer.years_of_experience} <span className="text-xs font-normal text-slate-500">Years</span></span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                         <div className="p-2 border border-slate-100 rounded-lg">
                            <span className="block text-slate-400 mb-1">Passport</span>
                            <span className="font-mono text-slate-700">{seafarer.ic_passport}</span>
                         </div>
                         <div className="p-2 border border-slate-100 rounded-lg">
                            <span className="block text-slate-400 mb-1">CoC</span>
                            <span className="block truncate text-slate-700" title={seafarer.coc}>{seafarer.coc}</span>
                         </div>
                      </div>
                    </div>

                    <div className="pl-2 mb-6">
                       <div className="flex flex-wrap gap-1.5">
                         {seafarer.ship_type_experience?.map(tag => (
                           <span key={tag} className="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-semibold uppercase tracking-wide rounded shadow-sm">
                             {tag}
                           </span>
                         ))}
                       </div>
                    </div>

                    <button 
                      onClick={() => handleRequestContact(seafarer.id)}
                      disabled={isRequested || !isAvailable}
                      className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isRequested 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : !isAvailable
                            ? 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98]'
                      }`}
                    >
                      {isRequested ? 'Request Pending' : isAvailable ? 'Request Contact' : 'Currently Onboard'}
                    </button>
                  </div>
                );
            })}
          </div>
        </>
      )}

      {/* COMPANY PROFILE TAB */}
      {activeTab === 'profile' && myProfile && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="text-lg font-bold text-slate-900">Company Information</h3>
               {!isEditing && (
                 <button 
                   onClick={() => setIsEditing(true)}
                   className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                 >
                   Edit Details
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                 </button>
               )}
             </div>
             
             <div className="p-8">
               {isEditing ? (
                 <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Company / Agency Name</label>
                      <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={editForm.full_name || ''}
                        onChange={e => setEditForm({...editForm, full_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">HQ Location / Nationality</label>
                      <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={editForm.nationality || ''}
                        onChange={e => setEditForm({...editForm, nationality: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Contact Email</label>
                      <input 
                        type="email" 
                        disabled
                        className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2 text-sm text-slate-500 cursor-not-allowed"
                        value={editForm.email || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Contact Phone</label>
                      <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={editForm.phone || ''}
                        onChange={e => setEditForm({...editForm, phone: e.target.value})}
                        placeholder="+1 234 567 890"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20"
                      >
                        Save Details
                      </button>
                    </div>
                 </form>
               ) : (
                 <div className="space-y-6">
                   <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-3xl">🏢</div>
                     <div>
                       <h2 className="text-xl font-bold text-slate-900">{myProfile.full_name}</h2>
                       <p className="text-slate-500 text-sm">{myProfile.nationality}</p>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Contact Email</span>
                        <span className="text-slate-900 font-medium">{myProfile.email}</span>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Phone Number</span>
                        <span className="text-slate-900 font-medium">{myProfile.phone || '—'}</span>
                     </div>
                   </div>
                   
                   <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 text-sm">
                      <p className="font-semibold mb-1">Subscription Status: <span className="text-emerald-600">Active</span></p>
                      <p className="opacity-80 text-xs">Your plan includes unlimited crew searches and 50 contact requests/month.</p>
                   </div>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};