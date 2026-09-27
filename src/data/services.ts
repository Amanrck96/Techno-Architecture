export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  image: string;
  process: {
    step: string;
    title: string;
    description: string;
  }[];
  deliverables: string[];
  relatedProjectSlugs: string[];
}

export const initialServices: Service[] = [
  {
    id: "serv-1",
    slug: "architecture",
    title: "Architecture",
    shortDescription: "We develop architecture from the first site study and spatial brief through design, documentation and construction-stage coordination.",
    detailedDescription: "We develop architecture from the first site study and spatial brief through design, documentation and construction-stage coordination. Our process considers planning, climate, movement, structure, material character and long-term use as connected design decisions.",
    image: "/projects/aikya/elevation-east.jpg",
    process: [
      { step: "01", title: "Site & Brief Analysis", description: "First site study, orientation, spatial brief, and environmental considerations." },
      { step: "02", title: "Concept & Schematic Design", description: "Iterative exploration of spatial volume, movement, structure, and light." },
      { step: "03", title: "Design Development & Working Drawings", description: "Preparation of detailed working drawings, specifications, and consultant coordination." },
      { step: "04", title: "Construction-Stage Design Review", description: "Active on-site reviews and drawing clarifications to protect design clarity." },
    ],
    deliverables: [
      "Site and brief analysis",
      "Concept and schematic design",
      "Design development",
      "Planning and consultant coordination",
      "Working drawings and specifications",
      "Construction-stage design review",
    ],
    relatedProjectSlugs: ["mantle-buildofy", "aikya", "between-two-trees", "kanasu"],
  },
  {
    id: "serv-2",
    slug: "interior-design",
    title: "Interior Design",
    shortDescription: "Our interior work extends the architectural idea into spaces that are comfortable, functional and materially refined.",
    detailedDescription: "Our interior work extends the architectural idea into spaces that are comfortable, functional and materially refined. We plan circulation, furniture, lighting, storage and finishes as one coordinated system, with close attention to proportions and daily use.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85",
    process: [
      { step: "01", title: "Space Planning", description: "Mapping circulation, furniture arrangements, storage, and daily living patterns." },
      { step: "02", title: "Concept & Material Palette", description: "Developing interior concepts and selecting tactile, durable materials and finishes." },
      { step: "03", title: "Custom Joinery & Lighting", description: "Detailed custom furniture, joinery design, and lighting coordination." },
      { step: "04", title: "Drawings & Site Review", description: "Detailed execution drawings and meticulous on-site craftsmanship reviews." },
    ],
    deliverables: [
      "Space planning",
      "Interior concept development",
      "Material and finish selection",
      "Custom furniture and joinery design",
      "Lighting coordination",
      "Detailed drawings and site review",
    ],
    relatedProjectSlugs: ["salut", "brindavan", "far-site-buildofy"],
  },
  {
    id: "serv-3",
    slug: "structural-design",
    title: "Structural Design",
    shortDescription: "We coordinate the structural system with the architectural concept from early design stages for safe, efficient, and buildable buildings.",
    detailedDescription: "Structural design forms an integral part of our end to end project scope. We coordinate the structural system with the architectural concept from the early design stages, helping the building remain safe, efficient, buildable and aligned with the intended spatial character.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=85",
    process: [
      { step: "01", title: "Structural Concept", description: "Developing the structural concept in harmony with architectural spatial volumes." },
      { step: "02", title: "System & Framing Planning", description: "Planning the structural system, framing schemes, and foundation requirements." },
      { step: "03", title: "Calculations & Drawings", description: "Coordinating structural drawings, engineering calculations, and services integration." },
      { step: "04", title: "Site Structural Coordination", description: "Construction-stage structural coordination and reinforcement inspections." },
    ],
    deliverables: [
      "Structural concept development",
      "Structural system planning",
      "Foundation and framing coordination",
      "Coordination of structural drawings and calculations",
      "Integration with architectural and services drawings",
      "Construction-stage structural coordination",
    ],
    relatedProjectSlugs: ["mantle-buildofy", "belaku", "kripa"],
  },
  {
    id: "serv-4",
    slug: "specialist-consultant-introductions",
    title: "Specialist Consultant Introductions",
    shortDescription: "Introducing clients to appropriate specialist consultants and coordinating design information within our architectural scope.",
    detailedDescription: "Depending on the project's scale and technical requirements, we introduce clients to appropriate specialist consultants. These may include structural, services, sustainability, lighting, acoustic or other professionals required for the project. Each specialist is appointed separately by the client, while our team coordinates relevant design information within our architectural scope. Specialist consultants are appointed directly by the client. Their scope, fees and deliverables are defined separately according to the project's requirements.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    process: [
      { step: "01", title: "Discipline Identification", description: "Identify specialist disciplines required according to project scale and complexity." },
      { step: "02", title: "Consultant Introduction", description: "Introduce suitable, vetted consultants aligned with client brief and scale." },
      { step: "03", title: "Information Sharing", description: "Share architectural documentation and coordinate recommendations with design intent." },
      { step: "04", title: "Stage-Gate Review", description: "Review coordinated inputs and interfaces at agreed project milestones." },
    ],
    deliverables: [
      "Identify the specialist disciplines required for the project",
      "Introduce suitable consultants according to project scale",
      "Share architectural information needed for specialist inputs",
      "Coordinate specialist recommendations with the design intent",
      "Clarify interfaces between architectural and specialist work",
      "Review coordinated information at agreed project stages",
    ],
    relatedProjectSlugs: ["aikya", "kanasu", "mantle-buildofy"],
  },
];
