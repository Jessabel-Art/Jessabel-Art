"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./icon";
import { ButtonLink } from "./ui";
import { Modal } from "./modal";
import { useStore } from "./store-provider";
import { money } from "@/lib/products";
const links = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["Custom Orders", "/custom-orders"],
  ["About", "/about"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
];
export function Header() {
  const pathname = usePathname();
  const [panel, setPanel] = useState<
    "menu" | "cart" | "account" | "search" | null
  >(null);
  const { items, update } = useStore();
  const count = items.reduce((n, i) => n + i.quantity, 0);
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" aria-label="Santos FormWorks home" className="brand">
            <Image
              src="/images/logo.png"
              alt="Santos FormWorks — Ideas. Printed. Possibilities."
              width={300}
              height={100}
              priority
            />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map(([name, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
              >
                {name}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="Search"
              onClick={() => setPanel("search")}
            >
              <Icon name="search" />
            </button>
            <button
              className="icon-button account-button"
              aria-label="Account"
              onClick={() => setPanel("account")}
            >
              <Icon name="user" />
            </button>
            <button
              className="icon-button cart-button"
              aria-label={`Shopping cart, ${count} items`}
              onClick={() => setPanel("cart")}
            >
              <Icon name="cart" />
              <span className="cart-count">{count}</span>
            </button>
            <ButtonLink href="/custom-orders" className="header-quote">
              Get a quote <Icon name="arrow" size={16} />
            </ButtonLink>
            <button
              className="icon-button menu-button"
              aria-label="Open navigation"
              onClick={() => setPanel("menu")}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>
      {panel === "menu" && (
        <Modal title="Explore FormWorks" onClose={() => setPanel(null)} drawer>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {links.map(([name, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                onClick={() => setPanel(null)}
              >
                {name}
                <Icon name="arrow" />
              </Link>
            ))}
          </nav>
        </Modal>
      )}
      {panel === "search" && (
        <Modal title="Find your next print" onClose={() => setPanel(null)}>
          <form
            action="/shop"
            className="site-search"
            onSubmit={() => setPanel(null)}
          >
            <label htmlFor="site-search">Search our collection</label>
            <input
              id="site-search"
              name="q"
              type="search"
              placeholder="Try dragons, planters, or phone stands"
              autoFocus
              required
            />
            <button className="button button-primary" type="submit">
              Search products <Icon name="search" size={18} />
            </button>
          </form>
        </Modal>
      )}
      {panel === "account" && (
        <Modal title="Your maker space" onClose={() => setPanel(null)}>
          <Icon name="user" size={42} />
          <p className="muted mt-5">
            Customer accounts are coming in a future release. You’ll be able to
            save your details and follow your orders here.
          </p>
          <p className="small muted mt-4">
            No sign-in is needed to explore the preview.
          </p>
        </Modal>
      )}
      {panel === "cart" && (
        <Modal
          title={`Your cart (${count})`}
          onClose={() => setPanel(null)}
          drawer
        >
          {items.length ? (
            <>
              <div className="cart-items">
                {items.map(({ product, quantity }) => (
                  <div className="cart-item" key={product.id}>
                    <Image
                      src={`/images/${product.image}.webp`}
                      alt={product.name}
                      width={76}
                      height={76}
                    />
                    <div>
                      <h3>{product.name}</h3>
                      <p>{money(product.price)}</p>
                      <div className="quantity-control">
                        <button
                          aria-label={`Decrease ${product.name} quantity`}
                          onClick={() => update(product.id, -1)}
                        >
                          <Icon name="minus" size={14} />
                        </button>
                        <span>{quantity}</span>
                        <button
                          aria-label={`Increase ${product.name} quantity`}
                          onClick={() => update(product.id, 1)}
                        >
                          <Icon name="plus" size={14} />
                        </button>
                      </div>
                    </div>
                    <strong>{money(product.price * quantity)}</strong>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <span>Subtotal</span>
                <strong>
                  {money(
                    items.reduce((n, i) => n + i.product.price * i.quantity, 0),
                  )}
                </strong>
              </div>
              <p className="preview-note">
                This is a preview cart. Checkout, taxes, shipping, and payments
                are not connected. Cart items are kept during this visit and
                reset on refresh.
              </p>
              <button
                className="button button-primary w-full"
                onClick={() => setPanel(null)}
              >
                Continue exploring <Icon name="arrow" size={18} />
              </button>
            </>
          ) : (
            <div className="empty-state">
              <Icon name="cart" size={48} />
              <h3>Room for something good.</h3>
              <p>Explore the collection and add your first print.</p>
              <button
                className="button button-primary"
                onClick={() => setPanel(null)}
              >
                Keep exploring
              </button>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
