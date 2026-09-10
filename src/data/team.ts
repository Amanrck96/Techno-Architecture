export interface TeamMember {
  id: string;
  name: string;
  role: string;
  discipline: "Leadership" | "Architecture" | "Interiors" | "BIM & Technical" | "Research & Sustainability";
  bio: string;
  credentials: string;
  image: string;
  socials?: {
    platform: string;
    url: string;
  }[];
}

export const initialTeam: TeamMember[] = [
  {
    id: "team-1",
    name: "Ar. Rajeshwari Menon",
    role: "Founder & Principal Architect",
    discipline: "Leadership",
    credentials: "M.Arch (AA London), B.Arch (SPA Delhi), IIA, COA",
    bio: "With over 18 years shaping contemporary South Asian architecture, Rajeshwari directs the studio's architectural vision. Her research focuses on thermal mass, tropical spatial sequencing, and the poetic intersection of raw concrete and regional stone.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
    socials: [
      { platform: "LinkedIn", url: "https://linkedin.com" },
      { platform: "Instagram", url: "https://instagram.com" },
    ],
  },
  {
    id: "team-2",
    name: "Vikramaditya Shenoy",
    role: "Partner & Director of Commercial & Urban Design",
    discipline: "Leadership",
    credentials: "M.Sc Urbanism (TU Delft), B.Arch (BMSCE Bengaluru)",
    bio: "Vikramaditya leads Techno's large-scale commercial, institutional, and urban planning commissions. He specializes in mass timber engineering, high-performance building envelopes, and transit-oriented civic frameworks.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
    socials: [
      { platform: "LinkedIn", url: "https://linkedin.com" },
    ],
  },
  {
    id: "team-3",
    name: "Divya Raghavan",
    role: "Director of Interior Architecture",
    discipline: "Interiors",
    credentials: "M.Des Spatial Design (Politecnico di Milano), B.Arch (RVCA)",
    bio: "Divya orchestrates Techno's interior architecture practice. Her work celebrates sensory richness, tactile plasterwork, and custom architectural furniture developed in close partnership with master craftsmen across South India.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=85",
    socials: [
      { platform: "Instagram", url: "https://instagram.com" },
    ],
  },
  {
    id: "team-4",
    name: "Karthik Sundaram",
    role: "Senior Associate — Residential Design",
    discipline: "Architecture",
    credentials: "B.Arch (CEPT Ahmedabad)",
    bio: "Karthik oversees luxury residential and hospitality commissions from initial sketch model to handover. His focus lies in cantilever post-tensioning, monolithic board-formed concrete, and water-court microclimates.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    socials: [
      { platform: "LinkedIn", url: "https://linkedin.com" },
    ],
  },
  {
    id: "team-5",
    name: "Pooja Varma",
    role: "Head of Sustainability & Environmental Simulation",
    discipline: "Research & Sustainability",
    credentials: "M.Sc Sustainable Building Performance (NUS Singapore), LEED AP BD+C",
    bio: "Pooja leads computational daylighting, thermal modeling, and embodied carbon audits across all studio projects, driving Techno's pledge toward carbon neutrality across its built portfolio.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=85",
    socials: [
      { platform: "LinkedIn", url: "https://linkedin.com" },
    ],
  },
  {
    id: "team-6",
    name: "Naveen Prasad",
    role: "BIM Lead & Technical Director",
    discipline: "BIM & Technical",
    credentials: "B.E. Civil, Autodesk Certified BIM Professional",
    bio: "Naveen directs Techno's digital twinning, parametric scheduling, and multi-disciplinary clash resolution protocols, ensuring flawless translation from virtual models into constructed reality.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
    socials: [
      { platform: "LinkedIn", url: "https://linkedin.com" },
    ],
  },
  {
    id: "team-7",
    name: "Aditya Joshi",
    role: "Project Architect",
    discipline: "Architecture",
    credentials: "B.Arch (Sir JJ College of Architecture, Mumbai)",
    bio: "Aditya specializes in complex detailing, architectural metalwork, and site administration for ongoing luxury residential commissions.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85",
    socials: [],
  },
  {
    id: "team-8",
    name: "Sanjay Rao",
    role: "Senior Urbanist & Landscape Architect",
    discipline: "Research & Sustainability",
    credentials: "MLA (Harvard GSD), B.Arch (SPA)",
    bio: "Sanjay integrates native ecological habitats, bioswales, and regenerative hydrology into Techno's campus and civic masterplans.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=85",
    socials: [
      { platform: "LinkedIn", url: "https://linkedin.com" },
    ],
  },
];
