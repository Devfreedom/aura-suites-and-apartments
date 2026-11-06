/**
 * Data access helpers for the `public.suites` table.
 */

import { supabase } from "@/lib/supabase";
import type { Suite, SuiteCategory, SuiteInput } from "@/types/suite";

const TABLE = "suites";

interface SuiteRow {
  id: string;
  slug: string;
  name: string;
  tier: string | null;
  category: string | null;
  description: string | null;
  price: number | string | null;
  guests: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  amenities: string[] | null;
  house_rules: string[] | null;
  images: string[] | null;
  is_published: boolean | null;
  created_at: string;
  updated_at: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapRow(row: SuiteRow): Suite {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tier: row.tier ?? "",
    category: (row.category ?? "Studio") as SuiteCategory,
    description: row.description ?? "",
    price: Number(row.price ?? 0),
    guests: Number(row.guests ?? 0),
    bathrooms: Number(row.bathrooms ?? 0),
    squareFeet: Number(row.square_feet ?? 0),
    amenities: row.amenities ?? [],
    houseRules: row.house_rules ?? [],
    images: row.images ?? [],
    isPublished: row.is_published ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(input: Partial<SuiteInput>) {
  const row: Record<string, unknown> = {};

  if (input.name !== undefined) row.name = input.name;
  if (input.tier !== undefined) row.tier = input.tier;
  if (input.category !== undefined) row.category = input.category;
  if (input.description !== undefined) row.description = input.description;
  if (input.price !== undefined) row.price = input.price;
  if (input.guests !== undefined) row.guests = input.guests;
  if (input.bathrooms !== undefined) row.bathrooms = input.bathrooms;
  if (input.squareFeet !== undefined) row.square_feet = input.squareFeet;
  if (input.amenities !== undefined) row.amenities = input.amenities;
  if (input.houseRules !== undefined) row.house_rules = input.houseRules;
  if (input.images !== undefined) row.images = input.images;
  if (input.isPublished !== undefined) row.is_published = input.isPublished;
  if (input.slug !== undefined) row.slug = input.slug;

  return row;
}

export async function getSuites(): Promise<Suite[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load suites: ${error.message}`);
  }

  return (data as SuiteRow[]).map(mapRow);
}

export async function getSuiteById(id: string): Promise<Suite | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load suite: ${error.message}`);
  }

  return data ? mapRow(data as SuiteRow) : null;
}

export async function createSuite(input: SuiteInput): Promise<Suite> {
  const row = {
    ...toRow(input),
    slug: input.slug || slugify(input.name),
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create suite: ${error.message}`);
  }

  return mapRow(data as SuiteRow);
}

export async function updateSuite(
  id: string,
  input: Partial<SuiteInput>
): Promise<Suite> {
  const row = toRow(input);

  if (input.slug === undefined && input.name !== undefined) {
    row.slug = slugify(input.name);
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

  return mapRow(data as SuiteRow);
}

export async function deleteSuite(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete suite: ${error.message}`);
  }
}
