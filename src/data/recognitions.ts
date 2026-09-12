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
    projectAssociated: "AIKYA",
    projectSlug: "aikya",
    description: "Conferred for outstanding mastery over passive climatic engineering, contemporary tropical craftsmanship, and timeless residential spatial planning.",
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
    year: 2024,
    title: "Dezeen Awards Longlist — Sustainable Residential Architecture",
    category: "Award",
    organization: "Dezeen International Awards (London)",
    projectAssociated: "BETWEEN TWO TREES",
    projectSlug: "between-two-trees",
    description: "Recognized for non-invasive preservation of centenary heritage trees and biophilic integration of traditional mandapa water courtyards.",
    badge: "International Longlist",
  },
  {
    id: "rec-4",
    year: 2024,
    title: "IIA National Citation — Biophilic Residential Architecture",
    category: "Award",
    organization: "Indian Institute of Architects (IIA)",
    projectAssociated: "KRIPA",
    projectSlug: "kripa",
    description: "Awarded for pioneering urban biophilic microclimates, porous breeze-block jaali shading, and cascading vertical garden integration.",
    badge: "Citation Award",
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
    year: 2023,
    title: "WAC World Architecture Community Award Winner",
    category: "Award",
    organization: "World Architecture Community (WA Awards 41st Cycle)",
    projectAssociated: "BELAKU",
    projectSlug: "belaku",
    description: "Selected by both the honorary jury and member ratings for cantilevered spatial composition, climatic timber louvers, and warm corten steel articulation.",
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
    projectAssociated: "BRINDAVAN",
    projectSlug: "brindavan",
    description: "Commended for innovative urban biophilic architecture, tactile brick craftsmanship, and vertical greenery integration.",
    badge: "Citation Award",
  },
];
