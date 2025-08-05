import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side client - use service key if available, otherwise anon key
const supabaseKey = supabaseServiceKey || supabaseAnonKey;
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Function to get user from request headers
export async function getUserFromRequest(req: NextApiRequest) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  try {
    // Verify the JWT token
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      console.log('Auth verification failed:', error?.message);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error verifying user token:', error);
    return null;
  }
}
