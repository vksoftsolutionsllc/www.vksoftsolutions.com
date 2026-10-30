import { Link } from "react-router";
import { FileText } from "lucide-react";
import { Hero, InnerPage } from "../components/PageBlocks";
import { usePageMeta } from "../lib/meta";
import { site } from "../config/site";

const UPDATED = "October 30, 2026";

export function PrivacyPage() {
  usePageMeta("Privacy Policy", `How ${site.name} collects, uses and protects personal information.`);
  return (
    <InnerPage>
      <Hero eyebrow="Legal" title="Privacy policy." copy={`How ${site.name} collects, uses and protects information submitted through this website.`} breadcrumbs={[{ label: "Privacy" }]} compact />
      <section className="inner-section inner-section-tight">
        <div className="container inner-policy">
          <div className="inner-policy-notice"><FileText size={24} aria-hidden="true" /><div><strong>Last updated: {UPDATED}</strong><p>Questions? Contact <a href={`mailto:${site.email}`}>{site.email}</a>.</p></div></div>
          <div className="inner-prose">
            <section><h2>Information we collect</h2><p>When you contact us, request talent, apply for a job or subscribe to updates, we collect the details you provide — such as your name, email, phone number, company, message, location, work authorization, professional profile and résumé.</p><p>We also record limited technical information (for example, a one-way hash of your IP address and your browser type) to protect our forms from abuse.</p></section>
            <section><h2>How we use it</h2><p>We use your information to respond to inquiries, provide our services, evaluate job applications, send updates you requested and keep our website secure. We do not sell personal information.</p></section>
            <section><h2>Security checks</h2><p>Our forms use Cloudflare Turnstile to distinguish people from automated traffic. Cloudflare processes limited device and interaction data for this purpose under its own privacy policy.</p></section>
            <section><h2>Storage and access</h2><p>Submissions are stored in a secured database hosted by Supabase and are accessible only to authorized {site.name} staff. Résumés are shared with clients only for roles you have been considered for, and with your consent where required.</p></section>
            <section><h2>Retention</h2><p>We keep inquiries and applications for as long as needed for the purposes above and to meet legal obligations, then delete or anonymize them. You can unsubscribe from updates at any time.</p></section>
            <section><h2>Your choices</h2><p>You can ask to access, correct or delete your personal information by emailing <a href={`mailto:${site.email}`}>{site.email}</a>. We’ll respond within a reasonable time and as required by applicable law.</p></section>
          </div>
        </div>
      </section>
    </InnerPage>
  );
}

export function TermsPage() {
  usePageMeta("Terms of Use", `Terms that apply to the use of the ${site.name} website.`);
  return (
    <InnerPage>
      <Hero eyebrow="Legal" title="Terms of use." copy={`The terms that apply when you use the ${site.name} website.`} breadcrumbs={[{ label: "Terms" }]} compact />
      <section className="inner-section inner-section-tight">
        <div className="container inner-policy">
          <div className="inner-policy-notice"><FileText size={24} aria-hidden="true" /><div><strong>Last updated: {UPDATED}</strong><p>By using this website you agree to these terms.</p></div></div>
          <div className="inner-prose">
            <section><h2>Website content</h2><p>Content on this website is provided for general information. It doesn’t constitute professional advice, and submitting an inquiry doesn’t create a service agreement. Engagements are governed by separately signed contracts.</p></section>
            <section><h2>Job postings</h2><p>Job listings describe current or anticipated openings and may change or close without notice. Submitting an application doesn’t guarantee an interview or employment.</p></section>
            <section><h2>Acceptable use</h2><p>Don’t misuse this website — for example, by submitting false information, attempting unauthorized access or interfering with its operation.</p></section>
            <section><h2>Intellectual property</h2><p>Unless otherwise stated, website content is owned by {site.legalName}. Photography is used under the Unsplash license. You may share links to our pages but may not reproduce content for commercial use without permission.</p></section>
            <section><h2>Liability</h2><p>The website is provided “as is”. To the extent permitted by law, {site.legalName} isn’t liable for losses arising from its use.</p></section>
            <section><h2>Contact</h2><p>Questions about these terms? Email <a href={`mailto:${site.email}`}>{site.email}</a> or use our <Link to="/contact">contact form</Link>.</p></section>
          </div>
        </div>
      </section>
    </InnerPage>
  );
}
