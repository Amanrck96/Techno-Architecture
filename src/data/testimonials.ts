export interface Testimonial {
  id: string;
  clientName: string;
  designation: string;
  company?: string;
  projectAssociated: string;
  quote: string;
  year: number;
}

export const initialTestimonials: Testimonial[] = [
  {
    id: "test-1",
    clientName: "Siddharth & Ananya Rao",
    designation: "Homeowners",
    company: "Private Residence",
    projectAssociated: "AIKYA",
    quote: "Living in Aikya has transformed our daily relationship with light and nature. Even during the peak of summer, the serene water courts and double-height living areas create an astonishingly cool, harmonious atmosphere. Techno's obsession with every millimeter of craft is evident everywhere you look.",
    year: 2023,
  },
  {
    id: "test-2",
    clientName: "Suresh & Anitha Gowda",
    designation: "Homeowners",
    company: "Belaku Residence",
    projectAssociated: "BELAKU",
    quote: "Techno created a private urban sanctuary that dances with natural light throughout the day. The interplay of cantilevered concrete, corten steel, and sculptural timber screens makes Belaku an architectural masterwork we are proud to call home.",
    year: 2023,
  },
  {
    id: "test-3",
    clientName: "Kareem Al-Qasimi",
    designation: "Managing Partner",
    company: "Gulf Family Holdings",
    projectAssociated: "DUNE SANCTUARY",
    quote: "Working with Techno across borders between the UAE and Bengaluru was effortless. Their 3D BIM coordination and climatic insight into desert thermal mass created a coastal sanctuary of breathtaking tranquility.",
    year: 2024,
  },
  {
    id: "test-4",
    clientName: "Dr. Arvind Natarajan",
    designation: "Founder",
    company: "Natarajan Medical Group",
    projectAssociated: "SHADOW HOUSE",
    quote: "The play of shadows cast by the terracotta jali is hypnotic. Techno did not merely build us a house; they gave our family an heirloom that breathes with the morning mist and evening breeze.",
    year: 2023,
  },
];
