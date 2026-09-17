"use client";
import { useId, useState } from "react";
import { products, categories, colors, materials } from "@/lib/products";
import { ProductGrid } from "./product-card";
import { SearchBar, Button } from "./ui";
import { Icon } from "./icon";
import { Modal } from "./modal";
import { useStore } from "./store-provider";
type Filters = {
  category: string;
  maxPrice: number;
  colors: string[];
  materials: string[];
  favoritesOnly: boolean;
};
const defaults: Filters = {
  category: "All Products",
  maxPrice: 100,
  colors: [],
  materials: [],
  favoritesOnly: false,
};
function FilterPanel({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (value: Filters) => void;
}) {
  const priceId = useId();
  const toggle = (key: "colors" | "materials", item: string) =>
    onChange({
      ...value,
      [key]: value[key].includes(item)
        ? value[key].filter((x) => x !== item)
        : [...value[key], item],
    });
  return (
    <div className="filter-panel">
      <fieldset>
        <legend>Categories</legend>
        <div className="category-options">
          {categories.map((category) => (
            <button
              key={category}
              className={value.category === category ? "selected" : ""}
              aria-pressed={value.category === category}
              onClick={() => onChange({ ...value, category })}
            >
              {category}
              {value.category === category && <Icon name="chevron" size={15} />}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Price range</legend>
        <label htmlFor={priceId}>
          Up to ${value.maxPrice}
          {value.maxPrice === 100 ? "+" : ""}
        </label>
        <input
          id={priceId}
          type="range"
          min="0"
          max="100"
          step="1"
          value={value.maxPrice}
          onChange={(e) =>
            onChange({ ...value, maxPrice: Number(e.target.value) })
          }
        />
        <div className="range-labels">
          <span>$0</span>
          <span>$100+</span>
        </div>
      </fieldset>
      <fieldset>
        <legend>Color</legend>
        <div className="color-options">
          {colors.map((color) => (
            <button
              key={color.name}
              title={color.name}
              aria-label={color.name}
              aria-pressed={value.colors.includes(color.name)}
              style={{ backgroundColor: color.value }}
              onClick={() => toggle("colors", color.name)}
            >
              {value.colors.includes(color.name) && (
                <Icon
                  name="check"
                  size={18}
                  style={{ color: color.name === "White" ? "black" : "white" }}
                />
              )}
            </button>
          ))}
        </div>
        {value.colors.length > 0 && (
          <p className="small muted mt-3">{value.colors.join(", ")}</p>
        )}
      </fieldset>
      <fieldset>
        <legend>Material</legend>
        {materials.map((material) => (
          <label className="checkbox-label" key={material}>
            <input
              type="checkbox"
              checked={value.materials.includes(material)}
              onChange={() => toggle("materials", material)}
            />
            {material}
            {material === "TPU" ? " (Flexible)" : ""}
          </label>
        ))}
      </fieldset>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={value.favoritesOnly}
          onChange={(e) =>
            onChange({ ...value, favoritesOnly: e.target.checked })
          }
        />
        Saved favorites
      </label>
      <Button
        variant="outline"
        className="w-full mt-6"
        onClick={() => onChange(defaults)}
      >
        Clear filters
      </Button>
    </div>
  );
}
export function Catalog({
  initialQuery = "",
  initialCategory = "All Products",
}: {
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>({
    ...defaults,
    category: categories.includes(initialCategory)
      ? initialCategory
      : "All Products",
  });
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const { favorites } = useStore();
  const changeFilters = (v: Filters) => {
    setFilters(v);
    setPage(1);
  };
  const filtered = products
    .filter(
      (p) =>
        (filters.category === "All Products" ||
          p.category === filters.category) &&
        `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()) &&
        p.price <= filters.maxPrice &&
        (!filters.colors.length ||
          filters.colors.some((c) => p.colors.includes(c))) &&
        (!filters.materials.length || filters.materials.includes(p.material)) &&
        (!filters.favoritesOnly || favorites.includes(p.id)),
    )
    .sort((a, b) =>
      sort === "price-low"
        ? a.price - b.price
        : sort === "price-high"
          ? b.price - a.price
          : sort === "name"
            ? a.name.localeCompare(b.name)
            : 0,
    );
  const pages = Math.ceil(filtered.length / 9);
  const currentPage = Math.min(page, Math.max(1, pages));
  const visible = filtered.slice((currentPage - 1) * 9, currentPage * 9);
  const activeCount =
    (filters.category !== "All Products" ? 1 : 0) +
    (filters.maxPrice < 100 ? 1 : 0) +
    filters.colors.length +
    filters.materials.length +
    (filters.favoritesOnly ? 1 : 0);
  return (
    <div className="container catalog-layout">
      <aside className="desktop-filters" aria-label="Product filters">
        <FilterPanel value={filters} onChange={changeFilters} />
      </aside>
      <div className="catalog-results">
        <div className="catalog-toolbar">
          <SearchBar
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
          />
          <label className="sort-label">
            Sort by
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </label>
          <Button
            className="mobile-filter-button"
            variant="outline"
            onClick={() => setOpen(true)}
          >
            <Icon name="filter" size={18} />
            Filters{activeCount > 0 && ` (${activeCount})`}
          </Button>
        </div>
        <div className="results-summary" aria-live="polite">
          <p>
            {filtered.length
              ? `Showing ${(currentPage - 1) * 9 + 1}–${Math.min(currentPage * 9, filtered.length)} of ${filtered.length} products`
              : "No products found"}
          </p>
          <span>Designed to be a little different.</span>
        </div>
        {visible.length ? (
          <ProductGrid products={visible} />
        ) : (
          <div className="empty-state">
            <Icon name="search" size={40} />
            <h2>No prints found. Yet.</h2>
            <p>Try another search or give your filters a little more room.</p>
            <Button
              variant="outline"
              onClick={() => {
                changeFilters(defaults);
                setQuery("");
              }}
            >
              Reset search & filters
            </Button>
          </div>
        )}
        {pages > 1 && (
          <nav className="pagination" aria-label="Product pagination">
            <button
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              ‹
            </button>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                aria-label={`Page ${i + 1}`}
                aria-current={currentPage === i + 1 ? "page" : undefined}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              aria-label="Next page"
              disabled={currentPage === pages}
              onClick={() => setPage(currentPage + 1)}
            >
              ›
            </button>
          </nav>
        )}
        <p className="sample-caption">
          Preview collection · Sample products, prices, and reviews.
        </p>
      </div>
      {open && (
        <Modal title="Filter your finds" onClose={() => setOpen(false)} drawer>
          <FilterPanel value={filters} onChange={changeFilters} />
          <Button className="w-full mt-6" onClick={() => setOpen(false)}>
            Show {filtered.length} products <Icon name="arrow" size={18} />
          </Button>
        </Modal>
      )}
    </div>
  );
}
