// filepath: packages/content/src/seed.ts
// Single source of starter content. Used two ways:
//   1. Strapi seed script imports the generated seed.json to populate the CMS.
//   2. The BFF falls back to it when Strapi is unreachable, so the site never goes blank.
// Copy follows the p99soft voice: clear, plain, no hype, no invented numbers.

export type SeoSeed = { title: string; description: string };

export const site = {
  name: "P99soft",
  url: "https://p99soft.com",
  tagline: "AI-enabled customer experience engineering",
  description:
    "P99soft engineers and operates trusted, AI-enabled customer journeys for mid-market enterprises running fragmented customer systems.",
  contactEmail: "hello@p99soft.com",
  regions: [
    { name: "North America", role: "Primary market. Direct and alliance-led." },
    { name: "GCC", role: "UAE and Saudi Arabia. Hospitality, retail and consumer services." },
    { name: "Europe", role: "Reference-led and partner-led." },
    { name: "India", role: "Delivery and engineering centre. Home of our reusable IP." },
  ],
  offices: ["Austin, Texas, USA", "India"],
  primaryCta: { label: "Book a CX diagnostic", href: "/contact?topic=diagnostic" },
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/p99soft" },
  ],
};

export const services = [
  {
    code: "L0",
    slug: "advisory-and-transformation-design",
    name: "Advisory and transformation design",
    short: "Journey strategy, data and AI roadmap, target architecture, business case.",
    summary:
      "We map how your customers move across brands, channels and systems, then design the target architecture and a business case your CFO will sign.",
    problem:
      "Most CX programmes start with a platform choice. The journey, the data and the economics come later, and the programme stalls when they do.",
    outcomes: [
      "A ranked list of journeys to fix, with the cost of leaving each one alone",
      "A target architecture that works with the systems you already own",
      "A data and AI roadmap tied to measurable outcomes, not activity",
    ],
    capabilities: [
      { name: "CX and AI diagnostic", detail: "A fixed-scope review of journeys, systems, data and AI readiness." },
      { name: "Journey strategy", detail: "Current and future journeys across every brand, location and channel." },
      { name: "Target architecture", detail: "Platform-neutral design across CRM, commerce, data and AI layers." },
      { name: "Business case", detail: "Investment, savings and revenue impact your finance team can test." },
    ],
    seo: {
      title: "CX Advisory and Transformation Design | P99soft",
      description:
        "Journey strategy, data and AI roadmaps, target architecture and business cases for enterprises running fragmented customer systems.",
    },
  },
  {
    code: "L1",
    slug: "experience-and-product-engineering",
    name: "Omnichannel experience and product engineering",
    short: "Web, mobile, commerce, orchestration and modernisation.",
    summary:
      "We build the web, mobile and commerce experiences your customers touch, and the orchestration layer that keeps them consistent behind the scenes.",
    problem:
      "Each channel was built by a different team at a different time. Customers notice, and every change costs three times what it should.",
    outcomes: [
      "One experience across web, app, store and service",
      "Shared components and APIs that cut the cost of each new journey",
      "Legacy front ends replaced in stages, without a risky big-bang launch",
    ],
    capabilities: [
      { name: "Web and mobile", detail: "React, Next.js and React Native products built for scale and speed." },
      { name: "Commerce", detail: "Headless and composable commerce front ends." },
      { name: "Journey orchestration", detail: "APIs and backend-for-frontend layers that unify channel logic." },
      { name: "Modernisation", detail: "Staged replacement of legacy portals and apps." },
    ],
    seo: {
      title: "Omnichannel Experience and Product Engineering | P99soft",
      description:
        "Web, mobile, commerce and journey orchestration built as one experience across every channel your customers use.",
    },
  },
  {
    code: "L2",
    slug: "crm-and-customer-platforms",
    name: "CRM, commerce and customer platforms",
    short: "Salesforce and selected platforms for sales, service and marketing.",
    summary:
      "We implement and extend Salesforce and selected customer platforms so sales, service and marketing work from the same customer record.",
    problem:
      "The CRM holds part of the customer. Commerce, loyalty and service tools hold the rest. Teams spend their day reconciling instead of serving.",
    outcomes: [
      "A single customer record your teams trust",
      "Service and marketing journeys that react to what the customer just did",
      "Platform spend matched to real usage",
    ],
    capabilities: [
      { name: "Salesforce", detail: "Sales, Service, Marketing and Commerce Cloud, plus Data Cloud." },
      { name: "Platform integration", detail: "CRM connected to commerce, loyalty, POS and service desks." },
      { name: "Multi-framework UI", detail: "Salesforce experiences extended with React where it fits better." },
      { name: "Platform health", detail: "Org reviews, technical debt cleanup and licence optimisation." },
    ],
    seo: {
      title: "Salesforce and Customer Platform Engineering | P99soft",
      description:
        "Salesforce and customer platform implementation that gives sales, service and marketing one trusted customer record.",
    },
  },
  {
    code: "L3",
    slug: "customer-data-and-cloud",
    name: "Customer data and cloud foundation",
    short: "Identity, data engineering, integration and cloud.",
    summary:
      "We connect customer data from every system into a governed foundation that both your teams and your AI can rely on.",
    problem:
      "AI projects fail on data, not models. When identity and consent live in five places, no agent can act safely.",
    outcomes: [
      "One resolved customer identity across brands and channels",
      "Governed data products ready for analytics and AI",
      "Cloud cost and reliability you can measure",
    ],
    capabilities: [
      { name: "Customer identity", detail: "Identity resolution and consent across systems." },
      { name: "Data engineering", detail: "Pipelines and lakehouse builds on Databricks and Snowflake." },
      { name: "Integration", detail: "Event and API integration between customer systems." },
      { name: "Cloud", detail: "AWS and Azure foundations, security and cost control." },
    ],
    seo: {
      title: "Customer Data and Cloud Foundation | P99soft",
      description:
        "Identity resolution, data engineering, integration and cloud foundations that make customer data ready for AI.",
    },
  },
  {
    code: "L4",
    slug: "assistive-and-agentic-ai",
    name: "Assistive and agentic AI",
    short: "Copilots, retrieval, orchestration and human-in-the-loop design.",
    summary:
      "We put AI into live customer workflows: copilots for your teams, agents for routine journeys, and a human in the loop wherever risk demands it.",
    problem:
      "Most AI pilots never reach production. They stall on data access, unclear ownership and no way to prove the agent is safe.",
    outcomes: [
      "AI working inside real service, sales and commerce workflows",
      "Clear rules on what agents can do alone and what needs a person",
      "Measured impact on handling time, resolution and conversion",
    ],
    capabilities: [
      { name: "Copilots", detail: "Assistants for service agents, sellers and store teams." },
      { name: "Retrieval", detail: "Grounded answers from your policies, products and history." },
      { name: "Agent orchestration", detail: "Multi-step agents connected to your customer systems." },
      { name: "Human in the loop", detail: "Approval, escalation and override designed in from day one." },
    ],
    seo: {
      title: "Assistive and Agentic AI for Customer Journeys | P99soft",
      description:
        "Copilots, grounded retrieval and governed agents built into live service, sales and commerce workflows.",
    },
  },
  {
    code: "L5",
    slug: "ai-assurance-and-trust",
    name: "AI-native assurance and trust",
    short: "Evaluation, security, governance, reliability and readiness.",
    summary:
      "We test, secure and govern AI and customer systems continuously, so you can prove they work before and after they reach customers.",
    problem:
      "Traditional testing checks code that behaves the same way every time. AI does not. Without continuous evaluation, every release is a guess.",
    outcomes: [
      "Evaluation suites that score AI quality on every release",
      "Security and governance controls auditors can follow",
      "Reliability targets with real monitoring behind them",
    ],
    capabilities: [
      { name: "AI evaluation", detail: "Accuracy, safety and bias scoring for models and agents." },
      { name: "Quality engineering", detail: "Automated testing across customer journeys and platforms." },
      { name: "Security and governance", detail: "Controls, red-teaming and policy for AI in production." },
      { name: "Readiness reviews", detail: "Go-live gates for any AI that touches customers." },
    ],
    seo: {
      title: "AI Assurance, Testing and Governance | P99soft",
      description:
        "Continuous AI evaluation, quality engineering, security and governance for AI that touches your customers.",
    },
  },
  {
    code: "L6",
    slug: "managed-experience-operations",
    name: "Managed experience operations",
    short: "DataOps, QualityOps, AgentOps, ExperienceOps and platform operations.",
    summary:
      "We run what we build. Our operations teams keep data, quality, agents and platforms healthy, and improve them every month.",
    problem:
      "Launch is where most programmes stop paying attention. Data drifts, agents degrade and the journey slowly breaks again.",
    outcomes: [
      "Agreed service levels for data, platforms and agents",
      "Monthly improvement backed by journey metrics",
      "One accountable partner from design to operations",
    ],
    capabilities: [
      { name: "DataOps", detail: "Pipeline monitoring, data quality and freshness." },
      { name: "QualityOps", detail: "Regression and journey testing on every change." },
      { name: "AgentOps", detail: "Agent monitoring, evaluation and tuning in production." },
      { name: "ExperienceOps", detail: "Journey analytics and continuous optimisation." },
    ],
    seo: {
      title: "Managed Experience Operations | P99soft",
      description:
        "DataOps, QualityOps, AgentOps and platform operations that keep customer journeys healthy after launch.",
    },
  },
] as const;

