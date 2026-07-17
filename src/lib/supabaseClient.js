import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://empcdiuhwhdbldltufln.supabase.co";

const supabaseAnonKey =
  "sb_publishable_NVUNdTw-WuSphpc85RY9cQ_siGXzrwv";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);