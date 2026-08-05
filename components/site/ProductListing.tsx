import Link from "next/link";
import { PackageSearch } from "lucide-react";
import ProductCard, {
  type ProductWithCategory,
} from "@/components/site/ProductCard";
import type { Category } from "@/generated/prisma/client";
import { buildQuery, type SortKey } from "@/lib/listing";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

type ProductListingProps = {
  categories: Category[];
  activeCategorySlug?: string;
  heading: string;
  basePath: string;
  products: ProductWithCategory[];
  total: number;
  search: string;
  sort: SortKey;
  page: number;
  pageSize: number;
};

function getPageNumbers(current: number, total: number): (number | "…")[] {
  const candidates = [1, total, current, current - 1, current + 1];
  const unique = candidates.filter(
    (n, index, array) => array.indexOf(n) === index
  );
  const sorted = unique
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const pages: (number | "…")[] = [];
  let previous = 0;
  for (const n of sorted) {
    if (previous && n - previous > 1) pages.push("…");
    pages.push(n);
    previous = n;
  }
  return pages;
}

export default function ProductListing({
  categories,
  activeCategorySlug,
  heading,
  basePath,
  products,
  total,
  search,
  sort,
  page,
  pageSize,
}: ProductListingProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const isAllActive = !activeCategorySlug;

  const withParams = (params: Record<string, string>) => `${basePath}${buildQuery(params)}`;

  const sortHref = (value: SortKey) => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (value !== "newest") params.sort = value;
    return withParams(params);
  };

  const pageHref = (pageNumber: number) => {
    const params: Record<string, string> = { page: String(pageNumber) };
    if (search) params.search = search;
    if (sort !== "newest") params.sort = sort;
    return withParams(params);
  };

  const categoryHref = (slug: string) => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (sort !== "newest") params.sort = sort;
    const query = buildQuery(params);
    return slug === activeCategorySlug ? basePath : `/products/${slug}${query}`;
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">
            Wholesale Catalog
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy">
            {heading}
          </h1>
        </div>
        <p className="text-sm text-brand-gray">
          {total} product{total === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">
            Categories
          </h2>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            <Link
              href={`/products${buildQuery({ ...(search && { search }), ...(sort !== "newest" && { sort }) })}`}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition lg:whitespace-normal ${
                isAllActive
                  ? "bg-brand-navy text-white"
                  : "text-brand-gray hover:bg-gray-100 hover:text-brand-navy"
              }`}
            >
              All Products
            </Link>
            {categories.map((category) => {
              const active = category.slug === activeCategorySlug;
              return (
                <Link
                  key={category.id}
                  href={categoryHref(category.slug)}
                  className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition lg:whitespace-normal ${
                    active
                      ? "bg-brand-navy text-white"
                      : "text-brand-gray hover:bg-gray-100 hover:text-brand-navy"
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <form
              method="GET"
              action={basePath}
              className="flex w-full gap-2 md:max-w-sm"
            >
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search products..."
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-brand-navy placeholder:text-brand-gray focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
              />
              <input type="hidden" name="sort" value={sort} />
              <button
                type="submit"
                className="rounded-md bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy/90"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-white p-1">
              {SORT_OPTIONS.map((option) => (
                <Link
                  key={option.value}
                  href={sortHref(option.value)}
                  className={`rounded px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                    sort === option.value
                      ? "bg-brand-gradient text-white"
                      : "text-brand-gray hover:text-brand-navy"
                  }`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-24 text-center">
              <PackageSearch className="h-12 w-12 text-gray-300" />
              <h2 className="mt-4 text-xl font-semibold text-brand-navy">
                No products yet
              </h2>
              <p className="mt-2 max-w-md text-sm text-brand-gray">
                {activeCategorySlug && !search
                  ? "We are still stocking this category. Check back soon for new arrivals."
                  : "Nothing matched your search. Try a different keyword or browse the full catalog."}
              </p>
              <Link
                href="/products"
                className="mt-6 rounded-md bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  className="mt-12 flex items-center justify-center gap-2"
                  aria-label="Pagination"
                >
                  {page === 1 ? (
                    <span className="rounded-md border border-gray-200 px-3.5 py-2 text-sm text-gray-300">
                      Prev
                    </span>
                  ) : (
                    <Link
                      href={pageHref(page - 1)}
                      className="rounded-md border border-gray-200 px-3.5 py-2 text-sm font-medium text-brand-navy transition hover:border-brand-orange hover:text-brand-orange"
                    >
                      Prev
                    </Link>
                  )}

                  {getPageNumbers(page, totalPages).map((n, index) =>
                    n === "…" ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-1 text-sm text-brand-gray"
                      >
                        …
                      </span>
                    ) : (
                      <Link
                        key={n}
                        href={pageHref(n)}
                        aria-current={n === page ? "page" : undefined}
                        className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-semibold transition ${
                          n === page
                            ? "bg-brand-navy text-white"
                            : "border border-gray-200 text-brand-navy hover:border-brand-orange hover:text-brand-orange"
                        }`}
                      >
                        {n}
                      </Link>
                    )
                  )}

                  {page === totalPages ? (
                    <span className="rounded-md border border-gray-200 px-3.5 py-2 text-sm text-gray-300">
                      Next
                    </span>
                  ) : (
                    <Link
                      href={pageHref(page + 1)}
                      className="rounded-md border border-gray-200 px-3.5 py-2 text-sm font-medium text-brand-navy transition hover:border-brand-orange hover:text-brand-orange"
                    >
                      Next
                    </Link>
                  )}
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
