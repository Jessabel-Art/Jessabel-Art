import { ButtonLink } from "@/components/ui";
export default function NotFound() {
  return (
    <div className="container information-page">
      <p className="eyebrow">404 / A missing piece</p>
      <h1>
        Let’s get you
        <br />
        <span>back to creating.</span>
      </h1>
      <p>We couldn’t find that page.</p>
      <ButtonLink href="/">Back to home</ButtonLink>
    </div>
  );
}
