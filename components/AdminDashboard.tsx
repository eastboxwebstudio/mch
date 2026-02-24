import React, { useState, useEffect } from 'react';
import { EmploymentRecord, ContactRequest, VerificationStatus, RequestStatus, UserRole, Profile, SystemStats } from '../types';
import { MockService } from '../services/mockService';

type AdminSection = 'overview' | 'users' | 'verification' | 'requests' | 'reports';

export const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [pendingRecords, setPendingRecords] = useState<EmploymentRecord[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ContactRequest[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const s = await MockService.getSystemStats();
    const records = await MockService.getAllPendingEmploymentRecords();
    const requests = (await MockService.getContactRequests(UserRole.ADMIN)).filter(r => r.status === RequestStatus.PENDING);
    const users = await MockService.getProfiles(); // Get all users
    
    setStats(s);
    setPendingRecords(records);
    setPendingRequests(requests);
    setAllUsers(users);
    setLoading(false);
  };

  const handleVerifyRecord = async (id: string, action: 'verify' | 'flag') => {
    const status = action === 'verify' ? VerificationStatus.VERIFIED : VerificationStatus.FLAGGED;
    await MockService.verifyEmploymentRecord(id, status);
    setPendingRecords(prev => prev.filter(r => r.id !== id));
    // Refresh stats lightly
    setStats(prev => prev ? { ...prev, pendingVerifications: prev.pendingVerifications - 1 } : null);
    alert(action === 'verify' ? `Record verified.` : `Record flagged.`);
  };

  const handleReviewRequest = async (id: string, action: 'approve' | 'reject') => {
    const status = action === 'approve' ? RequestStatus.APPROVED : RequestStatus.REJECTED;
    await MockService.reviewContactRequest(id, status);
    setPendingRequests(prev => prev.filter(r => r.id !== id));
    setStats(prev => prev ? { ...prev, pendingRequests: prev.pendingRequests - 1 } : null);
  };

  if (loading) return <div className="flex h-96 items-center justify-center text-slate-400">Loading control panel...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-28">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Control Panel</h3>
          </div>
          <nav className="p-2 space-y-1">
            <button 
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === 'overview' ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="text-lg">📊</span> Overview
            </button>
            <button 
              onClick={() => setActiveSection('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === 'users' ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="text-lg">👥</span> User Management
            </button>
            <button 
              onClick={() => setActiveSection('verification')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === 'verification' ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3"><span className="text-lg">✓</span> Verifications</div>
              {pendingRecords.length > 0 && <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingRecords.length}</span>}
            </button>
            <button 
              onClick={() => setActiveSection('requests')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === 'requests' ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3"><span className="text-lg">🔑</span> Access Requests</div>
              {pendingRequests.length > 0 && <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingRequests.length}</span>}
            </button>
             <button 
              onClick={() => setActiveSection('reports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === 'reports' ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="text-lg">📈</span> Reporting
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* OVERVIEW SECTION */}
        {activeSection === 'overview' && stats && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Overview</h2>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Seafarers</div>
                 <div className="text-3xl font-bold text-slate-900">{stats.totalSeafarers}</div>
                 <div className="text-emerald-600 text-xs mt-1">Registered users</div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Currently Onboard</div>
                 <div className="text-3xl font-bold text-blue-600">{stats.seafarersOnboard}</div>
                 <div className="text-slate-400 text-xs mt-1">Active at sea</div>
              </div>
               <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Agents & Owners</div>
                 <div className="text-3xl font-bold text-slate-900">{stats.totalAgents}</div>
                 <div className="text-slate-400 text-xs mt-1">Partner accounts</div>
              </div>
               <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                 <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Pending Tasks</div>
                 <div className="text-3xl font-bold text-orange-500">{stats.pendingVerifications + stats.pendingRequests}</div>
                 <div className="text-slate-400 text-xs mt-1">Requires attention</div>
              </div>
            </div>

            {/* Recent Activity Mockup */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-sm">Recent System Activity</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {[1,2,3].map((_, i) => (
                  <div key={i} className="p-4 flex gap-4 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5"></div>
                    <div>
                      <p className="text-slate-800">New employment record submitted by <span className="font-medium">John Maritime</span>.</p>
                      <p className="text-slate-400 text-xs mt-0.5">{i * 15 + 5} minutes ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS SECTION */}
        {activeSection === 'users' && (
           <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Seafarer Directory</h2>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-black shadow-lg shadow-slate-900/10">Add User</button>
             </div>

             {/* Advanced Search Filter */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
               <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Filter Criteria</h3>
                  <button 
                    onClick={() => {
                      // Reset filters
                      const inputs = document.querySelectorAll('input, select');
                      inputs.forEach((input: any) => input.value = '');
                      // Trigger re-render or state update if using controlled components
                      setAllUsers([...allUsers]); // Simple trigger
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Reset Filters
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Rank</label>
                    <select 
                      id="filter-rank"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={(e) => {
                         // Basic client-side filtering logic for demo
                         const val = e.target.value.toLowerCase();
                         const filtered = allUsers.filter(u => !val || u.rank?.toLowerCase().includes(val));
                         // In a real app, this would update a filter state object
                      }}
                    >
                      <option value="">All Ranks</option>
                      <option value="Captain">Captain</option>
                      <option value="Chief Officer">Chief Officer</option>
                      <option value="Chief Engineer">Chief Engineer</option>
                      <option value="Second Engineer">Second Engineer</option>
                      <option value="Able Seaman">Able Seaman</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Ship Type Exp.</label>
                    <input 
                      id="filter-ship"
                      type="text" 
                      placeholder="e.g. LNG, Bulker" 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Nationality</label>
                    <input 
                      id="filter-nation"
                      type="text" 
                      placeholder="e.g. Malaysia" 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Min. Experience</label>
                    <div className="flex items-center gap-2">
                      <input 
                        id="filter-exp"
                        type="number" 
                        placeholder="0" 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <span className="text-xs text-slate-400">Years</span>
                    </div>
                  </div>
               </div>
               
               <div className="pt-2 flex justify-end">
                 <button 
                   onClick={() => {
                      const rank = (document.getElementById('filter-rank') as HTMLSelectElement).value.toLowerCase();
                      const ship = (document.getElementById('filter-ship') as HTMLInputElement).value.toLowerCase();
                      const nation = (document.getElementById('filter-nation') as HTMLInputElement).value.toLowerCase();
                      const exp = Number((document.getElementById('filter-exp') as HTMLInputElement).value);

                      // Re-fetch original list first to ensure clean filter
                      MockService.getProfiles().then(users => {
                        const filtered = users.filter(u => {
                          if (u.role !== UserRole.SEAFARER) return false; // Only show seafarers in directory
                          
                          const matchRank = !rank || u.rank?.toLowerCase().includes(rank);
                          const matchShip = !ship || u.ship_type_experience?.some(s => s.toLowerCase().includes(ship));
                          const matchNation = !nation || u.nationality?.toLowerCase().includes(nation);
                          const matchExp = !exp || (u.years_of_experience || 0) >= exp;
                          
                          return matchRank && matchShip && matchNation && matchExp;
                        });
                        setAllUsers(filtered);
                      });
                   }}
                   className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all"
                 >
                   Search Directory
                 </button>
               </div>
             </div>

             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Search Results ({allUsers.length})</span>
               </div>
               <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Name / Rank</th>
                      <th className="px-6 py-3 font-semibold">Experience</th>
                      <th className="px-6 py-3 font-semibold">Ship Types</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                          No seafarers found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      allUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50/50 group">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                                👨‍✈️
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">{user.full_name}</div>
                                <div className="text-xs text-blue-600 font-medium">{user.rank} • {user.nationality}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <span className="font-mono text-slate-700 font-medium">{user.years_of_experience} Yrs</span>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex flex-wrap gap-1">
                              {user.ship_type_experience?.slice(0, 2).map(t => (
                                <span key={t} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600">{t}</span>
                              ))}
                              {(user.ship_type_experience?.length || 0) > 2 && (
                                <span className="px-1.5 py-0.5 bg-slate-50 text-[10px] text-slate-400">+{ (user.ship_type_experience?.length || 0) - 2 }</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                              user.availability_status === 'Available' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                : 'bg-red-50 text-red-700 border-red-100'
                            }`}>
                              {user.availability_status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <button className="text-blue-600 hover:text-blue-800 font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity">View Profile</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
               </table>
               </div>
             </div>
           </div>
        )}

        {/* VERIFICATION TASK SECTION */}
        {activeSection === 'verification' && (
           <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Pending Verifications</h2>
              {pendingRecords.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400">
                  No pending employment records to verify.
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Seafarer</th>
                        <th className="px-6 py-3 font-semibold">Event</th>
                        <th className="px-6 py-3 font-semibold">Vessel</th>
                        <th className="px-6 py-3 font-semibold">Source</th>
                        <th className="px-6 py-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {pendingRecords.map(record => (
                        <tr key={record.id}>
                          <td className="px-6 py-3 text-slate-900 font-medium">
                            {allUsers.find(u => u.id === record.seafarer_id)?.full_name || record.seafarer_id}
                          </td>
                          <td className="px-6 py-3">
                             <span className={`font-semibold ${record.event_type === 'Sign On' ? 'text-blue-600' : 'text-orange-500'}`}>
                              {record.event_type}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                             <div className="text-slate-900 font-medium">{record.vessel_name}</div>
                             <div className="text-slate-500 text-xs">{record.port} • {record.event_date}</div>
                          </td>
                           <td className="px-6 py-3">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200 text-slate-600">{record.source}</span>
                          </td>
                          <td className="px-6 py-3 text-right space-x-2">
                             <button 
                                onClick={() => handleVerifyRecord(record.id, 'flag')}
                                className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded hover:bg-red-50 hover:text-red-600 text-xs font-semibold transition-colors"
                              >
                                Flag
                              </button>
                              <button 
                                onClick={() => handleVerifyRecord(record.id, 'verify')}
                                className="px-3 py-1 bg-slate-900 text-white rounded hover:bg-black text-xs font-semibold shadow-md shadow-slate-900/10 transition-colors"
                              >
                                Verify
                              </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
           </div>
        )}

         {/* REQUESTS SECTION */}
        {activeSection === 'requests' && (
           <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Access Requests</h2>
              {pendingRequests.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400">
                  No pending access requests.
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Requester</th>
                        <th className="px-6 py-3 font-semibold">Target</th>
                        <th className="px-6 py-3 font-semibold">Requested At</th>
                        <th className="px-6 py-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {pendingRequests.map(req => (
                        <tr key={req.id}>
                          <td className="px-6 py-3 font-medium text-slate-900">{req.requester_name}</td>
                          <td className="px-6 py-3 font-medium text-blue-600">{req.seafarer_name}</td>
                          <td className="px-6 py-3 text-slate-500">{new Date(req.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-3 text-right space-x-2">
                            <button 
                               onClick={() => handleReviewRequest(req.id, 'reject')}
                               className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded hover:bg-slate-100 text-xs font-semibold transition-colors"
                            >
                              Reject
                            </button>
                            <button 
                               onClick={() => handleReviewRequest(req.id, 'approve')}
                               className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-semibold shadow-md shadow-blue-600/20 transition-colors"
                            >
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
           </div>
        )}

        {/* REPORTS SECTION */}
        {activeSection === 'reports' && (
           <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Reports</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-4">Seafarer Distribution by Rank</h3>
                   <div className="space-y-4">
                      {/* Simulated Chart Bars */}
                      <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-600">
                          <span>Captain / Master</span>
                          <span>35%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full w-[35%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-600">
                          <span>Chief Officer</span>
                          <span>25%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full w-[25%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-600">
                          <span>Chief Engineer</span>
                          <span>20%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-blue-400 h-2 rounded-full w-[20%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-600">
                          <span>Others</span>
                          <span>20%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-slate-300 h-2 rounded-full w-[20%]"></div>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-4">Platform Growth (This Month)</h3>
                   <div className="flex items-end space-x-4 h-32 pt-4 border-b border-slate-100">
                      <div className="w-1/5 bg-blue-100 rounded-t h-[40%]"></div>
                      <div className="w-1/5 bg-blue-200 rounded-t h-[60%]"></div>
                      <div className="w-1/5 bg-blue-300 rounded-t h-[45%]"></div>
                      <div className="w-1/5 bg-blue-400 rounded-t h-[80%]"></div>
                      <div className="w-1/5 bg-blue-600 rounded-t h-[95%]"></div>
                   </div>
                   <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>Week 1</span>
                      <span>Week 5</span>
                   </div>
                   <div className="mt-4 text-center">
                      <p className="text-3xl font-bold text-slate-900">+12%</p>
                      <p className="text-xs text-slate-500">Increase in verification requests</p>
                   </div>
                </div>
              </div>
           </div>
        )}

      </main>
    </div>
  );
};