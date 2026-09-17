import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Frequently asked questions" };
export default function FAQ() {
  return (
    <div className="container information-page">
      <p className="eyebrow">A little clarity</p>
      <h1>
        Good <span>questions.</span>
      </h1>
      <p className="intro">Everything you need to get your idea moving.</p>
      <div className="faq-group" id="orders">
        <h2>Ordering & custom prints</h2>
        {[
          [
            "Can I place an order right now?",
            "This website is a frontend preview. You can explore products, try the cart, and prepare a custom request, but purchases and submissions are not yet available.",
          ],
          [
            "How will custom orders work?",
            "Share your idea and files. Santos FormWorks reviews the request and provides a quote. After your approval and payment, production begins, followed by pickup or shipping. Custom requests are separate from standard product checkout.",
          ],
          [
            "Do I need a 3D model?",
            "No. A reference image, sketch, dimensions, or a written description can be a starting point. Design needs will be considered during the quote.",
          ],
          [
            "Which files can I share?",
            "The preview accepts STL, OBJ, STEP, IGES, 3MF, JPG, PNG, WEBP, and PDF files, up to 50 MB each and 10 files per request. Files stay on your device and are not uploaded.",
          ],
          [
            "What about returns or order tracking?",
            "Return policies and order tracking will be published before the store accepts production orders. No live policy or tracking system is connected to this preview.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
      <div className="faq-group" id="delivery">
        <h2>Shipping & local pickup</h2>
        <details>
          <summary>Where is local pickup available?</summary>
          <p>
            Local pickup is planned in Jacksonville, Florida. The exact pickup
            location and time will be confirmed with your order once ordering is
            available.
          </p>
        </details>
        <details>
          <summary>Do you ship?</summary>
          <p>
            Nationwide shipping is planned. Rates, carriers, and delivery
            estimates will be available when checkout launches.
          </p>
        </details>
        <details>
          <summary>How long does a custom print take?</summary>
          <p>
            Timing depends on size, complexity, material, and finishing. Your
            quote will include a production estimate. Share any deadline in your
            custom request.
          </p>
        </details>
      </div>
      <p className="mt-8">
        Still curious?{" "}
        <Link className="text-link" href="/contact">
          Get in touch →
        </Link>
      </p>
    </div>
  );
}
