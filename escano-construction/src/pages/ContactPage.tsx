import { Link } from 'react-router-dom';
import { PageHero } from '@/components/shared/PageHero';
import { Section } from '@/components/ui/Section';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { ContactForm } from '@/features/contact/ContactForm';
import { usePageMeta } from '@/hooks/usePageMeta';
import './ContactPage.css';

export function ContactPage() {
  usePageMeta({
    title: 'Contact',
    description:
      'Get in touch with Escano Construction LLC about a residential or commercial construction project, or request a proposal for scoped work.',
  });

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        lede="For a general question, use the form below. If you already know what you want built, the proposal request form gathers far more useful detail."
        crumbs={[{ label: 'Home', to: routes.home }, { label: 'Contact' }]}
      />

      <Section>
        <div className="contact-layout">
          <div className="contact-layout__form">
            <h2 className="contact-heading">Send a message</h2>
            <ContactForm />
          </div>

          <aside className="contact-aside" aria-label="Contact details and next steps">
            {/* Prominent route to the intake form, per the brief. */}
            <div className="contact-aside__cta">
              <p className="contact-aside__cta-label">Planning a construction project-</p>
              <Link className="contact-aside__cta-link" to={routes.requestProposal}>
                Request a Proposal <span aria-hidden="true">&rarr;</span>
              </Link>
              <p className="contact-aside__cta-body">
                A short guided form covering project type, property, scope, budget range, and
                timeline — everything needed to scope the work properly.
              </p>
            </div>

            <div className="contact-aside__block">
              <h3 className="contact-aside__title">Details</h3>
              <dl className="contact-details">
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Service area</dt>
                  <dd>{siteConfig.serviceArea}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
