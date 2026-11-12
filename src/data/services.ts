export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  image: string;
  sortOrder?: number;
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
    sortOrder: 1,
    slug: "architecture",
    title: "Architecture",
    shortDescription: "We develop architecture from the first site study and spatial brief through design, documentation and construction-stage coordination.",
    detailedDescription: "We develop architecture from the first site study and spatial brief through design, documentation and construction-stage coordination. Our process considers planning, climate, movement, structure, material character and long-term use as connected design decisions.",
    image: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Faikya%2Felevation-east.jpg?alt=media&token=elevation-east.jpg",
    process: [
      { step: "01", title: "Site and Brief Analysis", description: "First site study, orientation, spatial brief, and climatic parameters." },
      { step: "02", title: "Concept and Schematic Design", description: "Iterative exploration of spatial volume, movement, daylight, and overall form." },
      { step: "03", title: "Design Development", description: "Refinement of spatial layouts, building envelope, elevations, and material systems." },
      { step: "04", title: "Planning and Consultant Coordination", description: "Integrating structural and services engineering into coordinated planning documentation." },
      { step: "05", title: "Working Drawings and Specifications", description: "Preparation of detailed construction working drawings, joinery details, and specifications." },
      { step: "06", title: "Construction-Stage Design Review", description: "Active on-site reviews, visual checks, and drawing clarifications to protect design clarity." },
    ],
    deliverables: [
      "Site and brief analysis",
      "Concept and schematic design",
      "Design development",
      "Planning and consultant coordination",
      "Working drawings and specifications",
      "Construction-stage design review",
    ],
    relatedProjectSlugs: ["the-mantle", "aikya", "between-two-trees", "kanasu"],
  },
  {
    id: "serv-2",
    sortOrder: 2,
    slug: "structural-design",
    title: "Structural Design",
    shortDescription: "We coordinate the structural system with the architectural concept from early design stages for safe, efficient, and buildable buildings.",
    detailedDescription: "Structural design forms an integral part of our end to end project scope. We coordinate the structural system with the architectural concept from the early design stages, helping the building remain safe, efficient, buildable and aligned with the intended spatial character.",
    image: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-facade-street.jpg?alt=media&token=between-two-trees-facade-street.jpg",
    process: [
      { step: "01", title: "Structural Concept Development", description: "Establishing load paths and structural logic aligned with architectural vision." },
      { step: "02", title: "Structural System Planning", description: "Selecting optimal RCC frames, steel elements, or composite structural schemes." },
      { step: "03", title: "Foundation and Framing Coordination", description: "Soil assessment review, column grid layouts, and foundation engineering." },
      { step: "04", title: "Coordination of Structural Drawings and Calculations", description: "Rigorous calculations ensuring structural integrity, safety, and efficiency." },
      { step: "05", title: "Integration with Architectural and Services Drawings", description: "Clash detection and seamless coordination with plumbing, electrical, and HVAC." },
      { step: "06", title: "Construction-Stage Structural Coordination", description: "Rebar inspections, concrete casting review, and structural alignment verification." },
    ],
    deliverables: [
      "Structural concept development",
      "Structural system planning",
      "Foundation and framing coordination",
      "Coordination of structural drawings and calculations",
      "Integration with architectural and services drawings",
      "Construction-stage structural coordination",
    ],
    relatedProjectSlugs: ["the-mantle", "belaku", "kripa"],
  },
  {
    id: "serv-3",
    sortOrder: 3,
    slug: "interior-design",
    title: "Interior Design",
    shortDescription: "Our interior work extends the architectural idea into spaces that are comfortable, functional and materially refined.",
    detailedDescription: "Our interior work extends the architectural idea into spaces that are comfortable, functional and materially refined. We plan circulation, furniture, lighting, storage and finishes as one coordinated system, with close attention to proportions and daily use.",
    image: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-terrace-bar-screening-ambience.jpg?alt=media&token=salut-terrace-bar-screening-ambience.jpg",
    process: [
      { step: "01", title: "Space Planning", description: "Circulation mapping, functional zoning, and furniture layout optimization." },
      { step: "02", title: "Interior Concept Development", description: "Mood boards, spatial narratives, 3D visualization, and thematic continuity." },
      { step: "03", title: "Material and Finish Selection", description: "Selecting tactile, durable stones, woods, metal accents, and textural fabrics." },
      { step: "04", title: "Custom Furniture and Joinery Design", description: "Bespoke millwork, built-in wardrobes, custom seating, and tailored details." },
      { step: "05", title: "Lighting Coordination", description: "Layered ambient, task, and architectural accent lighting schemes." },
      { step: "06", title: "Detailed Drawings and Site Review", description: "Comprehensive execution shop drawings and precision craftsmanship inspection." },
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
];