export const industries = [
  {
    slug: "retail-and-dtc",
    name: "Retail, DTC and e-commerce",
    tier: "anchor",
    short: "Connect store, site, app and loyalty into one customer view.",
    summary:
      "Retailers run commerce, POS, loyalty, marketing and service on separate systems. We connect them so every channel knows the same customer.",
    pressures: [
      "Customers move between store, site and app in one purchase",
      "Loyalty, commerce and service data rarely agree",
      "AI pilots in personalisation and service stall before scale",
    ],
    journeys: [
      { name: "Buy online, pick up in store", detail: "Inventory, order and notification flows that stay in sync." },
      { name: "Returns and exchanges", detail: "One returns journey across every channel." },
      { name: "Loyalty and personalisation", detail: "Offers based on what the customer did today, not last quarter." },
      { name: "AI-assisted service", detail: "Agents that answer order and product questions with real data." },
    ],
    seo: {
      title: "Retail and DTC Customer Experience Engineering | P99soft",
      description:
        "Connect commerce, POS, loyalty and service so every retail channel knows the same customer, then add AI that acts on it.",
    },
  },
  {
    slug: "hospitality",
    name: "Hospitality",
    tier: "adjacent",
    short: "Guest journeys across booking, stay, loyalty and service.",
    summary:
      "Hotel groups run booking, property, loyalty and guest service on different systems, often per property. We make the guest feel known everywhere.",
    pressures: [
      "Guest data split by property and by brand",
      "Direct booking competes with third-party channels",
      "Service teams lack context at check-in and during the stay",
    ],
    journeys: [
      { name: "Direct booking", detail: "Faster booking flows that win back direct revenue." },
      { name: "Guest profile", detail: "One guest record across properties and brands." },
      { name: "In-stay service", detail: "Requests, upsell and issue handling in one flow." },
      { name: "Loyalty", detail: "Recognition and rewards that work across the group." },
    ],
    seo: {
      title: "Hospitality Guest Experience Engineering | P99soft",
      description:
        "Unify booking, property, loyalty and service systems so hotel groups recognise every guest at every property.",
    },
  },
  {
    slug: "consumer-and-subscription",
    name: "Consumer and subscription",
    tier: "adjacent",
    short: "Membership, subscription and multi-location consumer brands.",
    summary:
      "Subscription and membership businesses live on retention. We connect billing, CRM and service so you can act before a customer leaves.",
    pressures: [
      "Churn signals hidden across billing, usage and support",
      "Plan changes and cancellations handled by hand",
      "Multi-location brands without one view of the member",
    ],
    journeys: [
      { name: "Onboarding", detail: "First 30 days designed around activation." },
      { name: "Save and retention", detail: "Signals and offers before cancellation, not after." },
      { name: "Plan changes", detail: "Self-service upgrades, pauses and downgrades." },
      { name: "Member service", detail: "AI-assisted support with full account context." },
    ],
    seo: {
      title: "Subscription and Membership Experience Engineering | P99soft",
      description:
        "Connect billing, CRM and service so subscription and membership brands can spot churn early and act on it.",
    },
  },
  {
    slug: "automotive",
    name: "Automotive lifecycle",
    tier: "selective",
    short: "Ownership, dealer and after-sales journeys.",
    summary:
      "The car is sold once, but the relationship lasts years. We connect manufacturer, dealer and service data around the owner.",
    pressures: [
      "Owner data split between manufacturer and dealer networks",
      "After-sales revenue lost to independent garages",
      "Connected vehicle data unused in customer journeys",
    ],
    journeys: [
      { name: "Ownership", detail: "One owner record from purchase to resale." },
      { name: "Service booking", detail: "Proactive reminders and simple booking." },
      { name: "Dealer experience", detail: "Shared customer context across the dealer network." },
      { name: "Warranty and recalls", detail: "Clear, fast communication when it matters most." },
    ],
    seo: {
      title: "Automotive Ownership and After-Sales Experience | P99soft",
      description:
        "Connect manufacturer, dealer and service data so automotive brands serve the owner across the whole lifecycle.",
    },
  },
] as const;

