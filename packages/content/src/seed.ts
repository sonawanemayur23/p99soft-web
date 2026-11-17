// filepath: packages/content/src/seed.ts
// Starter content for p99soft.com. Seeds Strapi and powers the BFF fallback.
//
// Rules for anyone editing this copy:
//  - Write for the client. Say what they get, not how we plan to sell.
//    No ICP criteria, market shares, tiers or internal service codes on the site.
//  - Facts only. Every number, certification, quote and office below is taken
//    from the current p99soft.com (Nov 2026). Do not add numbers we cannot prove.
//  - Plain words, no contractions, no long dashes.

export type SeoSeed = { title: string; description: string };

export const site = {
  name: "P99soft",
  url: "https://p99soft.com",
  tagline: "Customer experience, data and AI engineering",
  description:
    "P99soft connects CRM, commerce, data and AI so every customer journey works as one, then keeps it running. Offices in the US, UAE and India.",
  contactEmail: "hello@p99soft.com",
  offices: [
    "Austin, Texas: Suite 314, 9415 Burnet Road, Austin, TX 78758",
    "Dubai, UAE",
    "Hyderabad, India",
    "Pune, India",
    "Bengaluru, India",
    "Loni, India",
  ],
  primaryCta: { label: "Talk to us", href: "/contact" },
  social: [{ label: "LinkedIn", href: "https://www.linkedin.com/company/p99soft" }],
};

