import type { Metadata } from "next";
import { ButtonLink, FeatureCard } from "@/components/ui";
export const metadata: Metadata = { title: "Contact" };
export default function Contact() {
  return (
    <div className="container information-page">
      <p className="eyebrow">Let’s make something</p>
      <h1>
        Start a <span>conversation.</span>
      </h1>
      <p className="intro">
        A small question. A big idea. There’s a place for both.
      </p>
      <div className="information-features">
        <FeatureCard icon="pin" title="Find us in Jacksonville">
          Florida, USA. Pickup details will be arranged with your order.
        </FeatureCard>
        <FeatureCard icon="mail" title="Contact details coming soon">
          Our support email and contact form will be published before the store
          opens.
        </FeatureCard>
      </div>
      <p>
        Have a custom project in mind? Explore the request form and see what
        information will help us shape your quote.
      </p>
      <ButtonLink href="/custom-orders">Prepare a custom request</ButtonLink>
    </div>
  );
}