export const insights = [
  {
    slug: "why-cx-ai-pilots-stall",
    title: "Why customer experience AI pilots stall, and how to get one into production",
    excerpt:
      "The model is rarely the problem. Data access, ownership and proof of safety decide whether a pilot ever reaches a customer.",
    publishedAt: "2026-11-10",
    updatedAt: "2026-11-10",
    readMinutes: 5,
    author: "P99soft",
    tags: ["Agentic AI", "AI assurance"],
    body: `Most customer experience AI pilots look good in a demo and never reach a real customer. When we review stalled pilots, the cause is almost never the model.

## Three reasons pilots stall

**The agent cannot see the customer.** The pilot ran on a clean sample. In production the order history lives in commerce, the case history in the service desk and the loyalty status somewhere else. Without one resolved identity, the agent guesses.

**Nobody owns the outcome.** IT owns the platform, a business team owns the journey and a data team owns the pipelines. When the agent gives a wrong answer, it is unclear who fixes it.

**Nobody can prove it is safe.** Traditional testing expects the same output every time. AI does not work that way. Without continuous evaluation, risk teams say no, and they are right to.

## What works instead

1. Pick one journey with a clear owner and a metric, such as order status questions.
2. Connect only the data that journey needs, with identity resolved first.
3. Write the evaluation suite before the prompt. Decide what a good answer is.
4. Launch with a human in the loop, then widen what the agent can do alone as the scores hold.

Production is not a bigger pilot. It is a different kind of work: data, ownership and assurance first, model second.`,
    seo: {
      title: "Why CX AI Pilots Stall, and How to Reach Production | P99soft",
      description:
        "The model is rarely the problem. Data access, ownership and proof of safety decide whether a customer AI pilot reaches production.",
    },
  },
  {
    slug: "the-fragmented-customer-estate",
    title: "The fragmented customer estate: a field guide for mid-market enterprises",
    excerpt:
      "If your customer lives in three or more systems, you have a fragmented estate. Here is how to map it before you try to fix it.",
    publishedAt: "2026-10-28",
    updatedAt: "2026-10-28",
    readMinutes: 6,
    author: "P99soft",
    tags: ["Customer data", "Architecture"],
    body: `A fragmented customer estate is any setup where one customer is described by three or more systems that do not agree. In mid-market enterprises with several brands, locations or channels, this is the norm.

## How to recognise it

- Your teams export to spreadsheets to answer simple customer questions.
- Marketing, service and commerce report different customer counts.
- Every new journey needs a new integration project.

## Map before you fix

Start with one page per journey, not per system. For each journey, write down:

1. Which systems the customer touches, in order.
2. Which system holds the truth for identity, consent, orders and cases.
3. Where a person copies data by hand.

The manual steps are where cost and errors hide. They are also where AI will fail first, because an agent cannot copy data the way a person can.

## Fix in layers

Resolve identity before you add AI. Add orchestration before you replace platforms. Replace platforms only when the journey map proves the platform is the problem.

Fragmentation is not a failure. It is the result of years of sensible local decisions. The job now is to connect them on purpose.`,
    seo: {
      title: "The Fragmented Customer Estate: A Field Guide | P99soft",
      description:
        "How mid-market enterprises can recognise and map a fragmented customer estate before fixing it with data and AI.",
    },
  },
  {
    slug: "assurance-before-agents",
    title: "Assurance before agents: testing AI that talks to your customers",
    excerpt:
      "You would not ship a payment flow without tests. An AI agent that answers customers deserves the same discipline, done differently.",
    publishedAt: "2026-10-14",
    updatedAt: "2026-10-14",
    readMinutes: 4,
    author: "P99soft",
    tags: ["AI assurance", "Quality engineering"],
    body: `An AI agent that answers customers is a production system. It needs the same discipline as a payment flow, with one difference: its output changes from run to run.

## What to test

- **Accuracy:** does the answer match your policy, product and order data?
- **Grounding:** can every claim be traced to a source the agent was allowed to use?
- **Safety:** does it refuse what it should refuse, and escalate when unsure?
- **Tone:** does it sound like your brand?

## How to test it

Build an evaluation set from real customer questions, with the answer a good agent would give. Score every release against it. Track the score over time, the same way you track uptime.

Add live monitoring after launch. Sample conversations every week, score them and feed failures back into the evaluation set.

## Who signs off

Make one person accountable for each agent's score, the same way someone owns each journey's conversion rate. Trust grows when the numbers are visible and someone owns them.`,
    seo: {
      title: "Assurance Before Agents: Testing Customer-Facing AI | P99soft",
      description:
        "How to test, score and monitor AI agents that answer your customers, with the same discipline as any production system.",
    },
  },
] as const;

