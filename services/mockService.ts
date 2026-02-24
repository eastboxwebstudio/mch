import { 
  Profile, 
  EmploymentRecord, 
  ContactRequest, 
  UserRole, 
  AvailabilityStatus, 
  EmploymentStatus, 
  VerificationStatus,
  EventType,
  RequestStatus,
  SystemStats
} from '../types';

// Initial Mock Data
let profiles: Profile[] = [
  {
    id: 'u1',
    role: UserRole.SEAFARER,
    full_name: 'John Maritime',
    email: 'john@sea.com',
    rank: 'Captain',
    coc: 'Master Mariner Unlimited',
    ic_passport: 'A12345678',
    sid: 'MYS-SID-2023-001',
    phone: '+60 12-345 6789',
    nationality: 'Malaysia',
    years_of_experience: 12,
    ship_type_experience: ['Container', 'Bulker'],
    cert_basic_training_expiry: '2026-05-15',
    cert_adv_fire_fighting_expiry: '2025-11-20',
    cert_survival_craft_expiry: '2026-01-10',
    availability_status: AvailabilityStatus.AVAILABLE,
    employment_status: EmploymentStatus.SIGNED_OFF,
    last_sign_off_date: '2023-10-15'
  },
  {
    id: 'u2',
    role: UserRole.SEAFARER,
    full_name: 'Sarah Deck',
    email: 'sarah@sea.com',
    rank: 'Chief Officer',
    coc: 'Chief Mate Unlimited',
    ic_passport: 'B98765432',
    sid: 'SGP-SID-2022-888',
    phone: '+65 9123 4567',
    nationality: 'Singapore',
    years_of_experience: 8,
    ship_type_experience: ['Tanker'],
    cert_basic_training_expiry: '2024-12-01',
    cert_adv_fire_fighting_expiry: '2024-08-15',
    cert_survival_craft_expiry: '2025-03-30',
    availability_status: AvailabilityStatus.NOT_AVAILABLE,
    employment_status: EmploymentStatus.ONBOARD,
    last_sign_off_date: '2023-05-20'
  },
  {
    id: 'u3',
    role: UserRole.SEAFARER,
    full_name: 'Michael Engineer',
    email: 'mike@sea.com',
    rank: 'Chief Engineer',
    coc: 'Class 1 Motor',
    ic_passport: 'C11223344',
    sid: 'PHL-SID-2023-999',
    phone: '+63 912 345 6789',
    nationality: 'Philippines',
    years_of_experience: 15,
    ship_type_experience: ['LNG', 'LPG'],
    cert_basic_training_expiry: '2025-06-01',
    cert_adv_fire_fighting_expiry: '2025-06-01',
    cert_survival_craft_expiry: '2025-06-01',
    availability_status: AvailabilityStatus.AVAILABLE,
    employment_status: EmploymentStatus.SIGNED_OFF,
    last_sign_off_date: '2023-12-01'
  },
  {
    id: 'u4',
    role: UserRole.SEAFARER,
    full_name: 'Ahmed Al-Sayed',
    email: 'ahmed@sea.com',
    rank: 'Second Officer',
    coc: 'OOW Navigation',
    ic_passport: 'E99887766',
    sid: 'EGY-SID-2024-101',
    phone: '+20 10 1234 5678',
    nationality: 'Egypt',
    years_of_experience: 4,
    ship_type_experience: ['Container', 'General Cargo'],
    cert_basic_training_expiry: '2027-01-15',
    availability_status: AvailabilityStatus.AVAILABLE,
    employment_status: EmploymentStatus.INACTIVE
  },
  {
    id: 'u5',
    role: UserRole.SEAFARER,
    full_name: 'Elena Popov',
    email: 'elena@sea.com',
    rank: 'Third Engineer',
    coc: 'OOW Engineering',
    ic_passport: 'R55443322',
    sid: 'RUS-SID-2023-555',
    phone: '+7 999 123 45 67',
    nationality: 'Russia',
    years_of_experience: 3,
    ship_type_experience: ['Oil Tanker', 'Chemical Tanker'],
    cert_basic_training_expiry: '2026-08-20',
    availability_status: AvailabilityStatus.NOT_AVAILABLE,
    employment_status: EmploymentStatus.ONBOARD
  },
  {
    id: 'u6',
    role: UserRole.SEAFARER,
    full_name: 'James Cook',
    email: 'james@sea.com',
    rank: 'Captain',
    coc: 'Master Mariner Unlimited',
    ic_passport: 'K77665544',
    sid: 'UK-SID-2022-777',
    phone: '+44 7700 900123',
    nationality: 'United Kingdom',
    years_of_experience: 20,
    ship_type_experience: ['Bulker', 'Container', 'Ro-Ro'],
    cert_basic_training_expiry: '2025-03-10',
    availability_status: AvailabilityStatus.AVAILABLE,
    employment_status: EmploymentStatus.SIGNED_OFF,
    last_sign_off_date: '2024-01-15'
  },
  {
    id: 'a1',
    role: UserRole.AGENT,
    full_name: 'Global Crewing Agency',
    email: 'contact@globalcrewing.com',
    nationality: 'Singapore'
  },
  {
    id: 'a2',
    role: UserRole.AGENT,
    full_name: 'Pacific Manning Services',
    email: 'info@pacificmanning.com',
    nationality: 'Malaysia'
  },
  {
    id: 'ad1',
    role: UserRole.ADMIN,
    full_name: 'System Admin',
    email: 'admin@mch.com'
  }
];

