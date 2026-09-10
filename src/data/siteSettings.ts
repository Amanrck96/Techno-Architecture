export interface SiteSettings {
  name: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  foundedYear: number;
  contact: {
    email: string;
    phone: string;
    pressEmail: string;
    careersEmail: string;
  };
  studios: {
    city: string;
    address: string;
    postalCode: string;
    phone: string;
    isHeadquarters: boolean;
  }[];
  socials: {
    platform: string;
    url: string;
    handle: string;
  }[];
  operatingHours: string;
  copyrightNotice: string;
}

export const initialSiteSettings: SiteSettings = {
  name: "TECHNO",
  tagline: "Architecture · Space · Form",
  shortDescription: "An award-winning architecture and spatial design practice crafting contemporary, context-driven residential, commercial, and civic environments.",
  longDescription: "Founded on the principles of formal restraint, tectonic honesty, and deep contextual sensitivity, Techno creates buildings and interiors that celebrate light, proportion, and endurance.",
  foundedYear: 2016,
  contact: {
    email: "studio@technoarchitecture.com",
    phone: "+91 80 2661 4820",
    pressEmail: "press@technoarchitecture.com",
    careersEmail: "careers@technoarchitecture.com",
  },
  studios: [
    {
      city: "Bengaluru (HQ)",
      address: "No. 44, 4th Main Road, Basavanagudi",
      postalCode: "560004",
      phone: "+91 80 2661 4820",
      isHeadquarters: true,
    },
    {
      city: "Hyderabad Studio",
      address: "Road No. 36, Jubilee Hills",
      postalCode: "500033",
      phone: "+91 40 4012 9840",
      isHeadquarters: false,
    },
    {
      city: "Dubai Collaborations",
      address: "Building 04, Dubai Design District (d3)",
      postalCode: "PO Box 33312",
      phone: "+971 4 429 8810",
      isHeadquarters: false,
    }
  ],
  socials: [
    {
      platform: "Instagram",
      url: "https://instagram.com",
      handle: "@techno.architecture",
    },
    {
      platform: "Facebook",
      url: "https://facebook.com",
      handle: "TechnoArchitecture",
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com",
      handle: "techno-architecture",
    },
    {
      platform: "ArchDaily",
      url: "https://archdaily.com",
      handle: "techno-studio",
    }
  ],
  operatingHours: "Monday – Friday: 09:30 – 18:30 IST",
  copyrightNotice: "TECHNO ARCHITECTURE & DESIGN STUDIO. ALL RIGHTS RESERVED.",
};
