import { PageHero } from '@/components/shared/PageHero';
import { Section } from '@/components/ui/Section';
import { routes } from '@/config/routes';
import { ProjectRequestForm } from '@/features/project-request/ProjectRequestForm';
import { usePageMeta } from '@/hooks/usePageMeta';
import './RequestProposalPage.css';

export function RequestProposalPage() {
  usePageMeta({
    title: 'Request a Proposal',
    description:
      'Tell Escano Construction about your project — project type, property, scope, budget range, timeline, and contact details.',
  });

  return (
    <>
      <PageHero
        eyebrow="Request a Proposal"
        title="Tell us about your project"
        lede="Nine short steps, ending with a review of everything you entered. Nothing is calculated, priced, or promised here — the goal is to understand the work well enough to scope it properly."
        crumbs={[{ label: 'Home', to: routes.home }, { label: 'Request a Proposal' }]}
      />

      <Section>
        <div className="request-page">
          <ProjectRequestForm />
        </div>
      </Section>
    </>
  );
}
