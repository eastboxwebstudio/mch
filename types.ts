export enum UserRole {
  SEAFARER = 'seafarer',
  AGENT = 'agent',
  ADMIN = 'admin',
  PORT_OFFICER = 'port_officer'
}

export enum EmploymentStatus {
  ONBOARD = 'Onboard',
  SIGNED_OFF = 'Signed_off',
  INACTIVE = 'Inactive'
}

export enum AvailabilityStatus {
  AVAILABLE = 'Available',
  NOT_AVAILABLE = 'Not Available'
}

export enum VerificationStatus {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  FLAGGED = 'Flagged'
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum EventType {
  SIGN_ON = 'Sign On',
  SIGN_OFF = 'Sign Off'
}

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  
  // Professional Details
  rank?: string;
  coc?: string; // Certificate of Competency
  ship_type_experience?: string[];
  years_of_experience?: number;
  
  // Personal & Documents
  ic_passport?: string;
  sid?: string; // Seafarer's Identification Document
  phone?: string;
  nationality?: string; // Maps to STATE/COUNTRY
  
  // Certificate Expiry Dates
  cert_basic_training_expiry?: string;
  cert_adv_fire_fighting_expiry?: string;
  cert_survival_craft_expiry?: string;
  
  // Status
  availability_status?: AvailabilityStatus;
  employment_status?: EmploymentStatus;
  
  // Computed/Cached fields for display
  last_sign_off_date?: string;
}

export interface ContactRequest {
  id: string;
  requester_id: string;
  seafarer_id: string;
  status: RequestStatus;
  created_at: string;
  admin_reviewed_at?: string;
  requester_name?: string; // Joined for UI
  seafarer_name?: string; // Joined for UI
}

export interface EmploymentRecord {
  id: string;
  seafarer_id: string;
  event_type: EventType;
  vessel_name: string;
  event_date: string;
  port: string;
  source: 'Seafarer' | 'Shipowner' | 'Port Office';
  verification_status: VerificationStatus;
  severity_level?: 'Low' | 'Medium' | 'High';
}

export interface SystemFlag {
  id: string;
  record_id: string;
  reason: string;
  created_at: string;
}

export interface SystemStats {
  totalSeafarers: number;
  seafarersOnboard: number;
  totalAgents: number;
  pendingVerifications: number;
  pendingRequests: number;
}