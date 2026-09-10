export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "Design Philosophy" | "Engagement & Process" | "Sustainability" | "Fees & Timelines" | "Technical & BIM";
}

export const initialFAQs: FAQItem[] = [
  {
    id: "faq-1",
    question: "What typologies of projects does Techno accept?",
    answer: "Techno takes on bespoke residential villas, contemporary urban residences, commercial headquarters, creative studios, boutique hospitality resorts, cultural pavilions, and masterplans. We purposefully limit the number of active commissions each year so our principals personally lead every project from schematic conception to site handover.",
    category: "Design Philosophy",
  },
  {
    id: "faq-2",
    question: "How does the design process unfold from first engagement?",
    answer: "Our workflow is divided into five rigorous stages: 01 Context & Ecological Discovery (site surveys, solar/wind modeling, program mapping), 02 Conceptual Design & Physical Scale Models, 03 Schematic & BIM Development, 04 Statutory Sanctions & Tender Documentation, and 05 Periodic Site Administration & Quality Audits. Each phase requires client sign-off before proceeding.",
    category: "Engagement & Process",
  },
  {
    id: "faq-3",
    question: "Does Techno undertake turnkey projects (Design + Build)?",
    answer: "For select high-end residential and commercial projects, we provide complete turnkey management through our affiliated execution partner network, ensuring flawless alignment between the architectural intent and the physical execution. Alternatively, we collaborate with client-appointed general contractors while providing rigorous independent architectural supervision.",
    category: "Engagement & Process",
  },
  {
    id: "faq-4",
    question: "How does Techno calculate its architectural and interior design fees?",
    answer: "Our fee structure is transparent and predictable. Depending on project scale and complexity, we work either on a fixed lump-sum milestone schedule or on a percentage-of-construction-cost basis (typically 8% to 12% for comprehensive bespoke architecture and interior detailing). An itemized proposal is issued following our initial site and brief consultation.",
    category: "Fees & Timelines",
  },
  {
    id: "faq-5",
    question: "What is the typical timeframe for designing a custom residence?",
    answer: "The architectural design and documentation phase typically spans 3 to 5 months, allowing thoughtful exploration of massing, daylighting, and material mock-ups. Construction timeframes generally range from 14 to 20 months depending on structural complexity (e.g. board-formed concrete, post-tensioned cantilevers) and site topography.",
    category: "Fees & Timelines",
  },
  {
    id: "faq-6",
    question: "How does Techno approach environmental sustainability?",
    answer: "We treat sustainability as a fundamental physical principle rather than greenwashing. We employ passive solar orientation, heavy thermal mass envelopes, deep courtyards with natural stack ventilation, rainwater harvesting, decentralized bio-wastewater recycling, and low-embodied carbon regional stones. Our projects routinely exceed LEED Platinum and GRIHA 5-Star benchmarks.",
    category: "Sustainability",
  },
  {
    id: "faq-7",
    question: "Can Techno design projects outside Bengaluru and internationally?",
    answer: "Yes. In addition to our Bengaluru headquarters, we maintain an active studio presence in Hyderabad and collaborative partnerships in Dubai. We have realized projects across South India, Maharashtra, Goa, and the United Arab Emirates. Our digital BIM and virtual coordination workflows ensure seamless client and site communication anywhere in the world.",
    category: "Engagement & Process",
  },
  {
    id: "faq-8",
    question: "Do you offer full interior architecture and custom furniture design?",
    answer: "Yes. We believe the boundary between architecture and interiors must be imperceptible. Our interior practice custom-designs everything from built-in millwork and monolithic kitchen islands to bespoke bronze hardware, concealed door systems, and specialized acoustic wall finishes.",
    category: "Design Philosophy",
  },
  {
    id: "faq-9",
    question: "What level of BIM (Building Information Modeling) does Techno utilize?",
    answer: "We work exclusively within full Level-2 BIM (Autodesk Revit / IFC). All architectural geometry, structural engineering frameworks, and MEP services are modeled in 3D before a single shovel enters the ground. This eliminates site clashes, guarantees millimeter accuracy, and yields accurate material quantity schedules.",
    category: "Technical & BIM",
  },
  {
    id: "faq-10",
    question: "What are the first steps to initiate a project consultation?",
    answer: "You can initiate a dialogue by submitting your project brief via our online Contact portal, emailing studio@technoarchitecture.com, or calling our Bengaluru studio. Please include details regarding the site location, approximate plot dimensions, functional requirements, and your expected timeline.",
    category: "Engagement & Process",
  },
];
