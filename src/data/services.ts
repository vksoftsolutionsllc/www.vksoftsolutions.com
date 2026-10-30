import {
  BarChart3, BrainCircuit, Briefcase, Building2, Cloud, Code, Compass, Database, GitBranch, Globe, Handshake,
  Layers, Lightbulb, LineChart, Network, Rocket, Search, Server, ShieldCheck, Smartphone, TestTube, Timer,
  UserCheck, Users, Workflow, Wrench, type LucideIcon,
} from "lucide-react";

export type Capability = { title: string; copy: string; icon: LucideIcon };
export type Offering = {
  slug: string;
  title: string;
  short: string;
  headline: [string, string];
  eyebrow: string;
  lead: string;
  intro: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  formService: string;
  capabilities: Capability[];
  outcomes: string[];
  questions: [string, string][];
};

export const services: Offering[] = [
  {
    slug: "it-consulting",
    title: "IT Consulting & Advisory",
    short: "A clearer path through technology.",
    headline: ["A clearer path.", "Through technology."],
    eyebrow: "Clarity before complexity",
    lead: "Make your next technology decision with confidence — grounded in your business goals, your constraints and a roadmap your team can actually follow.",
    intro: "We connect business priorities to practical technology choices: assessing what you have, defining what you need and planning how to get there without disrupting the work that already runs your business.",
    icon: Compass,
    image: "/images/consulting.jpg",
    imageAlt: "A team planning ideas on a whiteboard",
    formService: "it-consulting",
    capabilities: [
      { title: "Technology strategy & roadmaps", copy: "Assess current systems, align stakeholders and turn priorities into a sequenced, budgeted plan.", icon: Compass },
      { title: "Architecture & modernization", copy: "Untangle legacy platforms and design architectures where applications, data and infrastructure work together.", icon: Layers },
      { title: "Program & delivery advisory", copy: "Set scope, governance and ownership so large initiatives stay on schedule and on budget.", icon: Workflow },
      { title: "Vendor & platform selection", copy: "Compare options objectively — fit, total cost, risk and lock-in — before you sign.", icon: Search },
    ],
    outcomes: ["A current-state assessment of systems, risks and costs", "A prioritized roadmap tied to business outcomes", "Reference architecture and key design decisions", "A delivery plan with owners, milestones and budget"],
    questions: [
      ["How long does an assessment take?", "Most assessments run two to six weeks depending on the number of systems and stakeholders involved. We agree the scope and timeline up front."],
      ["Do you only advise, or can you also deliver?", "Both. Many clients start with advisory and continue with our engineering or talent teams — but the recommendations stand on their own if you deliver internally."],
      ["Are your recommendations vendor-neutral?", "Yes. We’ll tell you when a simpler or cheaper option is the right call, and we disclose any partnerships that could be relevant."],
    ],
  },
  {
    slug: "software-development",
    title: "Custom Software Development",
    short: "Software shaped around how you work.",
    headline: ["Software built", "around your business."],
    eyebrow: "Design. Build. Evolve.",
    lead: "Web, mobile and API products engineered for reliability and change — delivered by teams that care about the people who will use them.",
    intro: "From a focused internal tool to a customer-facing platform, we take products from discovery through design, build, launch and ongoing improvement using modern, maintainable engineering practice.",
    icon: Code,
    image: "/images/code.jpg",
    imageAlt: "Source code on a laptop screen",
    formService: "software-development",
    capabilities: [
      { title: "Web applications & portals", copy: "Responsive, accessible applications in React, Angular, .NET, Java and Node.js.", icon: Globe },
      { title: "Mobile apps", copy: "Native and cross-platform apps for iOS and Android with secure back-end services.", icon: Smartphone },
      { title: "APIs & integrations", copy: "Connect ERPs, CRMs, payment providers and partners with well-documented, versioned APIs.", icon: Network },
      { title: "Application modernization", copy: "Re-platform or refactor legacy systems incrementally, without a risky big-bang rewrite.", icon: Wrench },
    ],
    outcomes: ["A clickable prototype validated with real users", "A production-ready release with automated tests", "CI/CD pipelines and environment setup", "Documentation and a clean handover to your team"],
    questions: [
      ["Which technologies do you work with?", "Commonly Java/Spring, .NET, Node.js, Python, React, Angular, React Native and Flutter, on AWS, Azure or GCP. We choose based on your team and long-term support, not fashion."],
      ["Who owns the code?", "You do. Source code, designs and documentation belong to you as agreed in the engagement contract."],
      ["Can you work alongside our developers?", "Yes — we often embed engineers into existing teams, follow your standards and tooling, and help raise the bar on testing and delivery."],
    ],
  },
  {
    slug: "ai-data",
    title: "AI, Data & Analytics",
    short: "Turn data into decisions — and automation.",
    headline: ["Useful AI.", "Grounded in your data."],
    eyebrow: "Practical intelligence",
    lead: "Data platforms, analytics and AI applications that solve a specific business problem — with the governance to trust the results.",
    intro: "We start with the decision or workflow you want to improve, check whether your data can support it, and then build the simplest solution that works — from dashboards to generative AI assistants.",
    icon: BrainCircuit,
    image: "/images/analytics.jpg",
    imageAlt: "Analytics dashboard on a laptop",
    formService: "ai-data",
    capabilities: [
      { title: "Generative AI & assistants", copy: "Retrieval-augmented assistants, document processing and copilots connected to your own knowledge.", icon: BrainCircuit },
      { title: "Data engineering & platforms", copy: "Reliable pipelines and modern warehouses on Snowflake, Databricks, BigQuery or Azure Fabric.", icon: Database },
      { title: "BI & analytics", copy: "Self-service dashboards in Power BI, Tableau or Looker with metrics everyone agrees on.", icon: BarChart3 },
      { title: "Machine learning & automation", copy: "Forecasting, classification and workflow automation with monitoring built in from day one.", icon: Workflow },
    ],
    outcomes: ["An AI use-case shortlist ranked by value and feasibility", "A data readiness and governance review", "A working pilot measured against agreed success criteria", "A plan to scale, monitor and support it in production"],
    questions: [
      ["We’re not sure our data is good enough. Can we still start?", "Yes. A short readiness review shows what’s usable today, what needs fixing and whether a simpler non-AI approach would deliver faster."],
      ["How do you handle privacy and security with AI?", "We design for least-privilege access, keep sensitive data inside your cloud tenancy where possible, and add human review where decisions matter."],
      ["Which AI models do you use?", "We’re model-agnostic and select from leading commercial and open models based on accuracy, cost, latency and data-residency needs."],
    ],
  },
  {
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    short: "Infrastructure that scales — and ships.",
    headline: ["Faster releases.", "Steadier platforms."],
    eyebrow: "Build once, run well",
    lead: "Cloud migration, platform engineering and DevOps automation that cut release friction and keep running costs under control.",
    intro: "We help teams move to the cloud deliberately, automate the path from commit to production, and operate platforms that are secure, observable and cost-aware.",
    icon: Cloud,
    image: "/images/cloud.jpg",
    imageAlt: "Earth at night from orbit showing connected city lights",
    formService: "cloud-devops",
    capabilities: [
      { title: "Cloud migration", copy: "Assess, plan and migrate workloads to AWS, Azure or GCP with minimal downtime.", icon: Cloud },
      { title: "CI/CD & automation", copy: "Pipelines, infrastructure as code (Terraform, Bicep) and automated testing gates.", icon: GitBranch },
      { title: "Kubernetes & platform engineering", copy: "Container platforms and golden paths that let developers ship safely on their own.", icon: Server },
      { title: "Security, reliability & FinOps", copy: "Hardening, monitoring, incident readiness and continuous cost optimization.", icon: ShieldCheck },
    ],
    outcomes: ["A migration plan with wave sequencing and risks", "Automated, repeatable environments", "Monitoring, alerting and runbooks", "A cost baseline with savings opportunities"],
    questions: [
      ["Can you support us after migration?", "Yes. We offer managed DevOps and on-call support options, or we can train your team to take over fully."],
      ["Do you work with hybrid or on-prem environments?", "Yes. Many clients run hybrid estates; we design networking, identity and operations to work across both."],
      ["How do you keep cloud costs in check?", "Tagging, budgets and alerts from day one, right-sizing and reserved capacity reviews, plus monthly reporting you can share with finance."],
    ],
  },
  {
    slug: "enterprise-applications",
    title: "Enterprise Applications",
    short: "Get more from the platforms you run on.",
    headline: ["Your platforms,", "working together."],
    eyebrow: "Salesforce · Workday · ServiceNow · SAP",
    lead: "Implementation, integration and optimization for the enterprise platforms that run sales, people, service and finance.",
    intro: "Certified consultants and architects configure, extend and connect your core platforms — and help your teams adopt them — so you get the value you paid for.",
    icon: Building2,
    image: "/images/workspace.jpg",
    imageAlt: "An open-plan office with many workstations",
    formService: "enterprise-applications",
    capabilities: [
      { title: "Salesforce", copy: "Sales, Service and Experience Cloud implementations, Apex/LWC development and integrations.", icon: Rocket },
      { title: "Workday & HCM", copy: "Core HCM, Payroll, Benefits and Absence configuration, reporting and data conversion.", icon: Users },
      { title: "ServiceNow & ITSM", copy: "ITSM, ITOM and portfolio management workflows that make IT more predictable.", icon: Workflow },
      { title: "SAP & ERP", copy: "Functional and technical consulting, integrations and S/4HANA readiness.", icon: Layers },
    ],
    outcomes: ["A platform health check and backlog", "Configured, tested releases on your sandbox cadence", "Integrations with your surrounding systems", "Admin training and user adoption support"],
    questions: [
      ["Do you provide certified resources?", "Yes. We staff platform roles with consultants who hold current certifications relevant to the work."],
      ["Can you take over an implementation that’s in trouble?", "Yes. We start with a quick recovery assessment, stabilize the release plan and then work through the backlog with you."],
      ["Do you offer ongoing support?", "We offer flexible managed-support retainers for administration, enhancements and release management."],
    ],
  },
  {
    slug: "quality-engineering",
    title: "Quality Engineering & Testing",
    short: "Release with confidence.",
    headline: ["Quality built in.", "Not bolted on."],
    eyebrow: "Test early. Test often.",
    lead: "Functional, automation, performance and security testing that catches issues early and keeps releases on track.",
    intro: "We embed quality engineers into delivery teams, automate the right tests at the right layers, and give you clear evidence that a release is ready.",
    icon: TestTube,
    image: "/images/engineer.jpg",
    imageAlt: "A professional working on a laptop",
    formService: "quality-engineering",
    capabilities: [
      { title: "Test automation", copy: "UI, API and mobile automation with Playwright, Selenium, Cypress and Appium.", icon: TestTube },
      { title: "Performance engineering", copy: "Load and stress testing with JMeter, k6 or Gatling, plus bottleneck analysis.", icon: Timer },
      { title: "Security testing", copy: "Static and dynamic scans, dependency audits and remediation guidance.", icon: ShieldCheck },
      { title: "QA strategy & advisory", copy: "Test strategy, environments and metrics that fit your delivery model.", icon: Lightbulb },
    ],
    outcomes: ["A test strategy aligned to risk", "An automation suite running in CI", "Performance baselines and capacity limits", "Release-readiness reporting"],
    questions: [
      ["Can you automate our existing manual tests?", "Yes. We prioritize high-value regression paths first and build a maintainable framework your team can extend."],
      ["Do you test mobile apps?", "Yes — on real devices and device clouds across iOS and Android."],
      ["Can we use offshore testing teams?", "Yes. Our India-based delivery can provide follow-the-sun testing coordinated by a US-based lead."],
    ],
  },
];

