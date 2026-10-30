import {
  Accessibility, BookOpen, ClipboardCheck, Compass, Ear, Flag, Gauge, Globe, GraduationCap, HeartHandshake, Leaf,
  Lightbulb, Lock, MessageSquare, Recycle, Repeat, Scale, ShieldCheck, Sparkles, Target, UserCheck, Users,
  type LucideIcon,
} from "lucide-react";

export type Principle = { title: string; copy: string; icon: LucideIcon };
export type AboutPage = {
  slug: string;
  title: string;
  copy: string;
  icon: LucideIcon;
  heading: string;
  lead: string;
  image: string;
  imageAlt: string;
  intro: string;
  statement: string;
  sections: Principle[];
  practiceTitle: string;
  practices: string[];
  quote: string;
};

export const aboutPages: AboutPage[] = [
  {
    slug: "approach", title: "Our approach", copy: "Start with the problem. Make the next step clear.", icon: Compass,
    heading: "Clarity is a good starting point.",
    lead: "We begin with the business problem, make decisions visible and agree what a useful result looks like — before we write a line of code or open a requisition.",
    image: "/images/consulting.jpg", imageAlt: "A team mapping ideas on a whiteboard",
    intro: "Technology projects and hiring decisions rarely fail for technical reasons. They fail because goals were vague, trade-offs were hidden or the people involved weren’t heard. Our approach is designed to remove those risks early.",
    statement: "We listen first, recommend second and deliver in small, visible steps — so you always know where things stand and why.",
    sections: [
      { title: "Listen before prescribing", copy: "We take time to understand the people, systems and constraints involved. A useful recommendation starts with your situation — not a predetermined technology, vendor or headcount.", icon: Ear },
      { title: "Make trade-offs visible", copy: "Scope, effort, cost and risk are discussed openly. We document assumptions and give you real options, including the simplest one, so decisions are informed rather than assumed.", icon: Scale },
      { title: "Start small, prove value", copy: "Where it makes sense we begin with a discovery, a prototype or a single hire — evidence first, then scale. It reduces risk and builds confidence on both sides.", icon: Target },
      { title: "Deliver in visible increments", copy: "Short iterations, regular demos and plain-language status updates mean progress is never a surprise, and you can change direction early when priorities shift.", icon: Repeat },
      { title: "Measure what matters", copy: "We agree success criteria up front — adoption, cycle time, quality, time-to-fill — and report against them, not just against tasks completed.", icon: Gauge },
      { title: "Leave you stronger", copy: "Documentation, knowledge transfer and clean handovers are planned from day one, so capability stays with your organization after we step back.", icon: GraduationCap },
    ],
    practiceTitle: "What our approach looks like in practice",
    practices: [
      "A short written discovery summary that captures goals, constraints and open questions",
      "A named point of contact and a clear escalation path",
      "Weekly updates that cover progress, risks and decisions needed — in plain language",
      "Working demos or candidate shortlists at agreed checkpoints, not just at the end",
      "A documented handover plan and knowledge-transfer sessions before we roll off",
    ],
    quote: "The best technology decision is one your team understands, can afford and can keep running.",
  },
  {
    slug: "values", title: "Our values", copy: "The principles behind every engagement.", icon: Lightbulb,
    heading: "Principles for better work.",
    lead: "The way we advise, build and recruit is guided by a few simple commitments — to clients, to consultants and to every candidate we speak with.",
    image: "/images/team.jpg", imageAlt: "Colleagues collaborating around laptops",
    intro: "Values only matter if they change how people behave on an ordinary Tuesday. These are the principles we use to make decisions, resolve disagreements and decide what “good” looks like.",
    statement: "A company is only as good as the promises it keeps — so we promise only what we can deliver, and then we deliver it.",
    sections: [
      { title: "Integrity", copy: "We say what we’ll do and do what we say. Honest estimates, transparent pricing and no surprises — even when the news isn’t what anyone hoped to hear.", icon: ShieldCheck },
      { title: "Clarity", copy: "Plain language, stated assumptions and responsibilities everyone understands. If something is unclear, we ask — and we make it easy for you to ask us.", icon: MessageSquare },
      { title: "Practicality", copy: "We choose the approach that fits the problem and the budget. Complexity needs a reason to exist, and the simplest workable solution usually wins.", icon: Lightbulb },
      { title: "People first", copy: "Clients, consultants and candidates are treated with respect, responsiveness and care. Good work comes from people who feel informed and supported.", icon: HeartHandshake },
      { title: "Ownership", copy: "We take responsibility for outcomes, not just tasks. When something goes wrong we raise it early, own our part and focus on fixing it.", icon: Flag },
      { title: "Continuous learning", copy: "Technology changes quickly. We invest in skills, review every engagement honestly and turn what we learn into better ways of working.", icon: BookOpen },
    ],
    practiceTitle: "How our values show up day to day",
    practices: [
      "Estimates that include risks and assumptions, not just a single number",
      "Raising concerns early — even when it’s uncomfortable",
      "Recommending the simpler or cheaper option when it’s the right one",
      "Returning every candidate’s call and closing the loop on every application",
      "Reviewing each engagement and acting on what clients tell us",
    ],
    quote: "A company is only as good as the promises it keeps.",
  },
  {
    slug: "diversity", title: "Diversity & inclusion", copy: "Different perspectives. Shared respect.", icon: Globe,
    heading: "Different perspectives. Shared respect.",
    lead: "Great technology teams are built from people with different backgrounds, experiences and ways of thinking — and they do their best work when everyone is heard.",
    image: "/images/collaboration.jpg", imageAlt: "A diverse team working together at a table",
    intro: "As a technology and talent company that works across the United States and India, inclusion isn’t a side project for us. It shapes how we write job descriptions, run interviews, build teams and design software.",
    statement: "We hire for skills and potential, assess every candidate fairly and build teams where different perspectives are an advantage.",
    sections: [
      { title: "Skills-based hiring", copy: "We focus on what people can do and how they learn, not on pedigree. Requirements are reviewed so they reflect the job — not habit or unnecessary credentials.", icon: UserCheck },
      { title: "Structured, fair interviews", copy: "Consistent questions, clear scorecards and diverse interview panels where possible help us reduce bias and give every candidate the same opportunity.", icon: ClipboardCheck },
      { title: "Inclusive collaboration", copy: "Across locations and time zones we keep communication clear and respectful, share context generously and make space for quieter voices.", icon: Users },
      { title: "Accessible by design", copy: "We consider different abilities and needs when designing software and digital experiences, following recognized accessibility guidelines.", icon: Accessibility },
      { title: "Growth for everyone", copy: "Mentoring, learning time and stretch opportunities are available to people at every stage of their career — not just a selected few.", icon: GraduationCap },
      { title: "Equal opportunity", copy: "VK Soft Solutions is an equal opportunity employer. Employment decisions are made without regard to race, color, religion, sex, sexual orientation, gender identity, national origin, age, disability, veteran status or any other legally protected characteristic.", icon: Scale },
    ],
    practiceTitle: "Our inclusion commitments",
    practices: [
      "Job descriptions written in plain, inclusive language",
      "Consistent interview questions and scorecards for each role",
      "Reasonable accommodations available on request throughout the hiring process",
      "Accessibility considered from the start of the software we design",
      "Respectful, clear communication across cultures and time zones",
    ],
    quote: "The best teams don’t all think alike — they respect each other enough to think together.",
  },
  {
    slug: "responsibility", title: "Social responsibility", copy: "Thoughtful choices. Lasting responsibility.", icon: Leaf,
    heading: "Thoughtful choices. Lasting responsibility.",
    lead: "Technology creates opportunities and obligations. Good planning considers who is affected, how data is protected and what happens long after delivery.",
    image: "/images/architecture.jpg", imageAlt: "Modern office buildings viewed from below",
    intro: "The software we build and the people we place affect customers, employees and communities. We take that seriously — in how we design systems, handle information and grow talent.",
    statement: "We build technology that is secure, respectful of privacy and designed to be maintained — and we help people grow careers along the way.",
    sections: [
      { title: "Responsible technology", copy: "Before defining scope we discuss data access, intended use, human oversight and the limits of an application — especially for AI and automation.", icon: Sparkles },
      { title: "Data protection & privacy", copy: "Personal information is collected only when needed, protected while we hold it and deleted when it’s no longer required.", icon: Lock },
      { title: "Security by design", copy: "Least-privilege access, secure defaults and regular reviews are part of how we build and operate systems — not an afterthought.", icon: ShieldCheck },
      { title: "Growing talent", copy: "We support early-career professionals through mentoring, training and real project experience, and help consultants plan their next step.", icon: GraduationCap },
      { title: "Efficient by default", copy: "Right-sized cloud architectures, remote-first collaboration and reduced travel help cut waste for our clients and for us.", icon: Recycle },
      { title: "Community", copy: "We look for ways to share skills and time with the communities where our people live and work.", icon: HeartHandshake },
    ],
    practiceTitle: "Responsibility in everyday work",
    practices: [
      "Privacy and security questions included in every project discovery",
      "Human review built into AI-assisted decisions that affect people",
      "Résumés shared with clients only with the candidate’s agreement",
      "Cloud cost and resource reviews as part of ongoing support",
      "Mentoring and learning time for consultants and early-career staff",
    ],
    quote: "Responsible technology is simply good technology — built with the people it affects in mind.",
  },
];

