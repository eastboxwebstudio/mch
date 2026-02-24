-- Create Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  full_name TEXT,
  email TEXT UNIQUE,
  rank TEXT,
  coc TEXT,
  ic_passport TEXT,
  sid TEXT,
  phone TEXT,
  nationality TEXT,
  years_of_experience INTEGER,
  ship_type_experience TEXT[],
  cert_basic_training_expiry DATE,
  cert_adv_fire_fighting_expiry DATE,
  cert_survival_craft_expiry DATE,
  availability_status TEXT,
  employment_status TEXT,
  last_sign_off_date DATE
);

-- Create Employment Records Table
CREATE TABLE employment_records (
  id SERIAL PRIMARY KEY,
  seafarer_id UUID REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  vessel_name TEXT,
  event_date DATE,
  port TEXT,
  source TEXT,
  verification_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Contact Requests Table
CREATE TABLE contact_requests (
  id SERIAL PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id),
  seafarer_id UUID REFERENCES profiles(id),
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  requester_name TEXT,
  seafarer_name TEXT,
  admin_reviewed_at TIMESTAMPTZ
);

-- Create System Flags Table
CREATE TABLE system_flags (
  id SERIAL PRIMARY KEY,
  record_id INTEGER REFERENCES employment_records(id),
  flag_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