export const home = {
  seo: {
    title: "P99soft | AI-Enabled Customer Experience Engineering",
    description:
      "We engineer and operate trusted, AI-enabled customer journeys for enterprises whose customer data lives across many systems.",
  },
  hero: {
    headline: "Your customer sees one brand. Your systems see strangers.",
    subhead:
      "P99soft engineers and operates trusted, AI-enabled customer journeys across fragmented enterprise systems.",
    primaryCta: { label: "Book a CX diagnostic", href: "/contact?topic=diagnostic" },
    secondaryCta: { label: "See what we build", href: "/#stack" },
    systems: ["CRM", "Commerce", "POS", "Loyalty", "Service desk", "Marketing", "Data lake", "Mobile app"],
  },
  shift: {
    title: "Customer experience has moved on. Most estates have not.",
    intro: "Every era left a layer of systems behind. The next one needs them to work together.",
    eras: [
      {
        name: "Digitise functions",
        when: "Then",
        body: "Each team bought the best tool for its own job. Sales got a CRM, marketing got automation, stores got POS.",
      },
      {
        name: "Connect data and journeys",
        when: "Now",
        body: "Customers expect every channel to know them. That means one identity, shared data and journeys designed end to end.",
      },
      {
        name: "Deploy intelligent action",
        when: "Next",
        body: "Agents will act on customer data in real time. Only estates with trusted data and continuous assurance can let them.",
      },
    ],
  },
  stack: {
    title: "One partner from first diagnostic to daily operations.",
    intro: "Start at the layer where it hurts most. Expand when the results prove it.",
  },
  playbook: {
    title: "How we deliver",
    intro: "Six moves, in order. Each one makes the next one safer.",
    steps: [
      { name: "Unify", body: "Resolve customer identity and build a trusted data foundation." },
      { name: "Engineer", body: "Modernise the journeys, CRM and commerce your customers touch." },
      { name: "Agentify", body: "Put AI into live workflows, with a human in the loop where risk demands." },
      { name: "Assure", body: "Test quality, security and AI behaviour on every release." },
      { name: "Operate", body: "Run data, platforms and agents with agreed service levels." },
      { name: "Expand", body: "Repeat across journeys, brands, locations and markets." },
    ],
  },
  industries: {
    title: "Built for customer-intensive businesses",
    intro: "We go deep in a few industries instead of wide in all of them.",
    note: "We also support healthcare and gaming clients through referrals.",
  },
  fit: {
    title: "Are we the right partner for you?",
    intro: "We work best with a specific kind of company. Tick what is true for you.",
    criteria: [
      { id: "revenue", label: "Annual revenue between $100M and $1.5B", detail: "Large enough to feel the pain, agile enough to move." },
      { id: "brands", label: "Several brands, locations or channels", detail: "One customer meets you in more than one place." },
      { id: "systems", label: "Three or more customer-facing systems", detail: "For example CRM, commerce, POS, loyalty or a service desk." },
      { id: "data", label: "Customer data that does not agree across systems", detail: "Different counts, duplicate records or manual exports." },
      { id: "ai", label: "An AI initiative that stalled or has not started", detail: "A pilot that never reached customers counts." },
      { id: "sponsor", label: "A funded project and an executive sponsor", detail: "Someone who owns the outcome and the budget." },
    ],
    results: {
      strong: "Strong fit. This is the work we do best. Let us start with a diagnostic.",
      partial: "Partial fit. A short diagnostic will show where to start and whether we are the right team.",
      low: "We may not be the right partner yet. Our insights are a good place to start.",
    },
    cta: { label: "Book a CX diagnostic", href: "/contact?topic=diagnostic" },
  },
  principles: {
    title: "How we work",
    items: [
      { name: "Focus over opportunism", body: "We say no to work outside our lane." },
      { name: "Outcome ownership", body: "We measure success by your metrics, not our hours." },
      { name: "Evidence before assertion", body: "We show the data before we make the claim." },
      { name: "Reuse before reinvention", body: "Proven patterns first, custom code where it earns its place." },
      { name: "Trust before unmanaged speed", body: "No AI reaches your customers without assurance." },
      { name: "One-company collaboration", body: "One team across advisory, engineering and operations." },
      { name: "Learning with commercial purpose", body: "We train for the problems our clients actually have." },
    ],
  },
  insightsTitle: "Insights",
  finalCta: {
    title: "Start with one journey.",
    body: "Our CX and AI diagnostic maps your journeys, systems and data, and tells you where AI can work safely first.",
    cta: { label: "Book a CX diagnostic", href: "/contact?topic=diagnostic" },
  },
};

