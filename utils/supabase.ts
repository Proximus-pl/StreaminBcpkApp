import 'react-native-url-polyfill/auto';
// You can remove the AsyncStorage import completely
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      // Setting this to false keeps the session in-memory only.
      // When the app restarts, the session is wiped.
      persistSession: false,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);