// Slugs match the current p99soft.com URLs where a page already exists,
// so existing search rankings carry over without redirects.
export const services = [
  {
    code: "L0",
    slug: "cx-and-ai-strategy",
    name: "CX and AI strategy",
    short: "Find the journeys worth fixing first, and the business case behind them.",
    summary:
      "We map how your customers move across channels and systems, find where the experience breaks, and turn that into a plan your leadership can fund.",
    problem:
      "Most programmes start with a platform decision. The journey, the data and the business case come later, and the programme stalls when they do.",
    outcomes: [
      "A ranked list of journeys to fix, with the cost of leaving each one alone",
      "A target architecture that works with the systems you already own",
      "A data and AI roadmap tied to outcomes you can measure",
    ],
    capabilities: [
      { name: "Journey mapping", detail: "Current and future journeys across every brand, location and channel." },
      { name: "AI readiness review", detail: "Where AI can help now, and what data and controls it needs first." },
      { name: "Target architecture", detail: "A practical design across CRM, commerce, data and AI." },
      { name: "Business case", detail: "Cost, savings and revenue impact your finance team can test." },
    ],
    seo: {
      title: "CX and AI Strategy Consulting | P99soft",
      description:
        "Journey mapping, AI readiness, target architecture and business cases for companies whose customer data lives across many systems.",
    },
  },
  {
    code: "L1",
    slug: "smart-product-engineering",
    name: "Product and experience engineering",
    short: "Web, mobile and cloud products built to launch fast and grow without rework.",
    summary:
      "We design, build and scale digital products, from first idea to long-term evolution. Clean code, modern design and cloud-native foundations from day one.",
    problem:
      "Each channel was built by a different team at a different time. Customers notice the gaps, and every new feature costs more than it should.",
    outcomes: [
      "Working builds from the first sprint, with fast feedback loops",
      "One consistent experience across web, mobile and service channels",
      "Legacy systems replaced in stages, without a risky big-bang launch",
    ],
    capabilities: [
      { name: "Product strategy and architecture", detail: "Roadmaps and architectures that support long-term growth." },
      { name: "Full-cycle development", detail: "Frontend, backend, mobile and cloud engineering with clean code and automation." },
      { name: "UI and UX design", detail: "Interfaces that feel natural and load fast." },
      { name: "Modernisation", detail: "Monolith to microservices, serverless and Kubernetes, done in safe steps." },
    ],
    seo: {
      title: "Product Engineering: Web, Mobile and Cloud | P99soft",
      description:
        "Full-cycle web, mobile and cloud product engineering, UI and UX design, and legacy modernisation from monolith to microservices.",
    },
  },
  {
    code: "L2",
    slug: "customer-relationship-management",
    name: "Salesforce and CRM",
    short: "Set up, fix and extend Salesforce so sales and service teams move faster.",
    summary:
      "We implement, optimise and customise Salesforce so your teams work from one clean customer record, with the integrations and automation to match.",
    problem:
      "The CRM holds part of the customer. Commerce, marketing and service tools hold the rest. Teams spend their day reconciling records instead of serving customers.",
    outcomes: [
      "One customer record your sales and service teams trust",
      "Workflows that match how your teams actually work",
      "A setup that adds teams, products and regions without rework",
    ],
    capabilities: [
      { name: "Salesforce implementation", detail: "Sales Cloud, Service Cloud and Experience Cloud, with clean data and ready dashboards." },
      { name: "Custom development", detail: "Apex, Lightning Web Components, integrations and automation." },
      { name: "Data Cloud and integration", detail: "Salesforce connected to ERPs, marketing tools, analytics and legacy apps." },
      { name: "CRM optimisation", detail: "Faster workflows, less clutter and reporting people use." },
    ],
    seo: {
      title: "Salesforce Consulting and CRM Development | P99soft",
      description:
        "Salesforce implementation, custom development, Data Cloud, integrations and CRM optimisation for sales and service teams.",
    },
  },
  {
    code: "L3",
    slug: "data-ai",
    name: "Data and cloud foundations",
    short: "Turn scattered customer data into one trusted foundation for analytics and AI.",
    summary:
      "We build modern data platforms that connect every customer system, with the governance and cost control to run them safely at scale.",
    problem:
      "AI projects fail on data, not models. When customer identity and history live in five places, no report or AI assistant can be trusted.",
    outcomes: [
      "One view of the customer across systems",
      "Dashboards and decision apps built on data your teams trust",
      "Lineage, governance and cloud costs you can see and control",
    ],
    capabilities: [
      { name: "Data architecture", detail: "Big data architecture and cloud-native pipelines." },
      { name: "Warehousing and integration", detail: "Scalable warehouses that bring every system together." },
      { name: "Analytics and BI", detail: "Dashboards, metrics layers and decision apps." },
      { name: "Governance and security", detail: "Lineage, access control and cost-aware design." },
    ],
    seo: {
      title: "Data Engineering, Analytics and Cloud | P99soft",
      description:
        "Data architecture, warehousing, analytics and governance that give your teams and your AI one trusted view of the customer.",
    },
  },
  {
    code: "L4",
    slug: "generative-and-agentic-ai",
    name: "Generative and agentic AI",
    short: "Assistants and agents that work inside real customer workflows.",
    summary:
      "We build AI assistants and agents grounded in your own data, with evaluation, guardrails and a person in the loop wherever the risk calls for one.",
    problem:
      "Most AI pilots never reach a customer. They stall on data access, unclear ownership and no way to prove the AI is safe.",
    outcomes: [
      "AI working inside live sales, service and support workflows",
      "Clear rules on what AI can do alone and what needs a person",
      "Measured impact on handling time, resolution and conversion",
    ],
    capabilities: [
      { name: "Assistants and chatbots", detail: "Support and service assistants grounded in your policies and products." },
      { name: "Agentic workflows", detail: "Multi-step agents connected to your CRM and data." },
      { name: "Retrieval and evaluation", detail: "Retrieval-augmented generation with evaluation harnesses and observability." },
      { name: "MLOps and LLMOps", detail: "Model registries, routing, caching and risk controls across the lifecycle." },
    ],
    seo: {
      title: "Generative AI and Agentic AI Development | P99soft",
      description:
        "AI assistants and agents grounded in your data, with evaluation, guardrails and MLOps, built into live customer workflows.",
    },
  },
  {
    code: "L5",
    slug: "quality-engineering",
    name: "Quality engineering and AI assurance",
    short: "Test automation, performance and security, plus testing for AI.",
    summary:
      "We strengthen your products with automation, performance testing and quality systems that scale, and we test AI with the same discipline.",
    problem:
      "Traditional testing checks code that behaves the same way every time. AI does not. Without continuous testing, every release is a guess.",
    outcomes: [
      "Fewer bugs reaching customers and faster, safer releases",
      "Quality checks on every build through your CI/CD pipeline",
      "AI behaviour scored on every release, before customers see it",
    ],
    capabilities: [
      { name: "Test automation", detail: "Web, mobile, API and backend automation." },
      { name: "Performance and load", detail: "Find bottlenecks and prepare for real-world traffic." },
      { name: "Security and compliance", detail: "Early vulnerability checks aligned to industry standards." },
      { name: "AI evaluation", detail: "Accuracy, safety and red-team testing for assistants and agents." },
    ],
    seo: {
      title: "Quality Engineering, Test Automation and AI Testing | P99soft",
      description:
        "Test automation, performance, security and AI evaluation that let you release faster with fewer bugs reaching customers.",
    },
  },
  {
    code: "L6",
    slug: "managed-services",
    name: "Managed services",
    short: "We run and improve your platforms, data and AI after launch.",
    summary:
      "We keep Salesforce, data platforms, applications and AI healthy after go-live, and improve them every month against agreed service levels.",
    problem:
      "Launch is where most programmes stop paying attention. Data drifts, AI quality slips and the journey slowly breaks again.",
    outcomes: [
      "Agreed service levels, with 99.9% uptime targets on managed stacks",
      "Monthly improvements tied to the metrics you care about",
      "One accountable team from build to daily operations",
    ],
    capabilities: [
      { name: "Salesforce managed services", detail: "Admin, enhancements and release management." },
      { name: "Data operations", detail: "Pipeline monitoring, data quality and freshness." },
      { name: "AI operations", detail: "Monitoring, evaluation and tuning of AI in production." },
      { name: "Application support", detail: "Monitoring, incident response and continuous improvement." },
    ],
    seo: {
      title: "Managed Services for Salesforce, Data and AI | P99soft",
      description:
        "Managed services that keep Salesforce, data platforms, applications and AI healthy after launch, with agreed service levels.",
    },
  },
] as const;

