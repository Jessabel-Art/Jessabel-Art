"use client";
import Image from "next/image";
import { useState } from "react";
import { type Product, money } from "@/lib/products";
import { useStore } from "./store-provider";
import { Icon } from "./icon";
export function ProductCard({ product }: { product: Product }) {
  const { add, favorites, toggleFavorite } = useStore();
  const [added, setAdded] = useState(false);
  const saved = favorites.includes(product.id);
  return (
    <article className="product-card">
      <div className="product-image">
        <Image
          src={`/images/${product.image}.webp`}
          alt={product.name}
          fill
          sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw"
        />
        {product.badge && <span className="badge">{product.badge}</span>}
        <button
          className={`favorite ${saved ? "is-saved" : ""}`}
          aria-label={`${saved ? "Remove" : "Save"} ${product.name} ${saved ? "from" : "to"} favorites`}
          aria-pressed={saved}
          onClick={() => toggleFavorite(product.id)}
        >
          <Icon name="heart" size={19} />
        </button>
      </div>
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>
        <div className="price-row">
          <strong>{money(product.price)}</strong>
          <span
            className="rating"
            aria-label={`Sample rating: 5 out of 5, ${product.reviews} example reviews`}
            title="Sample reviews"
          >
            <span aria-hidden="true">★★★★★</span>
            <small>({product.reviews})</small>
          </span>
        </div>
        <button
          className={`button button-add ${added ? "added" : ""}`}
          onClick={() => {
            add(product);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1800);
          }}
        >
          <Icon name={added ? "check" : "cart"} size={16} />
          {added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}
