/**
 * Shared suite row mapping.
 *
 * Kept separate from `lib/suites.ts` (browser client) and
 * `lib/admin-suites.ts` (service-role client) so both can share the exact
 * same mapping without pulling a client module into the server bundle.
 */

import type { Suite, SuiteCategory, SuiteInput } from "@/types/suite";

export interface SuiteRow {
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

export function slugifySuiteName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function mapSuiteRow(row: SuiteRow): Suite {
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

/** Build a database row from a partial suite input (undefined fields skipped). */
export function toSuiteRow(input: Partial<SuiteInput>): Record<string, unknown> {
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
