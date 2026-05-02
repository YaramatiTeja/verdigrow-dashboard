import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type TableName = "farms" | "logs" | "harvests";

/** Generic data-access helpers. All queries respect RLS. */
export async function getAll<T extends TableName>(
  table: T,
  opts?: { orderBy?: string; ascending?: boolean; limit?: number; offset?: number }
): Promise<Tables<T>[]> {
  const { orderBy = "created_at", ascending = false, limit, offset } = opts ?? {};
  let q = supabase.from(table).select("*").order(orderBy, { ascending });
  if (typeof limit === "number" && typeof offset === "number") {
    q = q.range(offset, offset + limit - 1);
  } else if (typeof limit === "number") {
    q = q.limit(limit);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Tables<T>[];
}

export async function getById<T extends TableName>(table: T, id: string): Promise<Tables<T> | null> {
  const { data, error } = await (supabase.from(table) as any).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Tables<T> | null;
}

export async function createRecord<T extends TableName>(
  table: T,
  values: TablesInsert<T>
): Promise<Tables<T>> {
  const { data, error } = await supabase.from(table).insert(values as never).select().single();
  if (error) throw error;
  return data as Tables<T>;
}

export async function updateRecord<T extends TableName>(
  table: T,
  id: string,
  values: TablesUpdate<T>
): Promise<Tables<T>> {
  const { data, error } = await (supabase.from(table) as any)
    .update(values)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Tables<T>;
}

export async function deleteRecord(table: TableName, id: string): Promise<void> {
  const { error } = await (supabase.from(table) as any).delete().eq("id", id);
  if (error) throw error;
}

/* ---------------- Domain-specific helpers ---------------- */

export async function listFarms(search?: string) {
  let q = supabase.from("farms").select("*").order("created_at", { ascending: false });
  if (search?.trim()) {
    const s = `%${search.trim()}%`;
    q = q.or(`name.ilike.${s},location.ilike.${s},crop_type.ilike.${s}`);
  }
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function listLogs(filters?: { farm_id?: string; from?: string; to?: string; limit?: number; offset?: number }) {
  let q = supabase.from("logs").select("*, farms(name)").order("date", { ascending: false });
  if (filters?.farm_id) q = q.eq("farm_id", filters.farm_id);
  if (filters?.from) q = q.gte("date", filters.from);
  if (filters?.to) q = q.lte("date", filters.to);
  if (typeof filters?.limit === "number" && typeof filters?.offset === "number") {
    q = q.range(filters.offset, filters.offset + filters.limit - 1);
  }
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function listHarvests(filters?: { farm_id?: string; from?: string; to?: string; limit?: number; offset?: number }) {
  let q = supabase.from("harvests").select("*, farms(name)").order("date", { ascending: false });
  if (filters?.farm_id) q = q.eq("farm_id", filters.farm_id);
  if (filters?.from) q = q.gte("date", filters.from);
  if (filters?.to) q = q.lte("date", filters.to);
  if (typeof filters?.limit === "number" && typeof filters?.offset === "number") {
    q = q.range(filters.offset, filters.offset + filters.limit - 1);
  }
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}
