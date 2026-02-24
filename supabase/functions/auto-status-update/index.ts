// Follow this setup for Supabase Edge Functions
// This logic mirrors the PL/PGSQL trigger but designed for an HTTP-invoked context
// or a database webhook that calls this function.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Declare Deno global to fix TypeScript errors in environments without Deno types
declare const Deno: any;

interface EmploymentRecordPayload {
  record: {
    id: string;
    seafarer_id: string;
    event_type: 'Sign On' | 'Sign Off';
    verification_status: 'Pending' | 'Verified' | 'Flagged';
  }
}

Deno.serve(async (req: any) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: EmploymentRecordPayload = await req.json();
    const { record } = payload;

    if (record.verification_status === 'Verified') {
      let updates = {};

      if (record.event_type === 'Sign On') {
        updates = {
          employment_status: 'Onboard',
          availability_status: 'Not Available'
        };
      } else if (record.event_type === 'Sign Off') {
        updates = {
          employment_status: 'Signed_off',
          availability_status: 'Available'
        };
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', record.seafarer_id);

      if (error) throw error;
      
      return new Response(JSON.stringify({ message: "Profile updated successfully" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (record.verification_status === 'Flagged') {
       const { error } = await supabase
        .from('system_flags')
        .insert({
            record_id: record.id,
            reason: 'Flagged via Edge Function automation'
        });
        
        if (error) throw error;

        return new Response(JSON.stringify({ message: "Flag recorded" }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    }

    return new Response(JSON.stringify({ message: "No action required" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});