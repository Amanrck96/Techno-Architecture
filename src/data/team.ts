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
    name: "Ar. Rajesh Shivaram",
    role: "Principal Architect & Founder",
    discipline: "Leadership",
    credentials: "B.Arch (Bangalore Institute of Technology)",
    bio: "A graduate of Bangalore Institute of Technology, Rajesh Shivaram is the Principal Architect of Techno Architecture and brings 20 years of professional experience to the practice. He leads the studio with a focus on design excellence, innovation and careful execution, combining creativity with comfort, practicality and environmental responsibility.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/technoarchitecture_rajesh/" },
    ],
  },
  {
    id: "team-2",
    name: "Ar. Vikramaditya Shenoy",
    role: "Senior Project Architect",
    discipline: "Architecture",
    credentials: "M.Arch, B.Arch (SPA)",
    bio: "Specializing in large-scale residential and commercial envelopes with precise structural coordination and passive climate strategies.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
    socials: [],
  },
  {
    id: "team-3",
    name: "Ar. Divya Raghavan",
    role: "Lead Interior Architect",
    discipline: "Interiors",
    credentials: "B.Arch, IIID Member",
    bio: "Directing spatial curation, bespoke joinery, acoustic textures, artisanal lighting schemes, and luxury residential interior fit-outs.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
    socials: [],
  },
  {
    id: "team-4",
    name: "Karthik Sundaram",
    role: "Project Architect & Computational Lead",
    discipline: "Architecture",
    credentials: "B.Arch (BMSCE)",
    bio: "Focusing on parametric solar shading facades, environmental simulation, mass timber detailing, and architectural working drawings.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85",
    socials: [],
  },
  {
    id: "team-5",
    name: "Naveen Prasad",
    role: "BIM & Technical Delivery Lead",
    discipline: "BIM & Technical",
    credentials: "B.E. Civil, BIM Certified",
    bio: "Bridging architectural design with on-site structural precision, MEP coordination, vendor fabrication reviews, and strict quality assurance.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=85",
    socials: [],
  },
  {
    id: "team-6",
    name: "Aditya Joshi",
    role: "Junior Architect & Visualisation Specialist",
    discipline: "Research & Sustainability",
    credentials: "B.Arch",
    bio: "Developing conceptual explorations, physical model making, 3D daylight rendering, and sustainable passive envelope studies.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
    socials: [],
  },
];
