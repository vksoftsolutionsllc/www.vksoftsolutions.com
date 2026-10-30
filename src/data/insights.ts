export type Article = {
  slug: string;
  category: string;
  title: string;
  description: string;
  read: string;
  image: string;
  imageAlt: string;
  intro: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

export const articles: Article[] = [
  {
    slug: "ai-readiness",
    category: "AI & Data",
    title: "Before you build with AI, ask these five questions.",
    description: "Start with a useful problem, understand your data, and define what success should mean.",
    read: "6 min read",
    image: "/images/analytics.jpg",
    imageAlt: "Analytics dashboard on a laptop",
    intro: "AI projects rarely fail because the model isn’t clever enough. They fail because the problem was vague, the data wasn’t ready or nobody agreed what “good” looked like. These five questions help you avoid that.",
    sections: [
      { heading: "1. What decision or task are we improving?", paragraphs: ["Name a specific workflow, the people who do it today and what slows them down. “Use AI in customer service” is a theme; “draft first replies to billing emails for agent review” is a project."] },
      { heading: "2. Do we have the data — and the right to use it?", paragraphs: ["Check where the information lives, how complete and current it is, and whether contracts or privacy rules allow it to be used this way."], bullets: ["Where is the source of truth?", "Who owns and maintains it?", "Does it contain personal or regulated data?"] },
      { heading: "3. Would a simpler solution work?", paragraphs: ["Rules, search or a better form sometimes beat a model on cost and reliability. Choose AI when the task genuinely needs language understanding, prediction or judgment at scale."] },
      { heading: "4. How will we measure success?", paragraphs: ["Agree measurable targets before building — time saved per case, accuracy against a reviewed sample, customer satisfaction — and a baseline to compare against."] },
      { heading: "5. Who stays in the loop?", paragraphs: ["Decide where humans review, approve or override outputs, how errors are reported and who owns the system after launch. Good oversight is what turns a pilot into something you can trust."] },
    ],
  },
  {
    slug: "build-or-extend",
    category: "Technology Strategy",
    title: "Build something new, or improve what you have?",
    description: "A practical starting point for your next technology decision.",
    read: "5 min read",
    image: "/images/architecture.jpg",
    imageAlt: "Office towers viewed from below",
    intro: "Every growing business eventually hits the limits of its systems. The instinct is often to replace them — but extending, integrating or buying can be faster and less risky.",
    sections: [
      { heading: "Start with the pain, not the platform", paragraphs: ["List the specific problems: manual re-keying, slow reports, missing features, outages. Some are configuration or integration fixes; others point to a structural limit."] },
      { heading: "Four options to compare", paragraphs: ["Most decisions come down to a mix of these:"], bullets: ["Configure or extend the current system", "Integrate it with specialized tools", "Buy a modern SaaS product", "Build a custom application"] },
      { heading: "Compare total cost, not just build cost", paragraphs: ["Include licences, hosting, support, training, data migration and the cost of change over three to five years. A cheaper build can be a more expensive system to own."] },
      { heading: "De-risk with a small first step", paragraphs: ["A short discovery, prototype or integration pilot answers the hardest questions before you commit the full budget."] },
    ],
  },
  {
    slug: "staffing-models",
    category: "Talent & Teams",
    title: "Contract, contract-to-hire or direct hire?",
    description: "How to choose the right way to bring technology talent into your business.",
    read: "5 min read",
    image: "/images/interview.jpg",
    imageAlt: "Two people shaking hands",
    intro: "The right hiring model depends on how long you need the skill, how certain the role is and how quickly you need someone productive.",
    sections: [
      { heading: "Contract staffing", paragraphs: ["Best for project-based work, peaks in demand or specialist skills you don’t need permanently. You get speed and flexibility; the trade-off is a higher hourly cost and less long-term continuity."] },
      { heading: "Contract-to-hire", paragraphs: ["Useful when the role is likely permanent but you want to see real work first. Agree conversion terms up front and confirm candidates are open to converting."] },
      { heading: "Direct hire", paragraphs: ["Right for core, long-term roles and leadership positions. It takes longer, but builds lasting capability and culture."] },
      { heading: "Dedicated teams", paragraphs: ["When you need several roles working together on a product, a managed team — often blending onshore and offshore talent — can be more efficient than hiring individuals."], bullets: ["Clear ownership through a delivery lead", "Predictable monthly cost", "Easier to scale up or down"] },
    ],
  },
  {
    slug: "cloud-cost",
    category: "Cloud & DevOps",
    title: "Six habits that keep cloud costs under control.",
    description: "Simple practices that stop cloud bills from surprising you.",
    read: "4 min read",
    image: "/images/cloud.jpg",
    imageAlt: "Earth at night from orbit",
    intro: "Cloud spending grows quietly — one forgotten environment at a time. These habits keep costs visible and predictable without slowing teams down.",
    sections: [
      { heading: "Make costs visible", paragraphs: ["Tag every resource by team, product and environment so spend can be traced to an owner."] },
      { heading: "Set budgets and alerts", paragraphs: ["Alerts at 50%, 80% and 100% of budget turn surprise bills into early conversations."] },
      { heading: "Right-size and schedule", paragraphs: ["Review instance sizes monthly and shut down non-production environments outside working hours."] },
      { heading: "Commit where usage is steady", paragraphs: ["Savings plans and reserved capacity reduce costs for predictable workloads."], bullets: ["Review commitments quarterly", "Keep spiky workloads on demand"] },
      { heading: "Clean up continuously", paragraphs: ["Unattached storage, old snapshots and idle load balancers add up. Automate the clean-up."] },
      { heading: "Share the numbers", paragraphs: ["A short monthly cost review with engineering and finance builds shared ownership."] },
    ],
  },
];
