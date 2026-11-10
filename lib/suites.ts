/**
 * Data access helpers for the `public.suites` table.
 */

import { createClient } from "@/lib/supabase/client";
import {
  mapSuiteRow,
  slugifySuiteName,
  toSuiteRow,
  type SuiteRow,
} from "@/lib/suites-data";
import type { Suite, SuiteInput } from "@/types/suite";

const TABLE = "suites";

export async function getSuites(): Promise<Suite[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load suites: ${error.message}`);
  }

  return (data as SuiteRow[]).map(mapSuiteRow);
}

export async function getSuiteById(id: string): Promise<Suite | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load suite: ${error.message}`);
  }

  return data ? mapSuiteRow(data as SuiteRow) : null;
}

export async function createSuite(input: SuiteInput): Promise<Suite> {
  const supabase = createClient();
  const row = {
    ...toSuiteRow(input),
    slug: input.slug || slugifySuiteName(input.name),
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create suite: ${error.message}`);
  }

  return mapSuiteRow(data as SuiteRow);
}

export async function updateSuite(
  id: string,
  input: Partial<SuiteInput>
): Promise<Suite> {
  const supabase = createClient();
  const row = toSuiteRow(input);

  if (input.slug === undefined && input.name !== undefined) {
    row.slug = slugifySuiteName(input.name);
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(row)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update suite: ${error.message}`);
  }

  return mapSuiteRow(data as SuiteRow);
}

export async function deleteSuite(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete suite: ${error.message}`);
  }
}

/**
 * Fetch a single suite by its slug.
 */
export async function getSuiteBySlug(slug: string): Promise<Suite | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load suite: ${error.message}`);
  }

  return data ? mapSuiteRow(data as SuiteRow) : null;
}
