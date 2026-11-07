import AsyncStorage from '@react-native-async-storage/async-storage';

import { createClient, GoTrueAdminApi } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpzvnsbtflwqxqnyigin.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwenZuc2J0Zmx3cXhxbnlpZ2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1MDMzMTAsImV4cCI6MjA0ODA3OTMxMH0.gJd92V482fqSPDWaqFlGVQvhw4LgGjESpLx0mOUqV_Q';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

// export const supabase = createClient(supabaseUrl, supabaseKey, {
//     auth: {
//         storageKey: AsyncStorage,
//         autoRefreshToken: true,
//         persistSession: true,
//         detectSessionInUrl: false,
//     }
// });