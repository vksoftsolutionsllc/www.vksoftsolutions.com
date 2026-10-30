import { Factory, HeartPulse, Landmark, RadioTower, ShoppingBag, Zap, type LucideIcon } from "lucide-react";

export type Industry = {
  slug: string;
  title: string;
  short: string;
  intro: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  applications: [string, string][];
  considerations: string[];
  roles: string[];
};

export const industries: Industry[] = [
  {
    slug: "financial-services",
    title: "Banking, Financial Services & Insurance",
    short: "Banking, Financial Services & Insurance",
    intro: "Modernize core platforms, improve digital experiences and strengthen risk and compliance — while keeping security and auditability front and center.",
    icon: Landmark,
    image: "/images/finance.jpg",
    imageAlt: "A person using mobile banking next to a laptop",
    applications: [
      ["Digital banking & lending", "Customer portals, onboarding and loan origination flows that reduce drop-off and manual work."],
      ["Claims & policy automation", "Document processing and workflow automation for faster, more consistent claims handling."],
      ["Risk, fraud & regulatory reporting", "Data pipelines and analytics that make reporting reliable and traceable."],
    ],
    considerations: ["Security, encryption and access controls", "Audit trails and model explainability", "Regulatory and data-residency requirements", "Integration with core banking and policy systems"],
    roles: ["Java & .NET developers", "Salesforce Financial Services Cloud", "Data engineers", "QA automation"],
  },
  {
    slug: "healthcare",
    title: "Healthcare, Pharma & Life Sciences",
    short: "Healthcare, Pharma & Life Sciences",
    intro: "Connect clinical, operational and research systems to improve patient and member experiences and speed up the work behind them.",
    icon: HeartPulse,
    image: "/images/healthcare.jpg",
    imageAlt: "A doctor using a smartphone",
    applications: [
      ["Interoperability & integration", "HL7/FHIR integrations between EHRs, labs, payers and partner systems."],
      ["Patient & member engagement", "Portals, scheduling and communication tools that are accessible and secure."],
      ["Clinical & research data", "Data platforms and analytics that support trials, quality reporting and operations."],
    ],
    considerations: ["HIPAA and PHI safeguards", "Validated systems and GxP processes", "Accessibility for all patients", "Clinical workflow impact"],
    roles: ["Integration engineers", "Workday & ERP consultants", "Data analysts", "Validation & QA specialists"],
  },
  {
    slug: "technology",
    title: "Technology, Media & Telecom",
    short: "Technology, Media & Telecom",
    intro: "Ship products faster, scale platforms reliably and turn usage data into better customer experiences.",
    icon: RadioTower,
    image: "/images/circuit.jpg",
    imageAlt: "A close-up of a circuit board",
    applications: [
      ["Product engineering capacity", "Dedicated teams that extend your roadmap capacity across web, mobile and APIs."],
      ["Platform reliability & cloud cost", "SRE practices, observability and FinOps for high-traffic services."],
      ["Customer data & personalization", "Unified customer data and analytics that improve retention."],
    ],
    considerations: ["Release velocity versus stability", "Scalability and multi-region design", "Privacy and consent management", "Developer experience and tooling"],
    roles: ["Full-stack engineers", "SRE / DevOps", "Mobile developers", "Product analysts"],
  },
  {
    slug: "energy",
    title: "Energy, Oil, Gas & Utilities",
    short: "Energy, Oil, Gas & Utilities",
    intro: "Bring field, asset and enterprise data together to improve safety, reliability and efficiency across operations.",
    icon: Zap,
    image: "/images/energy.jpg",
    imageAlt: "Power transmission lines at sunset",
    applications: [
      ["Asset & field operations", "Mobile tools and integrations that keep field crews and back-office systems in sync."],
      ["Predictive maintenance", "Sensor and maintenance data used to anticipate failures and plan work."],
      ["ERP & work management", "SAP and work-management integrations that reduce manual data entry."],
    ],
    considerations: ["Operational technology (OT) security", "Remote and low-connectivity environments", "Safety and regulatory reporting", "Long-lived legacy systems"],
    roles: ["SAP consultants", "Data & IoT engineers", "Infrastructure engineers", "Project managers"],
  },
  {
    slug: "retail",
    title: "Retail & Consumer",
    short: "Retail & Consumer",
    intro: "Create connected shopping experiences and smarter operations across stores, e-commerce and supply chain.",
    icon: ShoppingBag,
    image: "/images/retail.jpg",
    imageAlt: "A customer paying at a retail counter",
    applications: [
      ["Commerce & order management", "Storefronts, checkout and order orchestration across channels."],
      ["Inventory & demand forecasting", "Analytics that help balance stock levels and reduce waste."],
      ["Customer loyalty & insights", "Loyalty platforms and customer analytics that drive repeat business."],
    ],
    considerations: ["Peak-season scalability", "PCI-DSS and payment security", "Store and online data consistency", "Speed of experimentation"],
    roles: ["E-commerce developers", "Salesforce Commerce", "Data analysts", "QA & performance testers"],
  },
  {
    slug: "manufacturing",
    title: "Manufacturing & Semiconductors",
    short: "Manufacturing & Semiconductors",
    intro: "Connect the plant floor with enterprise systems to improve quality, throughput and supply-chain visibility.",
    icon: Factory,
    image: "/images/manufacturing.jpg",
    imageAlt: "An engineer working with lab equipment",
    applications: [
      ["Smart factory & MES integration", "Connect machines, MES and ERP for real-time production visibility."],
      ["Quality & yield analytics", "Analytics that find the root causes of defects and yield loss."],
      ["Supply-chain visibility", "Supplier, inventory and logistics data in one view."],
    ],
    considerations: ["OT/IT convergence and security", "High-volume time-series data", "Validation and traceability", "Specialized engineering skill sets"],
    roles: ["Embedded & firmware engineers", "Data engineers", "SAP / ERP consultants", "Automation testers"],
  },
];
