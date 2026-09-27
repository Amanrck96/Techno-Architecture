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
    name: "Rajesh Shivaram",
    role: "Principal Architect",
    discipline: "Leadership",
    credentials: "B.Arch (Bangalore Institute of Technology)",
    bio: "A graduate of Bangalore Institute of Technology, Rajesh Shivaram is the Principal Architect of Techno Architecture and brings 20 years of professional experience to the practice. He leads the studio with a focus on design excellence, innovation and careful execution, combining creativity with comfort, practicality and environmental responsibility.",
    image: "",
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/technoarchitecture_rajesh/" },
    ],
  },
];
