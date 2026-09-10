export interface Recognition {
  id: string;
  year: number;
  title: string;
  category: "Award" | "Publication" | "Certification" | "Biennale / Exhibition";
  organization: string;
  projectAssociated?: string;
  projectSlug?: string;
  description: string;
  badge?: string;
  image?: string;
}

export const initialRecognitions: Recognition[] = [
  {
    id: "rec-1",
    year: 2024,
    title: "National Architectural Excellence Award — Residential",
    category: "Award",
    organization: "Indian Institute of Architects (IIA)",
    projectAssociated: "MONOLITH HOUSE",
    projectSlug: "monolith-house",
    description: "Conferred for outstanding mastery over passive climatic engineering, board-formed concrete craftsmanship, and timeless residential spatial planning.",
    badge: "Gold Medalist",
  },
  {
    id: "rec-2",
    year: 2024,
    title: "AD100 — Most Influential Architectural Studios",
    category: "Publication",
    organization: "Architectural Digest South Asia",
    description: "Selected in the annual AD100 definitive index of leading visionary architecture practices defining the subcontinent's built landscape.",
    badge: "Honoree",
  },
  {
    id: "rec-3",
    year: 2023,
    title: "Dezeen Awards Longlist — Sustainable Building of the Year",
    category: "Award",
    organization: "Dezeen International Awards (London)",
    projectAssociated: "DUNE SANCTUARY",
    projectSlug: "dune-sanctuary",
    description: "Recognized for innovative use of stabilized desert rammed earth and microclimatic passive cooling in arid coastal conditions.",
    badge: "International Longlist",
  },
  {
    id: "rec-4",
    year: 2023,
    title: "GRIHA 5-Star Exemplary Performance in Passive Architecture",
    category: "Certification",
    organization: "Green Rating for Integrated Habitat Assessment (GRIHA)",
    projectAssociated: "TIMBER TERRACE",
    projectSlug: "timber-terrace",
    description: "Awarded for exceptional carbon sequestration, 68% embodied carbon reduction via mass timber, and 100% on-site renewable energy integration.",
    badge: "5-Star Rating",
  },
  {
    id: "rec-5",
    year: 2022,
    title: "Venice Architecture Biennale — Collaborative Pavilion Showcase",
    category: "Biennale / Exhibition",
    organization: "La Biennale di Venezia (18th International Exhibition)",
    description: "Invited installation titled 'Tropical Tectonics & Thermodynamic Voids' examining subterranean courtyards as climate resilience prototypes.",
    badge: "Biennale Exhibitor",
  },
  {
    id: "rec-6",
    year: 2022,
    title: "WAC World Architecture Community Award Winner",
    category: "Award",
    organization: "World Architecture Community (WA Awards 41st Cycle)",
    projectAssociated: "CORTEN PAVILION",
    projectSlug: "corten-pavilion",
    description: "Selected by both the honorary jury and member ratings for bold parametric steel skin design and adaptive reuse of rocky terrain.",
    badge: "WA Winner",
  },
  {
    id: "rec-7",
    year: 2021,
    title: "ArchDaily Building of the Year Nominee",
    category: "Publication",
    organization: "ArchDaily International",
    projectAssociated: "HILLSIDE MEDITATION RETREAT",
    projectSlug: "hillside-monastery",
    description: "Nominated in the Religious & Contemplative Architecture category for respectful non-invasive integration within sensitive coffee plantation ecologies.",
    badge: "Nominee",
  },
  {
    id: "rec-8",
    year: 2020,
    title: "Council of Architecture — Best Conservation & Heritage Practice",
    category: "Award",
    organization: "Council of Architecture (COA)",
    projectAssociated: "ATELIER BASAVANAGUDI",
    projectSlug: "atelier-basavanagudi",
    description: "Commended for authentic preservation of mid-century brickwork alongside sharp, unapologetic contemporary architectural insertions.",
    badge: "Citation Award",
  },
];