let employmentRecords: EmploymentRecord[] = [
  {
    id: 'er1',
    seafarer_id: 'u1',
    event_type: EventType.SIGN_OFF,
    vessel_name: 'MV Pacific',
    event_date: '2023-10-15',
    port: 'Singapore',
    source: 'Seafarer',
    verification_status: VerificationStatus.VERIFIED
  },
  {
    id: 'er2',
    seafarer_id: 'u2',
    event_type: EventType.SIGN_ON,
    vessel_name: 'MT Atlantic',
    event_date: '2023-11-01',
    port: 'Rotterdam',
    source: 'Shipowner',
    verification_status: VerificationStatus.VERIFIED
  },
  {
    id: 'er3',
    seafarer_id: 'u3',
    event_type: EventType.SIGN_OFF,
    vessel_name: 'LNG Explorer',
    event_date: '2023-12-01',
    port: 'Manila',
    source: 'Seafarer',
    verification_status: VerificationStatus.PENDING
  }
];

let contactRequests: ContactRequest[] = [
  {
    id: 'cr1',
    requester_id: 'a1',
    seafarer_id: 'u1',
    status: RequestStatus.PENDING,
    created_at: '2023-11-10T10:00:00Z',
    requester_name: 'Global Crewing Agency',
    seafarer_name: 'John Maritime'
  }
];

