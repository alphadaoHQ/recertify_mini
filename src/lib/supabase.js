import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

/**
 * Test the Supabase connection by making a lightweight query.
 * Returns { connected: true/false, error?: string }
 */
export async function testSupabaseConnection() {
  if (!supabase) {
    return {
      connected: false,
      error: "Supabase client not initialized. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env",
    };
  }

  try {
    // Try a lightweight read from profiles table (even if empty)
    const { error } = await supabase.from("profiles").select("wallet_address").limit(1);

    if (error) {
      return {
        connected: false,
        error: `Supabase query failed: ${error.message} (code: ${error.code})`,
      };
    }

    return { connected: true };
  } catch (err) {
    return {
      connected: false,
      error: `Supabase connection error: ${err.message}`,
    };
  }
}
