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
  name: "Techno Architecture",
  tagline: "Architecture shaped around people, place and purpose",
  shortDescription: "Techno Architecture is an architecture and design practice creating thoughtful, practical and environmentally responsive spaces.",
  longDescription: "Led by architect Rajesh Shivaram, Techno Architecture is a design practice committed to architecture that is distinctive, environmentally responsible and grounded in everyday life. Our work brings together planning, material expression, natural light and careful detailing to create spaces with lasting value.",
  foundedYear: 2006,
  contact: {
    email: "technoarchitecture@gmail.com",
    phone: "080 4210 3764",
    pressEmail: "technoarchitecture@gmail.com",
    careersEmail: "technoarchitecture@gmail.com",
  },
  studios: [
    {
      city: "Bengaluru Studio",
      address: "No. 9, Uttaradi Mutt Road, Shankarpuram, Basavanagudi",
      postalCode: "Karnataka 560004",
      phone: "080 4210 3764",
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
      url: "https://www.google.com/maps/search/?api=1&query=TechnoArchitecture%2C+9+Uttaradi+Mutt+Road%2C+Basavanagudi%2C+Bengaluru+560004",
      handle: "TechnoArchitecture Basavanagudi",
    }
  ],
  operatingHours: "Monday to Friday, 10:00 AM to 6:30 PM; Saturday closed",
  copyrightNotice: "TECHNO ARCHITECTURE. ALL RIGHTS RESERVED.",
};