// Helper to simulate DB Delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockService = {
  getProfiles: async (role?: UserRole): Promise<Profile[]> => {
    await delay(300);
    if (role) return profiles.filter(p => p.role === role);
    return profiles;
  },

  getProfileById: async (id: string): Promise<Profile | undefined> => {
    await delay(100);
    return profiles.find(p => p.id === id);
  },

  updateProfileStatus: async (id: string, updates: Partial<Profile>): Promise<Profile> => {
    await delay(300);
    const index = profiles.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Profile not found");
    profiles[index] = { ...profiles[index], ...updates };
    return profiles[index];
  },

  getEmploymentRecords: async (seafarerId?: string): Promise<EmploymentRecord[]> => {
    await delay(300);
    if (seafarerId) return employmentRecords.filter(r => r.seafarer_id === seafarerId);
    return employmentRecords;
  },

  getAllPendingEmploymentRecords: async (): Promise<EmploymentRecord[]> => {
    await delay(300);
    return employmentRecords.filter(r => r.verification_status === VerificationStatus.PENDING);
  },

  createEmploymentRecord: async (record: Omit<EmploymentRecord, 'id' | 'verification_status'>): Promise<EmploymentRecord> => {
    await delay(300);
    const newRecord: EmploymentRecord = {
      ...record,
      id: Math.random().toString(36).substr(2, 9),
      verification_status: VerificationStatus.PENDING
    };
    employmentRecords.push(newRecord);
    return newRecord;
  },

  // This function simulates the Edge Function / DB Trigger Logic
  verifyEmploymentRecord: async (recordId: string, status: VerificationStatus): Promise<EmploymentRecord> => {
    await delay(300);
    const index = employmentRecords.findIndex(r => r.id === recordId);
    if (index === -1) throw new Error("Record not found");
    
    const record = employmentRecords[index];
    record.verification_status = status;
    employmentRecords[index] = record;

    // SIMULATING THE DB TRIGGER LOGIC HERE
    if (status === VerificationStatus.VERIFIED) {
      const seafarerIndex = profiles.findIndex(p => p.id === record.seafarer_id);
      if (seafarerIndex !== -1) {
        if (record.event_type === EventType.SIGN_ON) {
          profiles[seafarerIndex].employment_status = EmploymentStatus.ONBOARD;
          profiles[seafarerIndex].availability_status = AvailabilityStatus.NOT_AVAILABLE;
        } else if (record.event_type === EventType.SIGN_OFF) {
          profiles[seafarerIndex].employment_status = EmploymentStatus.SIGNED_OFF;
          profiles[seafarerIndex].availability_status = AvailabilityStatus.AVAILABLE;
          profiles[seafarerIndex].last_sign_off_date = record.event_date;
        }
      }
    } else if (status === VerificationStatus.FLAGGED) {
       console.warn(`System Flag raised for record ${record.id}`);
       // In a real app, this would insert into system_flags table
    }

    return record;
  },

  getContactRequests: async (role?: UserRole, userId?: string): Promise<ContactRequest[]> => {
    await delay(300);
    if (role === UserRole.ADMIN) return contactRequests;
    if (role === UserRole.AGENT && userId) return contactRequests.filter(r => r.requester_id === userId);
    if (role === UserRole.SEAFARER && userId) return contactRequests.filter(r => r.seafarer_id === userId);
    return contactRequests;
  },

  createContactRequest: async (requesterId: string, seafarerId: string): Promise<ContactRequest> => {
    await delay(300);
    const requester = profiles.find(p => p.id === requesterId);
    const seafarer = profiles.find(p => p.id === seafarerId);
    
    const newReq: ContactRequest = {
      id: Math.random().toString(36).substr(2, 9),
      requester_id: requesterId,
      seafarer_id: seafarerId,
      status: RequestStatus.PENDING,
      created_at: new Date().toISOString(),
      requester_name: requester?.full_name,
      seafarer_name: seafarer?.full_name
    };
    contactRequests.push(newReq);
    return newReq;
  },

  reviewContactRequest: async (requestId: string, status: RequestStatus): Promise<ContactRequest> => {
    await delay(300);
    const index = contactRequests.findIndex(r => r.id === requestId);
    if (index === -1) throw new Error("Request not found");
    contactRequests[index].status = status;
    contactRequests[index].admin_reviewed_at = new Date().toISOString();
    return contactRequests[index];
  },

  // NEW: System Statistics for Admin Dashboard
  getSystemStats: async (): Promise<SystemStats> => {
    // If using Google Sheets, fetch real data
    if (import.meta.env.VITE_USE_GOOGLE_SHEETS === 'true') {
      try {
        const profiles = await MockService.getProfiles();
        const records = await MockService.getEmploymentRecords();
        const requests = await MockService.getContactRequests();
        
        return {
          totalSeafarers: profiles.filter(p => p.role === UserRole.SEAFARER).length,
          seafarersOnboard: profiles.filter(p => p.employment_status === EmploymentStatus.ONBOARD).length,
          totalAgents: profiles.filter(p => p.role === UserRole.AGENT).length,
          pendingVerifications: records.filter(r => r.verification_status === VerificationStatus.PENDING).length,
          pendingRequests: requests.filter(r => r.status === RequestStatus.PENDING).length
        };
      } catch (e) {
        console.error("Failed to fetch stats from Google Sheets", e);
        return { totalSeafarers: 0, seafarersOnboard: 0, totalAgents: 0, pendingVerifications: 0, pendingRequests: 0 };
      }
    }

    await delay(300);
    return {
      totalSeafarers: profiles.filter(p => p.role === UserRole.SEAFARER).length,
      seafarersOnboard: profiles.filter(p => p.employment_status === EmploymentStatus.ONBOARD).length,
      totalAgents: profiles.filter(p => p.role === UserRole.AGENT).length,
      pendingVerifications: employmentRecords.filter(r => r.verification_status === VerificationStatus.PENDING).length,
      pendingRequests: contactRequests.filter(r => r.status === RequestStatus.PENDING).length
    };
  },

  // Auth Simulation
  login: async (email: string): Promise<Profile | undefined> => {
    if (import.meta.env.VITE_USE_GOOGLE_SHEETS === 'true') {
      const allProfiles = await MockService.getProfiles();
      return allProfiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    }
    await delay(800); // Simulate network request
    return profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
  },

  getDemoUsers: () => {
    // Return one of each role for the login screen demo
    const seafarer = profiles.find(p => p.role === UserRole.SEAFARER);
    const agent = profiles.find(p => p.role === UserRole.AGENT);
    const admin = profiles.find(p => p.role === UserRole.ADMIN);
    
    return [seafarer, agent, admin]
      .filter((p): p is Profile => !!p)
      .map(p => ({ 
        email: p.email, 
        role: p.role, 
        name: p.full_name 
      }));
  }
};

