export type SortKey = "newest" | "price-asc" | "price-desc";

export const LISTING_PAGE_SIZE = 12;

export function parseSort(value: string | string[] | undefined): SortKey {
  return value === "price-asc" || value === "price-desc" ? value : "newest";
}

export function parsePage(value: string | string[] | undefined): number {
  const parsed =
    typeof value === "string" ? Number.parseInt(value, 10) : Number.NaN;
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function buildQuery(params: Record<string, string>): string {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : "";
}