export const contact = {
  seo: {
    title: "Contact P99soft | Book a CX and AI Diagnostic",
    description:
      "Talk to P99soft about customer experience engineering, Salesforce, customer data and AI. Book a CX and AI diagnostic.",
  },
  title: "Tell us about the journey that hurts most.",
  intro: "A practice lead reads every message and replies personally. No sales sequence, no newsletter unless you ask.",
  topics: ["CX and AI diagnostic", "Salesforce and customer platforms", "Customer data and AI", "Managed operations", "Careers", "Something else"],
};

export const servicesIndex = {
  title: "Seven layers. Start with one.",
  intro: "Each layer stands on its own. Together they cover a customer journey from strategy to daily operations.",
  seo: {
    title: "Services: CX, Salesforce, Data and AI Engineering | P99soft",
    description:
      "Advisory, experience engineering, customer platforms, data, agentic AI, AI assurance and managed operations from one partner.",
  },
};

export const industriesIndex = {
  title: "Industries where customers meet you in many places.",
  intro: "We focus on businesses with several brands, locations or channels, where fragmented systems cost the most.",
  seo: {
    title: "Industries: Retail, Hospitality, Subscription, Automotive | P99soft",
    description:
      "Customer experience engineering for retail and DTC, hospitality, consumer subscription and automotive lifecycle businesses.",
  },
};

export const insightsIndex = {
  title: "Insights",
  intro: "Practical notes on customer data, agentic AI and AI assurance. Written by the people who do the work.",
  seo: {
    title: "Insights on CX Engineering, Data and AI | P99soft",
    description:
      "Practical writing on customer experience engineering, customer data, agentic AI and AI assurance from the P99soft team.",
  },
};
