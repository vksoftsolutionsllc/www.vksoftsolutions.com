// Website legal content. Have this reviewed by qualified counsel before relying on it.
import { site, fullAddress } from "../config/site";

export type LegalBlock = string | { list: string[] } | { note: string };
export type LegalSection = { id: string; title: string; blocks: LegalBlock[] };
export type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  summary: { title: string; copy: string }[];
  sections: LegalSection[];
};

export const LEGAL_UPDATED = "October 30, 2026";

export const privacy: LegalDoc = {
  title: "Privacy Policy",
  updated: LEGAL_UPDATED,
  intro: `This Privacy Policy explains how ${site.legalName} (“we”, “us”, “our”) collects, uses, shares and protects personal information when you visit ${site.url.replace("https://", "")}, contact us, apply for a job or subscribe to our updates.`,
  summary: [
    { title: "What we collect", copy: "Details you give us in forms — such as your name, contact details, message and résumé — plus limited technical data to keep the site secure." },
    { title: "How we use it", copy: "To respond to you, provide our services, consider you for roles, send updates you asked for and protect our website. We don’t sell personal information." },
    { title: "Your choices", copy: "You can ask to access, correct or delete your information, unsubscribe at any time, and contact us with any privacy question." },
  ],
  sections: [
    { id: "who-we-are", title: "Who we are", blocks: [
      `${site.legalName} is an IT consulting, software engineering and technology staffing company headquartered at ${fullAddress}.`,
      `For any question about this policy or your personal information, contact us at ${site.email} or ${site.phone}.`,
    ] },
    { id: "information-we-collect", title: "Information we collect", blocks: [
      "Information you provide directly:",
      { list: [
        "Contact and inquiry forms — name, email, phone number, company, the service you’re interested in, hiring details (such as roles, headcount and timeline) and your message.",
        "Job applications — name, email, phone, location, years of experience, work authorization status, LinkedIn or portfolio URL, your résumé and anything else you choose to tell us.",
        "Newsletter sign-up — your email address.",
        "Communications — information you share when you email, call or meet with us.",
      ] },
      "Information collected automatically:",
      { list: [
        "A one-way hashed version of your IP address, the page a form was sent from and your browser type — used only to prevent spam and abuse.",
        "Standard server logs kept by our hosting provider (such as request time and status) for security and reliability.",
        "Signals processed by Cloudflare Turnstile to tell people apart from automated traffic.",
      ] },
      "Information from others: when you apply for a role we may receive information from references you provide or, with your knowledge, from professional networking profiles you share with us.",
      { note: "Please don’t include sensitive information — such as government ID numbers, health information or financial account details — in forms or résumés unless we specifically ask for it." },
    ] },
    { id: "how-we-use", title: "How we use your information", blocks: [
      { list: [
        "To respond to inquiries and provide consulting, engineering and staffing services.",
        "To evaluate applications, match candidates with suitable roles and communicate about opportunities.",
        "To send newsletters and updates you subscribed to (you can unsubscribe at any time).",
        "To operate, secure and improve our website, including preventing fraud, spam and abuse.",
        "To meet legal, regulatory and contractual obligations, and to establish or defend legal claims.",
      ] },
      "We do not sell your personal information, and we do not use it for third-party advertising.",
    ] },
    { id: "candidates", title: "Information about job candidates", blocks: [
      "If you apply for a role or send us your résumé, our recruiting team will review your information to consider you for current and future opportunities.",
      "We will discuss an opportunity with you before submitting your profile to a client. Once you agree, we share relevant details — typically your résumé and a summary of your experience — with that client for that role.",
      "Work authorization information is collected only to understand whether a role is a practical fit; you can discuss sponsorship needs with your recruiter.",
    ] },
    { id: "sharing", title: "How we share information", blocks: [
      "We share personal information only as described in this policy:",
      { list: [
        "Clients — candidate information, with your agreement, for roles you are being considered for.",
        "Service providers who help us run our website and business, under contracts that limit their use of your data. These include our hosting provider (Vercel), database provider (Supabase), bot-protection provider (Cloudflare Turnstile) and map provider (Google Maps, on our contact page).",
        "Professional advisers such as lawyers, accountants and auditors, where necessary.",
        "Authorities, when required by law or to protect the rights, safety and security of our company, our clients or others.",
        "A successor organization, if our business is involved in a merger, acquisition or sale of assets.",
      ] },
    ] },
    { id: "cookies", title: "Cookies and similar technologies", blocks: [
      "We do not use advertising or cross-site tracking cookies.",
      { list: [
        "Cloudflare Turnstile may use cookies or similar technology to verify that a form submission comes from a person.",
        "The embedded Google Map on our contact page is provided by Google and may set its own cookies when it loads.",
        "Our admin area stores a login session in your browser’s local storage for authorized staff only.",
      ] },
      "You can block or delete cookies in your browser settings; some features, such as the security check on forms, may then not work.",
    ] },
    { id: "retention", title: "How long we keep information", blocks: [
      "We keep personal information only as long as needed for the purposes described above, including meeting legal, accounting and reporting requirements. As a general guide:",
      { list: [
        "Inquiries — for up to 24 months after our last contact, unless we enter into a business relationship.",
        "Job applications and résumés — for up to 36 months so we can consider you for future roles, unless you ask us to delete them sooner.",
        "Newsletter subscriptions — until you unsubscribe.",
        "Anti-abuse records (hashed IP data) — no longer than a few days.",
      ] },
    ] },
    { id: "security", title: "How we protect information", blocks: [
      "We use reasonable administrative, technical and physical safeguards, including encrypted connections (HTTPS), access controls that limit stored submissions to authorized staff, server-side validation and bot protection on every form.",
      "No method of transmission or storage is completely secure, so we cannot guarantee absolute security, but we work to protect your information and will notify you where required by law.",
    ] },
    { id: "international", title: "International processing", blocks: [
      "We are based in the United States and work with delivery teams in India. Your information may be processed in the United States, India and other countries where our service providers operate. Where required, we use appropriate safeguards for these transfers.",
    ] },
    { id: "your-rights", title: "Your rights and choices", blocks: [
      "Depending on where you live, you may have the right to:",
      { list: [
        "Know what personal information we hold about you and receive a copy.",
        "Correct information that is inaccurate or incomplete.",
        "Ask us to delete your information.",
        "Object to or restrict certain processing, or withdraw consent where processing is based on consent.",
        "Opt out of marketing communications at any time.",
        "Not be discriminated against for exercising your privacy rights.",
      ] },
      `To make a request, email ${site.email} or call ${site.phone}. We may need to verify your identity before responding, and we’ll reply within the time required by applicable law.`,
    ] },
    { id: "children", title: "Children’s privacy", blocks: [
      "Our website and services are intended for adults and businesses. We do not knowingly collect personal information from children under 16. If you believe a child has provided us with information, please contact us and we will delete it.",
    ] },
    { id: "changes", title: "Changes to this policy", blocks: [
      "We may update this policy from time to time. The “Last updated” date at the top shows when it was last revised. Significant changes will be highlighted on this page.",
    ] },
    { id: "contact", title: "Contact us", blocks: [
      `Questions, requests or concerns about privacy can be sent to ${site.email}, by phone at ${site.phone}, or by mail to ${site.legalName}, ${fullAddress}.`,
    ] },
  ],
};

