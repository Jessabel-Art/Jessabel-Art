import { ButtonLink, FeatureCard } from "@/components/ui";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "About us" };
export default function About() {
  return (
    <div className="container information-page">
      <p className="eyebrow">Jacksonville, Florida</p>
      <h1>
        More than prints.
        <br />
        <span>Possibilities.</span>
      </h1>
      <p className="intro">
        Santos FormWorks is a 3D printing business built around a simple idea:
        creativity should have a way to take shape.
      </p>
      <p>
        From useful objects for your everyday spaces to a custom part imagined
        from scratch, we’re here to help you turn a possibility into something
        tangible.
      </p>
      <div className="information-features">
        <FeatureCard icon="bulb" title="Made for your ideas">
          Personal projects, practical fixes, and creative experiments.
        </FeatureCard>
        <FeatureCard icon="layers" title="Made with intention">
          Material, form, and function considered together.
        </FeatureCard>
        <FeatureCard icon="pin" title="Rooted in Jacksonville">
          Local pickup with nationwide shipping planned at launch.
        </FeatureCard>
      </div>
      <ButtonLink href="/custom-orders">Let’s build something</ButtonLink>
    </div>
  );
}