export const aboutOverview = {
  mission: "To help organizations make better technology decisions, build reliable software and find the people to run it.",
  vision: "To be the partner growing businesses trust for clear advice, dependable delivery and exceptional technology talent.",
  pillars: [
    { title: "Consult", sub: "Strategy & advisory", copy: "Technology roadmaps, architecture, vendor selection and delivery advisory that connect technology to business goals.", links: [["IT Consulting & Advisory", "/services/it-consulting"], ["Enterprise Applications", "/services/enterprise-applications"]] },
    { title: "Develop", sub: "Software, AI & cloud", copy: "Custom software, data and AI, cloud and DevOps, and quality engineering — designed to be secure, scalable and maintainable.", links: [["Custom Software", "/services/software-development"], ["AI, Data & Analytics", "/services/ai-data"], ["Cloud & DevOps", "/services/cloud-devops"]] },
    { title: "Innovate", sub: "Talent & teams", copy: "Specialists, contract-to-hire, direct hire and dedicated US–India teams that help you move faster with the right skills.", links: [["Staff Augmentation", "/talent/staff-augmentation"], ["Direct Hire", "/talent/direct-hire"], ["Dedicated Teams", "/talent/dedicated-teams"]] },
  ],
  steps: [
    ["Discover", "We learn your goals, systems, constraints and the people involved."],
    ["Define", "We agree scope, team, timeline, budget and how success will be measured."],
    ["Deliver", "We build, staff or advise in short, visible iterations with regular reviews."],
    ["Support", "We stay on for improvements, managed support and knowledge transfer."],
  ] as [string, string][],
  faqs: [
    ["Where is VK Soft Solutions based?", "Our headquarters is in Cumming, Georgia, USA. We serve clients across the United States and combine US-led engagement management with India-based delivery capacity."],
    ["What size of organization do you work with?", "We work with growing companies and established enterprises. Engagements range from a single specialist or short assessment to multi-year programs and dedicated teams."],
    ["Do you deliver projects, provide staff, or both?", "Both. Some clients need a delivered outcome, others need skilled people on their own team — and many use a mix. We’ll recommend the model that fits your situation."],
    ["Can you work remotely or on site?", "Yes. Most engagements are remote or hybrid, and consultants can work on site where the role requires it."],
    ["How do we get started?", "Send us a message or call +1 (847) 217-5672. We’ll set up a short conversation to understand your needs and suggest a practical next step — with no obligation."],
  ] as [string, string][],
};
