/**
 * Suite model
 *
 * Mirrors the `public.suites` table in Supabase. Each suite stores its gallery
 * as an array of public CDN image URLs (`images`).
 */

export type SuiteCategory =
  | "Studio"
  | "1-Bedroom"
  | "2-Bedroom"
  | "3-Bedroom"
  | "Penthouse";

export interface Suite {
  id: string;
  slug: string;
  name: string;
  tier: string;
  category: SuiteCategory;
  description: string;
  price: number;
  guests: number;
  bathrooms: number;
  squareFeet: number;
  amenities: string[];
  houseRules: string[];
  /** Public URLs for every gallery image, e.g. Supabase Storage CDN links. */
  images: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SuiteInput = Omit<
  Suite,
  "id" | "slug" | "createdAt" | "updatedAt"
> & {
  /** Optional; generated from `name` when omitted. */
  slug?: string;
};

export function createEmptySuiteInput(): SuiteInput {
  return {
    name: "",
    tier: "",
    category: "Studio",
    description: "",
    price: 0,
    guests: 2,
    bathrooms: 1,
    squareFeet: 0,
    amenities: [],
    houseRules: [],
    images: [],
    isPublished: true,
  };
}
