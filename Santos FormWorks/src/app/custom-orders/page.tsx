import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CustomOrderForm } from "@/components/custom-order-form";
import { ButtonLink, FeatureCard } from "@/components/ui";
import { Icon } from "@/components/icon";
export const metadata: Metadata = { title: "Custom 3D printing requests" };
export default function CustomOrders() {
  return (
    <>
      <PageHero kind="custom" />
      <div className="container custom-layout">
        <CustomOrderForm />
        <aside className="custom-sidebar">
          <section className="info-panel">
            <h2>
              Why <span>Santos FormWorks?</span>
            </h2>
            <FeatureCard icon="shield" title="Quality in every layer">
              Precision and detail that bring your vision into focus.
            </FeatureCard>
            <FeatureCard icon="layers" title="The right material">
              PLA, PETG, ABS, TPU, and more. We’ll help you choose.
            </FeatureCard>
            <FeatureCard icon="bolt" title="A clear path forward">
              A considered quote and timeline before printing begins.
            </FeatureCard>
            <FeatureCard icon="people" title="Local support">
              Real people. Based in Jacksonville, Florida.
            </FeatureCard>
          </section>
          <section className="info-panel">
            <h2>
              <Icon name="file" />A few file tips
            </h2>
            <ul className="tips">
              {[
                "STL or 3MF is a great place to start.",
                "Include multiple angles in reference photos.",
                "Share dimensions and units, if possible.",
                "No model? Send your idea — we can help.",
              ].map((x) => (
                <li key={x}>
                  <Icon name="check" size={18} />
                  {x}
                </li>
              ))}
            </ul>
          </section>
          <section className="info-panel help-panel">
            <Icon name="mail" size={30} />
            <h2>A little help?</h2>
            <p>Not sure where to start? Let’s talk through your idea.</p>
            <ButtonLink href="/contact" variant="outline">
              Get in touch <Icon name="arrow" size={16} />
            </ButtonLink>
          </section>
          <blockquote className="print-quote">
            <span>“</span>Big ideas
            <br />
            start with
            <br />a single print.
            <div />
          </blockquote>
        </aside>
      </div>
    </>
  );
}
