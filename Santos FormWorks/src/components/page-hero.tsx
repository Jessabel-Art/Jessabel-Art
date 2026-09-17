import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icon";
export function PageHero({ kind }: { kind: "shop" | "custom" }) {
  const custom = kind === "custom";
  return (
    <section className="page-hero">
      <Image
        src="/images/hero.webp"
        alt="3D printer creating a red sculptural vase"
        fill
        priority
        sizes="100vw"
      />
      <div className="container page-hero-inner">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <Icon name="chevron" size={12} />
          <span>{custom ? "Custom Orders" : "Shop"}</span>
        </div>
        <p className="eyebrow">
          {custom
            ? "Your vision. Our craft."
            : "Made differently. Made for you."}
        </p>
        <h1>
          {custom ? "Custom" : "Our"}{" "}
          <span>{custom ? "orders" : "products"}</span>
        </h1>
        <p className="hero-subtitle">
          {custom
            ? "Bring your ideas to life."
            : "Functional. Creative. Uniquely printed."}
        </p>
        <p className="page-hero-copy">
          {custom
            ? "Have a unique idea? Share your files and tell us what you have in mind. We’ll help you make it real."
            : "Everyday essentials. Unexpected designs. Explore a collection made one layer at a time."}
        </p>
        {custom && (
          <div className="workflow">
            {[
              ["bulb", "Idea", "You imagine it."],
              ["box", "Design", "We refine it."],
              ["print", "Print", "We make it."],
              ["truck", "Deliver", "You enjoy it."],
            ].map(([icon, title, sub], i) => (
              <div key={title}>
                <Icon name={icon as "bulb"} size={28} />
                <span>
                  <strong>{title}</strong>
                  <small>{sub}</small>
                </span>
                {i < 3 && <span className="workflow-arrow">→</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