export const industries = [
  {
    slug: "retail-and-ecommerce",
    name: "Retail and e-commerce",
    tier: "anchor",
    short: "Connect store, site, app and loyalty into one view of the shopper.",
    summary:
      "Retailers run commerce, point of sale, loyalty, marketing and service on separate systems. We connect them so every channel knows the same shopper.",
    pressures: [
      "Shoppers move between store, site and app in a single purchase",
      "Loyalty, commerce and service data rarely agree",
      "Personalisation and AI service pilots stall before they scale",
    ],
    journeys: [
      { name: "Buy online, pick up in store", detail: "Inventory, order and notification flows that stay in sync." },
      { name: "Returns and exchanges", detail: "One returns journey across every channel." },
      { name: "Loyalty and offers", detail: "Offers based on what the shopper did today, not last quarter." },
      { name: "AI-assisted service", detail: "Assistants that answer order and product questions with real data." },
    ],
    seo: {
      title: "Retail and E-commerce Technology Services | P99soft",
      description:
        "Connect commerce, point of sale, loyalty and service so every retail channel knows the same shopper, then add AI that acts on it.",
    },
  },
  {
    slug: "hospitality",
    name: "Hospitality and travel",
    tier: "adjacent",
    short: "Guest journeys across booking, stay, loyalty and service.",
    summary:
      "Hotel and travel groups run booking, property, loyalty and guest service on different systems. We help them recognise every guest everywhere.",
    pressures: [
      "Guest data split by property and by brand",
      "Direct booking competes with third-party channels",
      "Front-desk and service teams lack context about the guest",
    ],
    journeys: [
      { name: "Direct booking", detail: "Faster booking flows that win more direct revenue." },
      { name: "Guest profile", detail: "One guest record across properties and brands." },
      { name: "In-stay service", detail: "Requests, upgrades and issues handled in one flow." },
      { name: "Loyalty", detail: "Recognition and rewards that work across the group." },
    ],
    seo: {
      title: "Hospitality and Travel Technology Services | P99soft",
      description:
        "Unify booking, property, loyalty and service systems so hotel and travel groups recognise every guest at every touchpoint.",
    },
  },
  {
    slug: "consumer-and-subscription",
    name: "Consumer and subscription brands",
    tier: "adjacent",
    short: "Membership and subscription journeys that keep customers longer.",
    summary:
      "Subscription and membership businesses live on retention. We connect billing, CRM and service so you can act before a customer leaves.",
    pressures: [
      "Churn signals hidden across billing, usage and support",
      "Plan changes and cancellations handled by hand",
      "No single view of the member across locations",
    ],
    journeys: [
      { name: "Onboarding", detail: "First 30 days designed around activation." },
      { name: "Retention", detail: "Signals and offers before cancellation, not after." },
      { name: "Plan changes", detail: "Self-service upgrades, pauses and downgrades." },
      { name: "Member service", detail: "AI-assisted support with full account context." },
    ],
    seo: {
      title: "Subscription and Membership Technology Services | P99soft",
      description:
        "Connect billing, CRM and service so subscription and membership brands spot churn early and keep customers longer.",
    },
  },
  {
    slug: "banks-and-insurance",
    name: "Banking and insurance",
    tier: "selective",
    short: "Faster onboarding, servicing and claims, with security built in.",
    summary:
      "Banks and insurers serve customers across branches, apps, agents and call centres. We connect those channels on secure, compliant platforms.",
    pressures: [
      "Onboarding and claims slowed by manual steps",
      "Customer history spread across core systems and CRM",
      "Strict security and compliance on every change",
    ],
    journeys: [
      { name: "Customer onboarding", detail: "Digital onboarding with fewer hand-offs." },
      { name: "Servicing", detail: "Agents and advisers with the full customer view." },
      { name: "Claims", detail: "Clear status and faster decisions for the customer." },
      { name: "AI assistance", detail: "Assistants for agents, tested before they go live." },
    ],
    seo: {
      title: "Banking and Insurance Technology Services | P99soft",
      description:
        "Secure CRM, data and AI engineering for banks and insurers: faster onboarding, servicing and claims across every channel.",
    },
  },
  {
    slug: "transport-logistics",
    name: "Transport and logistics",
    tier: "selective",
    short: "Shipment visibility and customer updates across partners and systems.",
    summary:
      "Logistics customers want to know where their shipment is and what happens next. We connect operations data to the customer experience.",
    pressures: [
      "Shipment data split across carriers, partners and internal systems",
      "Customer updates sent by hand",
      "Documentation and compliance work that slows every shipment",
    ],
    journeys: [
      { name: "Shipment tracking", detail: "Status customers can check without calling." },
      { name: "Exceptions", detail: "Delays flagged early, with the next step clear." },
      { name: "Documentation", detail: "AI-assisted document checks, as in our own product, Freightnaut." },
      { name: "Account service", detail: "Account teams with the full customer history." },
    ],
    seo: {
      title: "Transport and Logistics Technology Services | P99soft",
      description:
        "Connect logistics operations data to the customer experience: shipment visibility, proactive updates and AI-assisted documentation.",
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
    tags: ["Generative AI", "AI testing"],
    body: `Most customer experience AI pilots look good in a demo and never reach a real customer. When we review stalled pilots, the cause is almost never the model.

## Three reasons pilots stall

**The AI cannot see the customer.** The pilot ran on a clean sample. In production the order history lives in commerce, the case history in the service desk and the loyalty status somewhere else. Without one view of the customer, the AI guesses.

**Nobody owns the outcome.** IT owns the platform, a business team owns the journey and a data team owns the pipelines. When the AI gives a wrong answer, it is unclear who fixes it.

**Nobody can prove it is safe.** Traditional testing expects the same output every time. AI does not work that way. Without continuous evaluation, risk teams say no, and they are right to.

## What works instead

1. Pick one journey with a clear owner and a metric, such as order status questions.
2. Connect only the data that journey needs, and resolve the customer's identity first.
3. Write the evaluation set before the prompt. Decide what a good answer looks like.
4. Launch with a person in the loop, then widen what the AI can do alone as the scores hold.

Production is not a bigger pilot. It is a different kind of work: data, ownership and testing first, model second.`,
    seo: {
      title: "Why CX AI Pilots Stall, and How to Reach Production | P99soft",
      description:
        "The model is rarely the problem. Data access, ownership and proof of safety decide whether a customer AI pilot reaches production.",
    },
  },
  {
    slug: "the-fragmented-customer-estate",
    title: "One customer, many systems: how to map the gaps before you fix them",
    excerpt:
      "If your customer lives in three or more systems, start with a map of the journey, not a new platform.",
    publishedAt: "2026-10-28",
    updatedAt: "2026-10-28",
    readMinutes: 6,
    author: "P99soft",
    tags: ["Customer data", "Architecture"],
    body: `Most growing companies describe the same customer in several systems that do not agree. It is the result of years of sensible local decisions, and it is fixable.

## Signs you have the problem

- Your teams export to spreadsheets to answer simple customer questions.
- Marketing, service and commerce report different customer counts.
- Every new journey needs a new integration project.

## Map before you fix

Start with one page per journey, not per system. For each journey, write down:

1. Which systems the customer touches, in order.
2. Which system holds the truth for identity, consent, orders and cases.
3. Where a person copies data by hand.

The manual steps are where cost and errors hide. They are also where AI will fail first, because an AI assistant cannot copy data the way a person can.

## Fix in layers

Resolve identity before you add AI. Connect systems before you replace them. Replace a platform only when the journey map proves the platform is the problem.`,
    seo: {
      title: "One Customer, Many Systems: Map the Gaps First | P99soft",
      description:
        "How growing companies can map where customer data breaks across systems before fixing it with new platforms, data or AI.",
    },
  },
  {
    slug: "assurance-before-agents",
    title: "Test before you trust: quality engineering for AI that talks to customers",
    excerpt:
      "You would not ship a payment flow without tests. An AI assistant that answers customers deserves the same discipline, done differently.",
    publishedAt: "2026-10-14",
    updatedAt: "2026-10-14",
    readMinutes: 4,
    author: "P99soft",
    tags: ["AI testing", "Quality engineering"],
    body: `An AI assistant that answers customers is a production system. It needs the same discipline as a payment flow, with one difference: its output changes from run to run.

## What to test

- **Accuracy:** does the answer match your policy, product and order data?
- **Grounding:** can every claim be traced to a source the assistant was allowed to use?
- **Safety:** does it refuse what it should refuse, and hand over to a person when unsure?
- **Tone:** does it sound like your brand?

## How to test it

Build an evaluation set from real customer questions, with the answer a good assistant would give. Score every release against it. Track the score over time, the same way you track uptime.

After launch, sample real conversations every week, score them and add the failures to the evaluation set.

## Who signs off

Make one person accountable for each assistant's score, the same way someone owns each journey's conversion rate. Trust grows when the numbers are visible and someone owns them.`,
    seo: {
      title: "Test Before You Trust: Quality Engineering for AI | P99soft",
      description:
        "How to test, score and monitor AI assistants that answer your customers, with the same discipline as any production system.",
    },
  },
] as const;

export const home = {
  seo: {
    title: "P99soft | Customer Experience, Data and AI Engineering",
    description:
      "We connect CRM, commerce, data and AI so every customer journey works as one, then keep it running. Salesforce, data, AI and product engineering.",
  },
  hero: {
    headline: "Your customer sees one brand. Your systems see strangers.",
    subhead:
      "We connect your CRM, commerce, data and AI so every customer journey works as one. Then we keep it running.",
    primaryCta: { label: "Talk to us", href: "/contact" },
    secondaryCta: { label: "Explore our services", href: "/#services" },
    systems: ["CRM", "Commerce", "Point of sale", "Loyalty", "Service desk", "Marketing", "Data platform", "Mobile app"],
    proof: [
      { value: "40+", label: "product launches across web and mobile" },
      { value: "Under 8 weeks", label: "from proof of concept to first production release, typically" },
      { value: "99.9%", label: "uptime targets on the stacks we manage" },
    ],
  },
  shift: {
    title: "Customers expect you to know them. Most systems cannot.",
    intro: "Every few years a new layer of software arrives. The next one only works if the layers below it talk to each other.",
    eras: [
      {
        name: "Digitise each team",
        when: "Yesterday",
        body: "Each team bought the best tool for its own job. Sales got a CRM, marketing got automation, stores got point of sale.",
      },
      {
        name: "Connect the journey",
        when: "Today",
        body: "Customers expect every channel to know them. That takes one customer view, shared data and journeys designed end to end.",
      },
      {
        name: "Let AI act",
        when: "Tomorrow",
        body: "AI assistants and agents will act on customer data in real time. They can only be trusted where the data is clean and the testing never stops.",
      },
    ],
  },
  stack: {
    title: "Everything a customer journey needs, from one team.",
    intro: "Strategy, engineering, Salesforce, data, AI, testing and support. Use one service or all seven.",
  },
  playbook: {
    title: "How we deliver",
    intro: "Six steps, in order. Each one makes the next one safer.",
    steps: [
      { name: "Connect", body: "Bring customer data together and agree on one view of the customer." },
      { name: "Build", body: "Rebuild the journeys, CRM and apps your customers touch most." },
      { name: "Add AI", body: "Put AI into live workflows, with a person in the loop where it matters." },
      { name: "Test", body: "Check quality, security and AI behaviour on every release." },
      { name: "Run", body: "Operate data, platforms and AI against agreed service levels." },
      { name: "Scale", body: "Repeat what works across brands, regions and channels." },
    ],
  },
  industries: {
    title: "Built for businesses that meet customers in many places",
    intro: "Our teams know the journeys, systems and rules of the industries we serve.",
    note: "We also build for gaming, enterprise SaaS, e-governance and healthcare clients.",
  },
  starter: {
    title: "Not sure where to start?",
    intro: "Tick what sounds familiar. We will point you to the right first step.",
    items: [
      { id: "journeys", label: "We do not know which customer journey to fix first", serviceSlug: "cx-and-ai-strategy" },
      { id: "channels", label: "Our website, app and stores feel like different companies", serviceSlug: "smart-product-engineering" },
      { id: "crm", label: "Salesforce feels slow, cluttered or half-used", serviceSlug: "customer-relationship-management" },
      { id: "data", label: "Teams export spreadsheets to answer basic customer questions", serviceSlug: "data-ai" },
      { id: "ai", label: "We ran an AI pilot that never reached customers", serviceSlug: "generative-and-agentic-ai" },
      { id: "quality", label: "Releases break things our customers notice", serviceSlug: "quality-engineering" },
      { id: "run", label: "Nobody owns our platforms after launch", serviceSlug: "managed-services" },
    ],
    cta: { label: "Talk to us", href: "/contact" },
  },
  testimonials: {
    title: "What clients say",
    items: [
      {
        quote:
          "P99soft has been an exceptional AI partner for Ironfleet, combining deep expertise with a strong understanding of real technician workflows.",
        name: "Kevin DeCoster",
        role: "Co-Founder, Ironfleet.ai",
      },
      {
        quote:
          "P99soft has been an outstanding partner for FarmDSS, combining strong technical skills with a deep understanding of how farmers learn and work.",
        name: "Dr. B.T. Gore",
        role: "Founder, FarmDSS",
      },
      {
        quote:
          "P99soft played a key role in delivering a scalable solution with strong technical expertise, domain understanding, and a structured delivery approach.",
        name: "Nitin Deore",
        role: "Managing Director and VP of Engineering",
      },
    ],
  },
  trust: {
    title: "Secure by default. Proven in our own products.",
    intro: "Your customer data is safe with us, and we build and run software products of our own.",
    certifications: [
      { name: "ISO 27001:2022", detail: "Information security management" },
      { name: "SOC 2", detail: "AICPA service organisation controls" },
      { name: "HIPAA", detail: "Health data protection" },
      { name: "CMMI Level 3", detail: "Defined, repeatable delivery processes" },
    ],
    products: [
      { name: "Freightnaut", body: "AI that automates export documentation and compliance for exporters.", href: "https://freightnaut.com" },
      { name: "Lyxor", body: "AI code review inside developer workflows, for better code and safer releases.", href: "https://lyxor.ai" },
    ],
  },
  principles: {
    title: "What working with us is like",
    items: [
      { name: "Working software early", body: "Templates and accelerators mean you see working features from the first weeks, not the last." },
      { name: "Measured on your numbers", body: "We tie every build to your metrics: conversion, resolution time, adoption." },
      { name: "Built to grow", body: "Cloud-native foundations, so adding a brand, region or team does not mean starting over." },
      { name: "No untested AI", body: "Nothing AI-powered reaches your customers until it passes evaluation." },
      { name: "One team, start to finish", body: "The people who design it build it, test it and run it." },
      { name: "Honest advice", body: "If we are not the right fit for a project, we say so." },
    ],
  },
  insightsTitle: "Insights",
  finalCta: {
    title: "Tell us which journey to fix first.",
    body: "Share what is not working for your customers. We will tell you honestly whether we can help and where we would start.",
    cta: { label: "Talk to us", href: "/contact" },
  },
};

export const contact = {
  seo: {
    title: "Contact P99soft | Talk to Our Team",
    description:
      "Talk to P99soft about Salesforce, product engineering, data, AI, quality engineering or managed services. Offices in the US, UAE and India.",
  },
  title: "Tell us about the journey that is not working.",
  intro: "A senior member of our team reads every message and replies personally. No sales sequence, no newsletter unless you ask.",
  topics: [
    "CX and AI strategy",
    "Product and experience engineering",
    "Salesforce and CRM",
    "Data and AI",
    "Quality engineering",
    "Managed services",
    "Careers",
    "Something else",
  ],
};

export const servicesIndex = {
  title: "Seven services. One team.",
  intro: "From the first strategy workshop to running your platforms every day. Start with the service you need most.",
  seo: {
    title: "Services: Salesforce, Product, Data, AI and QA | P99soft",
    description:
      "CX and AI strategy, product engineering, Salesforce and CRM, data, generative AI, quality engineering and managed services.",
  },
};

export const industriesIndex = {
  title: "Industries where customers meet you in many places.",
  intro: "We know the journeys, systems and rules of each industry we serve, so your project starts from experience, not from scratch.",
  seo: {
    title: "Industries: Retail, Hospitality, Banking, Logistics | P99soft",
    description:
      "Customer experience, data and AI engineering for retail, hospitality, subscription brands, banking and insurance, and logistics.",
  },
};

export const insightsIndex = {
  title: "Insights",
  intro: "Practical notes on customer data, AI and quality engineering, written by the people who do the work.",
  seo: {
    title: "Insights on CX, Data and AI Engineering | P99soft",
    description:
      "Practical writing on customer experience engineering, customer data, generative AI and AI testing from the P99soft team.",
  },
};

/** Pages built with the page builder. Editors add more in the CMS. */
export const pages = [
  {
    slug: "our-story",
    title: "Our story",
    seo: {
      title: "Our Story | P99soft",
      description:
        "Founded in 2021, P99soft builds web, mobile, data and AI systems for companies worldwide, from offices in the US, UAE and India.",
    },
    blocks: [
      {
        type: "hero",
        heading: "We build software that is simple, scalable and useful.",
        subheading:
          "P99soft started in 2021 with a small team in India. Today we design, build and run customer, data and AI systems for clients worldwide.",
      },
      {
        type: "stats",
        items: [
          { value: "2021", label: "founded" },
          { value: "6", label: "offices in the US, UAE and India" },
          { value: "40+", label: "product launches across web and mobile" },
        ],
      },
      {
        type: "featureGrid",
        heading: "What we stand for",
        intro: "Our mission is to reach our goals with integrity, transparency and respect. Our vision is to lead digital change for our customers and delight them at every step.",
        items: [
          { name: "Customer first", body: "We judge our work by what it does for our clients and their customers." },
          { name: "Empowerment", body: "Our people own their work and make decisions close to the problem." },
          { name: "Integrity", body: "We say what we will do, and we do what we say." },
          { name: "Collaboration", body: "One team across strategy, engineering, testing and support." },
          { name: "Continuous improvement", body: "Every project ends with lessons we carry into the next one." },
        ],
      },
      {
        type: "richText",
        body: "## Leadership\n\nP99soft was founded by **Ashutosh Pulate**. Our leadership team brings together Salesforce veterans, enterprise IT leaders and industry specialists, working alongside certified consultants and engineers.\n\nWe also build and run our own products: **Freightnaut**, for export documentation and compliance, and **Lyxor**, for AI code review.",
      },
      {
        type: "featureGrid",
        heading: "Where we work",
        items: [
          { name: "Austin, Texas", body: "Suite 314, 9415 Burnet Road, Austin, TX 78758, USA" },
          { name: "Dubai", body: "United Arab Emirates" },
          { name: "Hyderabad", body: "India" },
          { name: "Pune", body: "India" },
          { name: "Bengaluru", body: "India" },
          { name: "Loni", body: "India" },
        ],
      },
      {
        type: "ctaBand",
        heading: "Want to build with us?",
        body: "Tell us about your project, or ask about open roles.",
        cta: { label: "Talk to us", href: "/contact" },
      },
    ],
  },
] as const;
