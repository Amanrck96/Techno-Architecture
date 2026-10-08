export interface StudioMilestone {
  value: string;
  label: string;
  detail: string;
}

export interface CoreValue {
  num: string;
  title: string;
  desc: string;
  tag: string;
}

export interface Differentiator {
  title: string;
  desc: string;
}

export interface ServicesPageHeader {
  title: string;
  subtitle: string;
  description: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  foundedYear: number;
  contact: {
    email: string;
    phone: string;
    phoneBsnl?: string;
    whatsapp?: string;
    pressEmail: string;
    careersEmail: string;
  };
  studios: {
    city: string;
    address: string;
    postalCode: string;
    phone: string;
    phoneBsnl?: string;
    whatsapp?: string;
    isHeadquarters: boolean;
  }[];
  socials: {
    platform: string;
    url: string;
    handle: string;
  }[];
  operatingHours: string;
  copyrightNotice: string;
  milestones?: StudioMilestone[];
  coreValues?: CoreValue[];
  vision?: string;
  mission?: string;
  differentiators?: Differentiator[];
  servicesHeader?: ServicesPageHeader;
}

export const initialSiteSettings: SiteSettings = {
  name: "Techno Architecture",
  tagline: "Architecture shaped around people, place and purpose",
  shortDescription: "Techno Architecture is an architecture and design practice creating thoughtful, practical and environmentally responsive spaces.",
  longDescription: "Led by architect Rajesh Shivaram, Techno Architecture is a design practice committed to architecture that is distinctive, environmentally responsible and grounded in everyday life. Our work brings together planning, material expression, natural light and careful detailing to create spaces with lasting value.",
  foundedYear: 2006,
  contact: {
    email: "technoarchitecture@gmail.com",
    phone: "+91 80 4210 3764",
    phoneBsnl: "+91 80 2991 4561",
    whatsapp: "+91 91800 14561",
    pressEmail: "technoarchitecture@gmail.com",
    careersEmail: "technoarchitecture@gmail.com",
  },
  studios: [
    {
      city: "Bengaluru Studio",
      address: "No 9, Uttaradhi Mutt Road, Shankarpuram, Basavanagudi",
      postalCode: "Karnataka 560004",
      phone: "+91 80 4210 3764",
      phoneBsnl: "+91 80 2991 4561",
      whatsapp: "+91 91800 14561",
      isHeadquarters: true,
    }
  ],
  socials: [
    {
      platform: "Instagram",
      url: "https://www.instagram.com/technoarchitecture_rajesh/",
      handle: "@technoarchitecture_rajesh",
    },
    {
      platform: "Google Maps",
      url: "https://www.google.com/maps/search/?api=1&query=TechnoArchitecture%2C+No+9%2C+Uttaradhi+Mutt+Road%2C+Shankarpuram%2C+Basavanagudi%2C+Bengaluru%2C+Karnataka+560004",
      handle: "TechnoArchitecture Basavanagudi",
    }
  ],
  operatingHours: "Monday to Friday, 10:00 AM to 6:30 PM; Saturday closed",
  copyrightNotice: "TECHNO ARCHITECTURE. ALL RIGHTS RESERVED.",
  milestones: [
    { value: "2006", label: "Established Studio", detail: "Rooted in Basavanagudi" },
    { value: "20+", label: "Years Experience", detail: "Ar. Rajesh Shivaram" },
    { value: "100+", label: "Projects Designed", detail: "Contextual & Sustainable" },
    { value: "15+", label: "Recognitions", detail: "Awards, Publications & Monograph" },
  ],
  coreValues: [
    {
      num: "01",
      title: "Design Integrity",
      desc: "We protect the central idea of a project from concept through completion.",
      tag: "Commitment",
    },
    {
      num: "02",
      title: "Client Partnership",
      desc: "We listen, explain choices clearly and make decisions collaboratively.",
      tag: "Dialogue",
    },
    {
      num: "03",
      title: "Context and Climate",
      desc: "We respond to orientation, light, ventilation, landscape and local conditions.",
      tag: "Sustainability",
    },
    {
      num: "04",
      title: "Practical Innovation",
      desc: "We explore new possibilities while respecting function, budget and construction realities.",
      tag: "Engineering",
    },
    {
      num: "05",
      title: "Responsible Practice",
      desc: "We favour durable solutions, efficient planning and environmentally conscious choices.",
      tag: "Lifecycle",
    },
    {
      num: "06",
      title: "Craft and Detail",
      desc: "We believe material junctions, proportions and execution determine the quality of the finished space.",
      tag: "Precision",
    },
  ],
  vision: "To create architecture that improves everyday life, responds responsibly to its environment and remains meaningful over time.",
  mission: "To guide every project through a clear and collaborative design process, bringing together creativity, technical rigour, environmental awareness and careful execution. We aim to deliver spaces that reflect each client's needs while contributing positively to their setting.",
  differentiators: [
    {
      title: "End-to-End Coordination",
      desc: "Architecture, interiors, structural design and execution support are coordinated together as one cohesive team. This continuity prevents fragmented compromises and guarantees seamless execution.",
    },
    {
      title: "Bespoke Spatial Character",
      desc: "Our designs combine creativity with comfort, luxury with restraint, and ambition with practical planning. Every building is individual to the client rather than copied from a formula.",
    },
    {
      title: "Climate & Passive Intelligence",
      desc: "Deep overhangs, natural stack ventilation, shaded courtyards, and honest materiality keep buildings thermally comfortable and resource-conscious for generations.",
    },
  ],
  servicesHeader: {
    title: "Services",
    subtitle: "PRACTICE DISCIPLINES & SCOPE",
    description: "We provide integrated design services for new buildings and interior environments. Each appointment is structured around the project's scale, stage and specific requirements.",
  },
};

