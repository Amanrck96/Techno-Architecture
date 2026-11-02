export interface FAQItem {
  id: string;
  sortOrder?: number;
  question: string;
  answer: string;
  category: "Design Philosophy" | "Engagement & Process" | "Sustainability" | "Fees & Timelines" | "Technical & BIM";
}

export const initialFAQs: FAQItem[] = [
  {
    id: "faq-1",
    sortOrder: 1,
    question: "What types of projects does Techno Architecture undertake?",
    answer: "We provide end to end architecture, interior design and structural design services. Our portfolio includes residential, commercial, hospitality and bespoke interior architecture projects. Where additional expertise is required, we can introduce clients to suitable specialist consultants according to the project's scale and technical needs.",
    category: "Design Philosophy",
  },
  {
    id: "faq-2",
    sortOrder: 2,
    question: "When should we appoint an architect?",
    answer: "The best time is before major decisions are made about planning, area, budget or construction. Early involvement allows the design team to study the site, clarify priorities and identify constraints before they become costly to change.",
    category: "Engagement & Process",
  },
  {
    id: "faq-3",
    sortOrder: 3,
    question: "What information should we share for an initial discussion?",
    answer: "Please share your name, email address and contact number. A senior architect will get in touch directly to understand the requirements and discuss taking up the new project.",
    category: "Engagement & Process",
  },
  {
    id: "faq-4",
    sortOrder: 4,
    question: "Can you provide architecture and interiors together?",
    answer: "Yes. An integrated appointment can help the building, interiors, lighting, materials and furniture develop as one coordinated design. The exact scope will be defined in the project proposal.",
    category: "Design Philosophy",
  },
  {
    id: "faq-5",
    sortOrder: 5,
    question: "Do you work on renovations?",
    answer: "Renovation and adaptive reuse projects can be considered after reviewing the existing building, required changes and available documentation. A site assessment may be needed before the scope and feasibility can be confirmed.",
    category: "Engagement & Process",
  },
  {
    id: "faq-6",
    sortOrder: 6,
    question: "How does the design process begin?",
    answer: "The process usually begins with a consultation, brief development and review of the site information. We then define the scope, deliverables, stages and professional fees before design work starts.",
    category: "Engagement & Process",
  },
  {
    id: "faq-7",
    sortOrder: 7,
    question: "How long does a project take?",
    answer: "Timelines vary with project scale, approvals, design decisions, consultant coordination and construction conditions. We provide a stage-based programme after understanding the project requirements.",
    category: "Fees & Timelines",
  },
  {
    id: "faq-8",
    sortOrder: 8,
    question: "How are professional fees calculated?",
    answer: "Fees depend on the project type, size, complexity, location and scope of services. A detailed proposal is issued after the initial project discussion.",
    category: "Fees & Timelines",
  },
  {
    id: "faq-9",
    sortOrder: 9,
    question: "Do you supervise construction?",
    answer: "Construction-stage involvement depends on the agreed appointment. It may include periodic site reviews, drawing clarifications, consultant coordination and review of design intent. This is different from continuous site supervision unless specifically included.",
    category: "Technical & BIM",
  },
  {
    id: "faq-10",
    sortOrder: 10,
    question: "How do you approach sustainable design?",
    answer: "We begin with practical measures such as orientation, daylight, ventilation, shading, efficient planning, durable materials and resource-conscious structural systems. Appropriate strategies are selected for the site, climate, budget and project goals.",
    category: "Sustainability",
  },
  {
    id: "faq-11",
    sortOrder: 11,
    question: "Can you work outside your home city?",
    answer: "Projects in other locations may be undertaken depending on their scope, programme and travel requirements. Please share the site location during the initial enquiry so the appropriate service structure can be discussed.",
    category: "Engagement & Process",
  },
  {
    id: "faq-12",
    sortOrder: 12,
    question: "How can we start a project with Techno Architecture?",
    answer: "Use the project enquiry form or contact the studio directly. A senior architect will get in touch to understand the requirements, confirm availability and discuss the next steps for taking up the project.",
    category: "Engagement & Process",
  },
];