// --- GOOGLE SHEETS API HELPER (Via Google Apps Script) ---
// To use this, you must deploy a Google Apps Script attached to your Google Sheet.
// See DEPLOYMENT_GUIDE.md for the Apps Script code.
const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

const api = {
  get: async (action: string, params: Record<string, any> = {}) => {
    if (!API_URL) throw new Error("VITE_APPS_SCRIPT_URL is not set");
    
    const url = new URL(API_URL);
    url.searchParams.append('action', action);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, String(value));
    });

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch ${action}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.data;
  },
  
  post: async (action: string, payload: any) => {
    if (!API_URL) throw new Error("VITE_APPS_SCRIPT_URL is not set");
    
    // Note: Google Apps Script web apps often require 'text/plain' or 'application/x-www-form-urlencoded' 
    // to avoid CORS preflight issues when sending POST requests from a browser.
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action, payload }),
      // headers: { 'Content-Type': 'application/json' } // Often causes CORS issues with GAS
    });
    
    if (!res.ok) throw new Error(`Failed to post to ${action}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.data;
  }
};

// Override methods if Google Sheets mode is active
if (import.meta.env.VITE_USE_GOOGLE_SHEETS === 'true') {
  console.log("Using Google Sheets (Apps Script) as Database");
  
  MockService.getProfiles = async (role?: UserRole) => {
    const data = await api.get('getProfiles', { role });
    // Parse JSON strings back to arrays/objects if needed
    return data.map((p: any) => ({
      ...p,
      ship_type_experience: typeof p.ship_type_experience === 'string' && p.ship_type_experience ? p.ship_type_experience.split(',') : p.ship_type_experience || [],
      years_of_experience: Number(p.years_of_experience) || 0
    }));
  };

  MockService.getProfileById = async (id: string) => {
    const profiles = await MockService.getProfiles();
    return profiles.find(p => p.id === id);
  };

  MockService.updateProfileStatus = async (id: string, updates: Partial<Profile>) => {
    const payload = { id, ...updates };
    if (Array.isArray(payload.ship_type_experience)) {
      (payload as any).ship_type_experience = payload.ship_type_experience.join(',');
    }
    await api.post('updateProfile', payload);
    return { id, ...updates } as Profile; 
  };

  MockService.getEmploymentRecords = async (seafarerId?: string) => {
    return await api.get('getEmploymentRecords', { seafarerId });
  };

  MockService.createEmploymentRecord = async (record) => {
    const newRecord = {
      ...record,
      id: Math.random().toString(36).substr(2, 9),
      verification_status: VerificationStatus.PENDING,
      created_at: new Date().toISOString()
    };
    await api.post('createEmploymentRecord', newRecord);
    return newRecord;
  };

  MockService.verifyEmploymentRecord = async (recordId, status) => {
    await api.post('updateEmploymentRecord', { id: recordId, verification_status: status });
    
    if (status === VerificationStatus.VERIFIED) {
        const records = await MockService.getEmploymentRecords();
        const record = records.find(r => r.id === recordId);
        if (record) {
            const updates: any = {};
            if (record.event_type === EventType.SIGN_ON) {
                updates.employment_status = EmploymentStatus.ONBOARD;
                updates.availability_status = AvailabilityStatus.NOT_AVAILABLE;
            } else {
                updates.employment_status = EmploymentStatus.SIGNED_OFF;
                updates.availability_status = AvailabilityStatus.AVAILABLE;
                updates.last_sign_off_date = record.event_date;
            }
            await MockService.updateProfileStatus(record.seafarer_id, updates);
        }
    }
    return { id: recordId, verification_status: status } as EmploymentRecord;
  };
  
  MockService.getContactRequests = async (role?: UserRole, userId?: string) => {
      return await api.get('getContactRequests', { role, userId });
  };
}