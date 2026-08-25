import { supabase } from "@/lib/supabase";

export interface ActivityLogEntry {
  id?: string;
  created_at?: string;
  admin_email: string;
  action_type: "Création compte" | "Validation compte" | "Refus compte" | "Mise en attente" | "Envoi email" | "Modification" | "Suppression compte";
  client_name: string;
  client_email: string;
  notes?: string;
}

const LOCAL_STORAGE_KEY = "ge_activity_logs";

/**
 * Enregistre une action administrative dans la table Supabase `activity_logs` et dans LocalStorage
 */
export async function logActivity(entry: Omit<ActivityLogEntry, "id" | "created_at">): Promise<ActivityLogEntry> {
  const timestamp = new Date().toISOString();
  const newLog: ActivityLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    created_at: timestamp,
    ...entry,
  };

  // 1. Sauvegarde Supabase
  try {
    const { error } = await supabase.from("activity_logs").insert([
      {
        admin_email: entry.admin_email,
        action_type: entry.action_type,
        client_name: entry.client_name,
        client_email: entry.client_email,
        notes: entry.notes || null,
        created_at: timestamp,
      },
    ]);
    if (error && !error.message.includes("schema cache") && !error.message.includes("Could not find the table")) {
      console.warn("Supabase activity_logs notice:", error.message);
    }
  } catch {
    // Silent fallback to local storage
  }

  // 2. Sauvegarde LocalStorage
  try {
    if (typeof window !== "undefined") {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
      existing.unshift(newLog);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing.slice(0, 200)));
    }
  } catch (err) {
    console.error("Activity log LocalStorage error:", err);
  }

  return newLog;
}

/**
 * Récupère le journal des activités administratives
 */
export async function getActivityLogs(): Promise<ActivityLogEntry[]> {
  try {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!error && data && data.length > 0) {
      return data as ActivityLogEntry[];
    }
  } catch (err) {
    console.warn("Error fetching activity logs from Supabase:", err);
  }

  // Fallback LocalStorage
  try {
    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
      return stored as ActivityLogEntry[];
    }
  } catch {
    // Ignore
  }

  return [];
}
