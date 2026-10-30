import { Compass, Globe, Leaf, Lightbulb, type LucideIcon } from "lucide-react";

export type AboutPage = { slug: string; title: string; copy: string; icon: LucideIcon; heading: string; lead: string; sections: [string, string][] };

export const aboutPages: AboutPage[] = [
  {
    slug: "approach", title: "Our approach", copy: "Start with the problem. Make the next step clear.", icon: Compass,
    heading: "Clarity is a good starting point.",
    lead: "We begin with the business problem, make decisions visible and agree what a useful result looks like before we write a line of code or open a requisition.",
    sections: [
      ["Listen before prescribing", "We take time to understand the people, systems and constraints involved. A useful recommendation starts with your situation — not a predetermined technology or headcount."],
      ["Make the trade-offs clear", "Scope, effort, cost and risk are discussed openly. We document assumptions and give you options, including the simplest one."],
      ["Deliver in small, visible steps", "Short iterations, regular demos and clear reporting mean you always know progress — and can change direction early."],
      ["Leave you stronger", "Documentation, knowledge transfer and clean handovers are planned from day one, so capability stays with your organization."],
    ],
  },
  {
    slug: "values", title: "Our values", copy: "The principles behind every engagement.", icon: Lightbulb,
    heading: "Principles for better work.",
    lead: "The way we advise, build and recruit is guided by a few simple commitments.",
    sections: [
      ["Integrity", "We say what we’ll do and do what we say — a company is only as good as the promises it keeps."],
      ["Clarity", "Plain language, stated assumptions and responsibilities everyone understands."],
      ["Practicality", "We choose the approach that fits the problem. Complexity needs a reason to exist."],
      ["People first", "Clients, consultants and candidates are treated with respect, responsiveness and care."],
    ],
  },
  {
    slug: "diversity", title: "Diversity & inclusion", copy: "Different perspectives. Shared respect.", icon: Globe,
    heading: "Different perspectives. Shared respect.",
    lead: "Great technology teams are built from people with different backgrounds, experiences and ways of thinking.",
    sections: [
      ["Fair, skills-based hiring", "We assess candidates on skills and potential, use structured interviews and give every applicant a respectful experience."],
      ["Inclusive collaboration", "Clear communication and an environment where questions and ideas are welcome — across locations and time zones."],
      ["Accessible by design", "We consider different needs when designing software and the way people interact with it."],
      ["Equal opportunity", "VK Soft Solutions is an equal opportunity employer. Employment decisions are made without regard to race, color, religion, sex, sexual orientation, gender identity, national origin, age, disability, veteran status or any other protected characteristic."],
    ],
  },
  {
    slug: "responsibility", title: "Social responsibility", copy: "Thoughtful choices. Lasting responsibility.", icon: Leaf,
    heading: "Thoughtful choices. Lasting responsibility.",
    lead: "Technology creates opportunities and obligations. Good planning considers who is affected and what happens after delivery.",
    sections: [
      ["Responsible technology", "We discuss data access, intended use, human oversight and the limits of an application before defining its scope."],
      ["Data protection", "Personal information is collected only when needed, protected while we hold it and deleted when it’s no longer required."],
      ["Growing talent", "We support early-career professionals through mentoring, training and real project experience."],
      ["Community", "We look for opportunities to share skills and time with the communities where our people live and work."],
    ],
  },
];