export const talent: Offering[] = [
  {
    slug: "staff-augmentation",
    title: "Staff Augmentation",
    short: "Skilled professionals, on your timeline.",
    headline: ["The right expertise.", "Exactly when you need it."],
    eyebrow: "Flexible workforce",
    lead: "Add pre-screened IT professionals to your team on contract — scale up for a project, cover a gap or bring in a specialist skill.",
    intro: "We source, screen and onboard contract consultants across development, data, cloud, QA, enterprise applications and project management, and support them throughout the assignment.",
    icon: Users,
    image: "/images/team.jpg",
    imageAlt: "Colleagues working together on laptops",
    formService: "staffing",
    capabilities: [
      { title: "Fast, targeted sourcing", copy: "A recruiter-led search backed by our network and technical screening — typically shortlists within days.", icon: Search },
      { title: "Technical vetting", copy: "Skills interviews, coding or scenario assessments and reference checks before you meet a candidate.", icon: UserCheck },
      { title: "Compliance & payroll", copy: "We handle onboarding, payroll, benefits and background checks for every consultant.", icon: ShieldCheck },
      { title: "Account management", copy: "A single point of contact who checks in regularly with you and the consultant.", icon: Handshake },
    ],
    outcomes: ["A clear role profile and rate guidance", "A shortlist of screened candidates", "Smooth onboarding with compliance handled", "Ongoing performance check-ins"],
    questions: [
      ["How fast can you provide candidates?", "For common skill sets, we typically share first profiles within 2–5 business days. Niche roles can take longer; we’ll tell you up front."],
      ["What if a consultant isn’t the right fit?", "Tell us early. We’ll address it quickly and, if needed, provide a replacement as agreed in your contract."],
      ["Which roles do you staff?", "Developers, architects, data engineers, cloud/DevOps, QA, business analysts, project managers and enterprise application consultants."],
    ],
  },
  {
    slug: "contract-to-hire",
    title: "Contract-to-Hire",
    short: "Try the fit before you commit.",
    headline: ["Work together first.", "Hire with confidence."],
    eyebrow: "Lower-risk hiring",
    lead: "Start a professional on contract and convert them to your payroll once you’re sure about skills and culture fit.",
    intro: "Contract-to-hire lets you evaluate real work before making a permanent offer — while we manage the contract period and the conversion.",
    icon: Briefcase,
    image: "/images/collaboration.jpg",
    imageAlt: "Colleagues discussing work at a table",
    formService: "staffing",
    capabilities: [
      { title: "Agreed conversion terms", copy: "Conversion timing and fees agreed before the assignment starts — no surprises.", icon: Handshake },
      { title: "Candidates open to conversion", copy: "We confirm intent to convert up front, so you don’t lose people at the finish line.", icon: UserCheck },
      { title: "Managed contract period", copy: "Payroll, compliance and check-ins handled while you evaluate.", icon: ShieldCheck },
      { title: "Smooth transition", copy: "Support with offer, start date and paperwork when you convert.", icon: Rocket },
    ],
    outcomes: ["A role profile and conversion plan", "Screened candidates open to permanent roles", "A managed evaluation period", "A clean hand-off to your payroll"],
    questions: [
      ["How long is the contract period?", "Typically three to six months, but it’s flexible and agreed with you before the start."],
      ["Is there a conversion fee?", "Conversion terms are set in your agreement and can be reduced the longer the consultant has been on contract."],
      ["Can we convert early?", "Yes — early conversion is possible under the agreed terms."],
    ],
  },
  {
    slug: "direct-hire",
    title: "Direct Hire & Leadership Search",
    short: "Permanent talent for critical roles.",
    headline: ["Permanent hires.", "Lasting impact."],
    eyebrow: "Leadership & strategic hiring",
    lead: "Find permanent technology professionals and leaders — from senior engineers to heads of engineering, data and IT.",
    intro: "Our recruiters run a structured search: understanding the role and your culture, reaching passive candidates and presenting a short, well-qualified slate.",
    icon: UserCheck,
    image: "/images/interview.jpg",
    imageAlt: "Two people shaking hands after an interview",
    formService: "staffing",
    capabilities: [
      { title: "Role & market calibration", copy: "Define the profile, compensation range and selling points before outreach starts.", icon: LineChart },
      { title: "Passive-candidate outreach", copy: "Targeted, discreet approaches to people who aren’t actively applying.", icon: Search },
      { title: "Structured assessment", copy: "Competency-based interviews and references aligned to your scorecard.", icon: ShieldCheck },
      { title: "Offer & onboarding support", copy: "Help with negotiation, counter-offers and a smooth first week.", icon: Handshake },
    ],
    outcomes: ["A calibrated role profile and market data", "A shortlist of qualified, interested candidates", "Interview coordination and feedback loops", "Offer management through acceptance"],
    questions: [
      ["How is direct hire priced?", "Usually a percentage of first-year base salary, payable on hire. Retained options are available for leadership searches."],
      ["Do you offer a replacement guarantee?", "Yes — a replacement period is included in our standard terms."],
      ["Do you recruit outside the US?", "Yes. We recruit in the US and India, and can support distributed teams."],
    ],
  },
  {
    slug: "dedicated-teams",
    title: "Dedicated Teams & Offshore Delivery",
    short: "A team that works as yours.",
    headline: ["Your extended team.", "Across time zones."],
    eyebrow: "US–India delivery",
    lead: "A dedicated, cross-functional team — engineers, QA, analysts and a delivery lead — working exclusively on your product.",
    intro: "Combine US-based leadership with India-based delivery to extend capacity cost-effectively, with overlapping hours, clear governance and transparent reporting.",
    icon: Globe,
    image: "/images/manufacturing.jpg",
    imageAlt: "An engineer working with equipment in a lab",
    formService: "staffing",
    capabilities: [
      { title: "Team design", copy: "We help define the right mix of roles and seniority for your roadmap and budget.", icon: Users },
      { title: "Onshore–offshore model", copy: "US-based leads for communication; offshore delivery for capacity and coverage.", icon: Globe },
      { title: "Agile governance", copy: "Sprints, demos and dashboards so you always know what’s happening.", icon: Workflow },
      { title: "Knowledge retention", copy: "Documentation, pairing and low attrition practices protect continuity.", icon: Database },
    ],
    outcomes: ["A team plan with roles, ramp-up and cost", "A 30-60-90 day onboarding plan", "Agreed KPIs and reporting cadence", "A scalable model as your needs change"],
    questions: [
      ["How much overlap will we have with the team?", "We plan for daily overlap with US hours and schedule key ceremonies when everyone is online."],
      ["How do you protect our IP and data?", "Contracts assign IP to you; teams work on your systems with secure access, NDAs and device policies."],
      ["Can the team grow or shrink?", "Yes. Teams scale with agreed notice periods."],
    ],
  },
  {
    slug: "recruitment-process-outsourcing",
    title: "Scaled Hiring & RPO",
    short: "Structure and speed for big hiring plans.",
    headline: ["Hiring at scale.", "Without losing quality."],
    eyebrow: "Recruitment process outsourcing",
    lead: "Take on part or all of your technology recruiting — from sourcing to offer — when hiring volumes outgrow your internal team.",
    intro: "Our recruiters work as an extension of your talent team, using your brand, tools and process, with reporting on pipeline health, time-to-fill and quality of hire.",
    icon: Rocket,
    image: "/images/office.jpg",
    imageAlt: "A bright glass-walled office corridor",
    formService: "staffing",
    capabilities: [
      { title: "Project-based hiring", copy: "Ramp a new team or location quickly with a focused recruiting sprint.", icon: Rocket },
      { title: "End-to-end RPO", copy: "Sourcing, screening, scheduling and offer management under one program.", icon: Workflow },
      { title: "Employer brand & outreach", copy: "Campaigns and talent pools that make future hiring easier.", icon: Lightbulb },
      { title: "Hiring analytics", copy: "Funnel, source and time-to-fill reporting to improve every quarter.", icon: BarChart3 },
    ],
    outcomes: ["A hiring plan with capacity and timelines", "Dedicated recruiters on your process", "Weekly pipeline reporting", "Continuous improvement reviews"],
    questions: [
      ["What volume makes RPO worthwhile?", "Usually when you plan to hire more than 10–15 technology roles over a few months, or open a new hub."],
      ["Do you use our ATS?", "Yes. We work inside your applicant tracking system and follow your approval workflows."],
      ["Can we start small?", "Yes — many clients start with a project-based engagement and expand later."],
    ],
  },
];

export const allOfferings = [...services, ...talent];
