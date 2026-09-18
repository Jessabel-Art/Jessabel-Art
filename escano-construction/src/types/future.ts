/* =============================================================================
   FUTURE DOMAIN CONCEPTS — DOCUMENTATION ONLY. NOT IMPLEMENTED.
   =============================================================================

   The long-term goal for this codebase is a construction proposal drafting and
   management application. This file records the intended domain vocabulary so
   that current naming and identifiers stay compatible with it. Nothing here is
   built, imported, or relied upon by the running application.

   Intended workflow:

     Customer project request
       -> Administrator reviews the request
       -> Proposal is created for a customer and project
       -> Scope of work, line items, materials, labour, quantities,
          unit cost, markup, totals
       -> Payment terms, exclusions, notes
       -> Proposal document -> PDF -> client

   Entities expected in that phase:

     Customer               A person or organisation Escano works with.
     ProjectRequest         The persisted result of the public intake form.
     Project                An accepted piece of work, linked to a customer.
     Service                Already defined in `types/service.ts`.
     Proposal               A priced offer for a project.
     ProposalVersion        An immutable revision of a proposal.
     ProposalLineItem       A single priced row referencing a service id.
     Material / Labour      Cost components behind a line item.
     Tax / Discount         Adjustments applied to proposal totals.
     Deposit                Amount due before work begins.
     PaymentSchedule        Milestones and amounts.
     Terms / Exclusions     Reusable clause libraries.
     Signature              Client acceptance record.

   Deliberate design decisions taken now to keep that work straightforward:

     * Services carry stable string ids and are stored in one place, so
       proposal line items can reference them.
     * Project records reference services by id, not by display name.
     * The intake form produces a single serialisable draft object.
     * Submission goes through one abstraction (the `api` folder inside each
       feature), so a real HTTP client replaces the simulation without
       touching the UI.
     * Validation lives apart from the components, so equivalent server-side
       validation can be added independently.
     * A route prefix is reserved for the authenticated area
       (`APP_ROUTE_PREFIX` in `config/routes.ts`) with its own layout.

   ========================================================================== */

export {};
