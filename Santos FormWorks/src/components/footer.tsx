import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icon";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" aria-label="Santos FormWorks home">
              <Image
                src="/images/logo.png"
                width={280}
                height={93}
                alt="Santos FormWorks"
              />
            </Link>
            <p className="muted small">
              From a spark of an idea to something you can hold.
              <br />
              Designed. Printed. Local.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/">Home</Link>
            <Link href="/shop">Shop all products</Link>
            <Link href="/custom-orders">Custom orders</Link>
            <Link href="/about">Our story</Link>
          </div>
          <div>
            <h3>Here to help</h3>
            <Link href="/faq">FAQs</Link>
            <Link href="/faq#delivery">Shipping & pickup</Link>
            <Link href="/faq#orders">Orders & returns</Link>
            <Link href="/contact">Contact us</Link>
          </div>
          <div className="footer-local">
            <p className="eyebrow">Made with purpose</p>
            <h3>
              Big ideas.
              <br />
              Local roots.
            </h3>
            <p>
              <Icon name="pin" size={16} /> Jacksonville, Florida
            </p>
            <Link href="/contact" className="text-link">
              Let’s make something <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Santos FormWorks. All rights reserved.
            {" · "}
            <a href="https://jessabel.art/" className="portfolio-link">
              Return to Portfolio
            </a>
          </span>
          <span>
            IDEAS <b>·</b> PRINTED <b>·</b> POSSIBILITIES
          </span>
        </div>
      </div>
    </footer>
  );
}
