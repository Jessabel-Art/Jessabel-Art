import Image from "next/image";
import Link from "next/link";
import { ButtonLink, SectionHeading, FeatureCard } from "@/components/ui";
import { Icon } from "@/components/icon";
import { ProductGrid } from "@/components/product-card";
import { products } from "@/lib/products";
const categoryCards = [
  ["Figurines & Collectibles", "dragon", "Toys & Collectibles"],
  ["Home & Office", "phone", "Home & Office"],
  ["Parts & Replacements", "gear", "Parts & Replacements"],
  ["Planters & Décor", "planters", "Home & Office"],
  ["Gaming Accessories", "controller", "Gaming Accessories"],
];
export default function Home() {
  return (
    <>
      <section className="home-hero">
        <Image
          className="hero-photo"
          src="/images/hero.webp"
          alt="A 3D printer bringing a vivid red lattice vase to life"
          fill
          priority
          sizes="100vw"
        />
        <div className="container hero-content">
          <p className="eyebrow">
            Ideas <span>·</span> Precision <span>·</span> Possibility
          </p>
          <h1>
            Bring your
            <br />
            ideas <span>to life.</span>
          </h1>
          <p className="hero-description">
            Made for creators, problem-solvers, and the endlessly curious. From
            functional parts to one-of-a-kind designs, we turn your ideas into
            reality.
          </p>
          <div className="hero-buttons">
            <ButtonLink href="/shop">
              Shop our products <Icon name="arrow" size={18} />
            </ButtonLink>
            <ButtonLink href="/custom-orders" variant="outline">
              Request a custom print
            </ButtonLink>
          </div>
          <div className="hero-features">
            <FeatureCard icon="shield" title="Quality in every layer">
              Thoughtfully made
            </FeatureCard>
            <FeatureCard icon="truck" title="Reliable turnaround">
              From print to doorstep
            </FeatureCard>
            <FeatureCard icon="pin" title="Local pickup">
              Jacksonville, FL
            </FeatureCard>
          </div>
        </div>
        <div className="hero-caption">
          <span>01 / THE POSSIBILITIES</span>
          <p>
            Imagined by you.
            <br />
            Built layer by layer.
          </p>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="Find your next favorite"
          href="/shop"
          linkText="View all categories"
        >
          Shop by <span>category</span>
        </SectionHeading>
        <div className="category-grid">
          {categoryCards.map(([title, img, category]) => (
            <Link
              className="category-card"
              href={`/shop?category=${encodeURIComponent(category)}`}
              key={title}
            >
              <div>
                <Image
                  src={`/images/${img}.webp`}
                  alt=""
                  fill
                  sizes="(max-width:600px) 50vw, 18vw"
                />
              </div>
              <h3>
                {title}
                <Icon name="arrow" size={16} />
              </h3>
            </Link>
          ))}
          <Link href="/custom-orders" className="category-card custom-category">
            <div>
              <Icon name="layers" size={64} />
              <span>Something uniquely yours.</span>
            </div>
            <h3>
              Custom Orders <Icon name="arrow" size={16} />
            </h3>
          </Link>
        </div>
      </section>
      <section className="custom-promo">
        <div className="container promo-grid">
          <div>
            <p className="eyebrow">Custom 3D printing</p>
            <h2>
              Have a unique idea?
              <br />
              <span>Let’s make it real.</span>
            </h2>
            <p>
              That part you can’t find. The gift only you could dream up. Share
              your vision and we’ll help you take the next step.
            </p>
            <ButtonLink href="/custom-orders">
              Start a custom order <Icon name="arrow" size={18} />
            </ButtonLink>
            <div className="mini-workflow">
              <span>
                <Icon name="upload" />
                Share files
              </span>
              <span>
                <Icon name="file" />
                Get a quote
              </span>
              <span>
                <Icon name="print" />
                We print & deliver
              </span>
            </div>
          </div>
          <div className="promo-art">
            <Image
              src="/images/gear.webp"
              alt="Precision 3D printed mechanical gear"
              width={530}
              height={420}
            />
            <div className="technical-label">
              FROM CONCEPT TO CREATION <span>↗</span>
            </div>
          </div>
          <ul className="promo-checks">
            {[
              "Prototypes",
              "Custom parts",
              "Personalized gifts",
              "Replacement parts",
              "And your next big idea",
            ].map((x) => (
              <li key={x}>
                <Icon name="check" size={18} />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="Fresh from the print bed"
          href="/shop"
          linkText="Shop the collection"
        >
          Featured <span>prints</span>
        </SectionHeading>
        <div className="featured-grid">
          <ProductGrid
            products={[products[3], products[2], products[1], products[4]]}
          />
        </div>
        <p className="sample-caption">
          A look at what’s possible. Products, pricing, and reviews shown are
          illustrative.
        </p>
      </section>
      <section className="delivery-strip">
        <div className="container delivery-grid">
          <FeatureCard icon="pin" title="Made local. Picked up local.">
            Based in Jacksonville, Florida. Choose local pickup for your next
            creation.
          </FeatureCard>
          <FeatureCard icon="box" title="Great ideas travel.">
            Prefer delivery? Nationwide shipping is planned for our store
            launch.
          </FeatureCard>
          <Link href="/faq#delivery" className="text-link">
            Shipping & pickup <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>
      <section className="community container">
        <div>
          <p className="eyebrow">More than prints</p>
          <h2>
            A community
            <br />
            <span>of creators.</span>
          </h2>
          <p>
            We believe in creativity, problem-solving, and making amazing ideas
            accessible to everyone.
          </p>
          <Link href="/about" className="text-link">
            Meet Santos FormWorks <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="community-values">
          <FeatureCard icon="bulb" title="Inspiring creativity">
            Start with a spark.
          </FeatureCard>
          <FeatureCard icon="people" title="Supporting makers">
            Build something together.
          </FeatureCard>
          <FeatureCard icon="layers" title="Building possibilities">
            One layer at a time.
          </FeatureCard>
        </div>
        <div className="community-note">
          Good ideas
          <br />
          take shape.
          <Icon name="arrow" size={36} />
        </div>
      </section>
    </>
  );
}