export const terms: LegalDoc = {
  title: "Terms of Use",
  updated: LEGAL_UPDATED,
  intro: `These Terms of Use govern your access to and use of the ${site.name} website. By using the website you agree to these terms. If you don’t agree, please don’t use the website.`,
  summary: [
    { title: "Using our website", copy: "Use the site lawfully and respectfully. Information here is general and doesn’t create a service agreement." },
    { title: "Jobs & inquiries", copy: "Applying or sending an inquiry doesn’t guarantee a response, interview, offer or engagement." },
    { title: "Our content", copy: "Website content belongs to us or our licensors. Engagements are governed by separate signed contracts." },
  ],
  sections: [
    { id: "about", title: "About us", blocks: [
      `The website is operated by ${site.legalName}, ${fullAddress}. You can contact us at ${site.email} or ${site.phone}.`,
    ] },
    { id: "use-of-website", title: "Use of the website", blocks: [
      "You may use the website to learn about our services, contact us, apply for jobs and subscribe to updates. You agree to:",
      { list: [
        "Provide accurate, current information in any form you submit.",
        "Use the website only for lawful purposes and in line with these terms.",
        "Not submit content that is unlawful, misleading, defamatory or infringes anyone’s rights.",
      ] },
    ] },
    { id: "prohibited", title: "Prohibited conduct", blocks: [
      "You must not:",
      { list: [
        "Attempt to gain unauthorized access to the website, our admin area, systems or data.",
        "Interfere with the website’s operation, security checks or rate limits, or introduce malware.",
        "Use bots, scrapers or automated tools to access or collect information from the website.",
        "Impersonate any person or misrepresent your affiliation with any organization.",
        "Use the website to send spam or unsolicited communications.",
      ] },
    ] },
    { id: "no-agreement", title: "Information and inquiries", blocks: [
      "Content on the website is for general information. It is not professional, legal or financial advice, and it may change without notice.",
      "Submitting an inquiry does not create a contract or client relationship. Any services we provide are governed by a separate written agreement that sets out scope, responsibilities, fees and terms.",
    ] },
    { id: "jobs", title: "Job postings and applications", blocks: [
      "Job listings describe current or anticipated openings, which may be with VK Soft Solutions or with our clients. Roles may change, be filled or close without notice.",
      "Submitting an application does not guarantee a response, interview or offer of employment. Any offer is subject to the terms of a written offer letter or agreement.",
      "You confirm that the information in your application is accurate and that you have the right to share any documents you upload.",
    ] },
    { id: "submissions", title: "Your submissions", blocks: [
      "You keep ownership of the information you submit. You grant us permission to store, use and share it as needed to respond to you and provide our services, as described in our Privacy Policy.",
      "Please don’t send us confidential or proprietary information through the website. If an engagement requires it, we’ll agree an appropriate confidentiality arrangement first.",
    ] },
    { id: "ip", title: "Intellectual property", blocks: [
      `The website, including its text, design, logos and graphics, is owned by ${site.legalName} or its licensors and protected by intellectual property laws. Photography is used under license (including the Unsplash license).`,
      "You may view and share links to our pages for personal or internal business use. You may not copy, modify, republish or commercially exploit website content without our written permission.",
    ] },
    { id: "third-party", title: "Third-party services and links", blocks: [
      "The website uses or links to third-party services such as Google Maps and Cloudflare Turnstile. Those services are governed by their own terms and privacy policies, and we are not responsible for their content or practices.",
    ] },
    { id: "disclaimers", title: "Disclaimers", blocks: [
      "The website is provided “as is” and “as available”. To the fullest extent permitted by law, we make no warranties, express or implied, about the website’s accuracy, availability or fitness for a particular purpose, and we don’t guarantee it will be uninterrupted or error-free.",
    ] },
    { id: "liability", title: "Limitation of liability", blocks: [
      `To the fullest extent permitted by law, ${site.legalName} will not be liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of data, profits or business, arising from your use of the website. Nothing in these terms limits liability that cannot be limited by law.`,
    ] },
    { id: "indemnity", title: "Indemnity", blocks: [
      "You agree to indemnify and hold us harmless from claims, losses and expenses (including reasonable legal fees) arising from your misuse of the website or your breach of these terms.",
    ] },
    { id: "law", title: "Governing law", blocks: [
      "These terms are governed by the laws of the State of Georgia, USA, without regard to conflict-of-law rules. Any dispute will be handled in the state or federal courts located in Georgia, unless applicable law requires otherwise.",
    ] },
    { id: "changes", title: "Changes to these terms", blocks: [
      "We may update these terms from time to time. The “Last updated” date shows the latest version. Continuing to use the website after changes means you accept the updated terms.",
    ] },
    { id: "contact", title: "Contact us", blocks: [
      `Questions about these terms? Email ${site.email}, call ${site.phone}, or write to ${site.legalName}, ${fullAddress}.`,
    ] },
  ],
};
