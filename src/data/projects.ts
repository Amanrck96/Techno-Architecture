export interface ProjectImage {
  url: string;
  caption: string;
  aspect?: "landscape" | "portrait" | "full";
}

export interface VideoTour {
  title: string;
  url: string;
  platform?: "YouTube" | "Buildofy" | "Instagram" | "Vimeo";
  actionText?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: "Residential" | "Commercial" | "Interior" | "Hospitality";
  status: "completed" | "ongoing";
  sortOrder?: number;
  location: string;
  year: number;
  client: string;
  area: string;
  description: string;
  processNarrative: string;
  mainImage: string;
  gallery: ProjectImage[];
  servicesInvolved: string[];
  teamMembers: string[];
  credits: {
    principalArchitect: string;
    projectArchitect?: string;
    projectLead?: string;
    team?: string;
    structuralEngineer?: string;
    landscapeArchitect?: string;
    lightingConsultant?: string;
    generalContractor?: string;
    photography?: string;
    mepConsultant?: string;
    landscapeUrbanist?: string;
    facadeConsultant?: string;
    sustainabilityConsultant?: string;
    [key: string]: string | undefined;
  };
  featured: boolean;
  relatedSlugs: string[];
  videoTour?: VideoTour;
  testimonial?: {
    quote: string;
    clientName: string;
    designation?: string;
    company?: string;
  };
}

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    slug: "aikya",
    title: "AIKYA",
    category: "Residential",
    status: "completed",
    location: "Bengaluru, India",
    year: 2023,
    client: "Private Client",
    area: "6,200 sq.ft",
    description: "A contemporary tropical sanctuary defined by interlocking geometric volumes, warm timber louvers, and a serene internal courtyard woven with water bodies and lush foliage.",
    processNarrative: "Aikya — embodying unity, harmony, and connection — dissolves the boundary between architecture and nature. Designed around climate-responsive passive physics, the residence features cantilevered deep overhangs, a double-height living pavilion with mezzanine study, an internal courtyard with reflecting koi pond, and tactile timber screening that filters Bengaluru's tropical light into poetic shadow play.",
    mainImage: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Faikya%2Felevation-east.jpg?alt=media&token=elevation-east.jpg",
    gallery: [
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Faikya%2Felevation-east.jpg?alt=media&token=elevation-east.jpg", caption: "Frontal elevation showcasing timber louvers, cantilevered portals, and reflective pool", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Faikya%2Felevation-evening.jpg?alt=media&token=elevation-evening.jpg", caption: "Twilight elevation highlighting warm ambient illumination and volumetric articulation", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Faikya%2Fdouble-height-and-study-area.jpg?alt=media&token=double-height-and-study-area.jpg", caption: "Double-height living space with timber ceiling soffit, bespoke bookshelf, and upper study mezzanine", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Faikya%2Fcourtyard-view.jpg?alt=media&token=courtyard-view.jpg", caption: "Central skylit court featuring an indigenous tree planter, reflection pool, and steel staircase", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Faikya%2Fview-from-courtyard.jpg?alt=media&token=view-from-courtyard.jpg", caption: "Upper cantilevered balcony overlooking the tranquil water court and green landscape", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Faikya%2Fliving-and-study-area.jpg?alt=media&token=living-and-study-area.jpg", caption: "Mezzanine perspective looking across the illuminated double-height spatial volume", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Faikya%2Fliving-room.jpg?alt=media&token=living-room.jpg", caption: "Ground-floor living pavilion opening seamlessly to garden greenery and outdoor light", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Faikya%2Foutdoor-landscape-view-evening.jpg?alt=media&token=outdoor-landscape-view-evening.jpg", caption: "Evening garden view capturing the harmonious integration of built form and nature", aspect: "full" },
    ],
    servicesInvolved: ["Architectural Design", "Interior Architecture", "Landscape Integration"],
    teamMembers: ["Ar. Rajesh Shivaram", "Karthik Sundaram", "Divya Raghavan"],
    credits: {
      principalArchitect: "Ar. Rajesh Shivaram",
      projectArchitect: "Vikramaditya Shenoy",
      projectLead: "Vikramaditya Shenoy",
      team: "Techno Architecture Studio Team",
      landscapeArchitect: "Verdant Studio",
      photography: "Shamanth Patil Photography",
      lightingConsultant: "Lumen Praxis",
      generalContractor: "Apex Buildtech Projects",
    },
    featured: true,
    relatedSlugs: ["far-site-buildofy", "kanasu", "between-two-trees"],
    videoTour: {
      title: "4,800 sq.ft Aikya House in Bengaluru by Technoarchitecture (Home Tour)",
      url: "https://www.youtube.com/results?search_query=Aikya+House+Technoarchitecture+Home+Tour",
      platform: "YouTube",
      actionText: "Watch House Tour",
    },
    testimonial: {
      quote: "Living in Aikya has transformed our daily relationship with light and nature. Even during the peak of summer, the serene water courts and double-height living areas create an astonishingly cool, harmonious atmosphere. Techno's obsession with every millimeter of craft is evident everywhere you look.",
      clientName: "Siddharth & Ananya Rao",
      designation: "Homeowners",
      company: "Private Residence",
    },
  },
  {
    id: "proj-2",
    slug: "belaku",
    title: "BELAKU",
    category: "Residential",
    status: "completed",
    location: "Bengaluru, India",
    year: 2023,
    client: "Private Residence",
    area: "6,200 sq.ft",
    description: "A striking multi-tier private residence defined by bold cantilevered volumes, weathered corten steel cladding, rhythmic timber screening, and cascading tropical planters.",
    processNarrative: "Named 'Belaku'—the Kannada word for light—the residence is sculpted around the choreography of daylight and natural ventilation. An expressive spiral staircase anchors the arrival portal beneath parametric vertical louvers, while weathered corten panels and rich timber slats create a dialogue between industrial permanence and biophilic warmth.",
    mainImage: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-central-courtyard-entrance-vista.jpg?alt=media&token=belaku-central-courtyard-entrance-vista.jpg",
    gallery: [
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-elevation-front.jpg?alt=media&token=belaku-elevation-front.jpg", caption: "Direct frontal facade highlighting stacked cubic geometries, louvers, and cascading greenery", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-elevation-perspective.jpg?alt=media&token=belaku-elevation-perspective.jpg", caption: "Cantilevered upper pavilion and arrival gateway with the inscribed Belaku identity", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-spiral-staircase-foyer.jpg?alt=media&token=belaku-spiral-staircase-foyer.jpg", caption: "Sculptural spiral staircase arrival foyer accented by parametric timber batten canopy", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-corten-balcony-detail.jpg?alt=media&token=belaku-corten-balcony-detail.jpg", caption: "Weathered corten steel paneling and warm timber screen balcony overlooking green foliage", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-living-louvered-light.jpg?alt=media&token=belaku-living-louvered-light.jpg", caption: "Sun-drenched living salon with timber louvered shading casting kinetic light patterns", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-internal-water-courtyard.jpg?alt=media&token=belaku-internal-water-courtyard.jpg", caption: "Internal water courtyard with overflowing reflecting pool, indoor tree, and seamless connection to living areas", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-double-height-library-kitchen.jpg?alt=media&token=belaku-double-height-library-kitchen.jpg", caption: "Double-height central volume with bespoke full-height teak bookcase, sculptural pendant luminaires, and kitchen island", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-atrium-indoor-garden.jpg?alt=media&token=belaku-atrium-indoor-garden.jpg", caption: "Top-down view of the skylit central court with indigenous vegetation ascending through the vertical spine", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-upper-bridge-pendants.jpg?alt=media&token=belaku-upper-bridge-pendants.jpg", caption: "Upper floor glass-and-timber walkway bridge overlooking the central atrium with wood louvered shutters", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-timber-batten-lounge.jpg?alt=media&token=belaku-timber-batten-lounge.jpg", caption: "Upper level reading lounge featuring full-height acoustic timber battens, custom sofa, and panoramic tree canopy views", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-master-bedroom-suite.jpg?alt=media&token=belaku-master-bedroom-suite.jpg", caption: "Master bedroom suite with floating walnut bed platform, ceiling wood soffit, and private balcony garden terrace", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-bedroom-vignette-detail.jpg?alt=media&token=belaku-bedroom-vignette-detail.jpg", caption: "Artisanal tea service, hand-turned brass planter with monstera, and circular mirror detail in master suite", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-upper-corridor-library.jpg?alt=media&token=belaku-upper-corridor-library.jpg", caption: "Upper floor library gallery with teak hardwood floors, exposed concrete ceiling, curated pop-art wall, and reading nook", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-upper-hallway-living-view.jpg?alt=media&token=belaku-upper-hallway-living-view.jpg", caption: "Upper gallery corridor overlooking the lower formal salon beneath the cluster of timber cone pendants", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-atrium-library-vista.jpg?alt=media&token=belaku-atrium-library-vista.jpg", caption: "Central atrium vista looking across the reflective indoor water court toward the full-height teak bookcase", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-open-kitchen-island-dining.jpg?alt=media&token=belaku-open-kitchen-island-dining.jpg", caption: "Gourmet open kitchen featuring a monolithic island, integrated cooktop, and cantilevered solid timber dining counter", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-dining-counter-courtyard-vista.jpg?alt=media&token=belaku-dining-counter-courtyard-vista.jpg", caption: "Cantilevered solid timber dining bar looking out to the central internal court and spiral staircase", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-courtyard-pool-kitchen-perspective.jpg?alt=media&token=belaku-courtyard-pool-kitchen-perspective.jpg", caption: "Panoramic ground-level view connecting the cascading waterfall basin to the culinary pavilion and indoor tree", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-central-courtyard-entrance-vista.jpg?alt=media&token=belaku-central-courtyard-entrance-vista.jpg", caption: "Central courtyard reflecting pool looking toward the grand solid teak entrance door, central tree, and open kitchen", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-waterfall-guitar-niche-atrium.jpg?alt=media&token=belaku-waterfall-guitar-niche-atrium.jpg", caption: "Double-height atrium featuring a built-in acoustic guitar display niche and Kadappa stone waterfall cascade", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-central-water-court-staircase.jpg?alt=media&token=belaku-central-water-court-staircase.jpg", caption: "Central water garden with fountain grasses, rising living tree, and floating spiral stair in the background", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-elevation-dusk-frontal.jpg?alt=media&token=belaku-elevation-dusk-frontal.jpg", caption: "Full frontal elevation at dusk with warm interior illumination glowing against the purple twilight sky", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-elevation-dusk-perspective.jpg?alt=media&token=belaku-elevation-dusk-perspective.jpg", caption: "Twilight street perspective highlighting dramatic cantilevered volumes, illuminated tree shadows, and glowing Belaku signage", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-living-salon-evening-courtyard.jpg?alt=media&token=belaku-living-salon-evening-courtyard.jpg", caption: "Evening courtyard perspective looking into the formal living salon with soft ambient lighting", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbelaku%2Fbelaku-waterfall-guitar-niche-detail.jpg?alt=media&token=belaku-waterfall-guitar-niche-detail.jpg", caption: "Close-up architectural detail of the Kadappa stone waterfall cascade with ambient spotlighting and display niche", aspect: "portrait" },
    ],
    servicesInvolved: ["Luxury Residential Architecture", "Parametric Facade Engineering", "Interior & Landscape Design"],
    teamMembers: ["Ar. Rajesh Shivaram", "Vikramaditya Shenoy", "Naveen Prasad"],
    credits: {
      principalArchitect: "Ar. Rajesh Shivaram",
      projectArchitect: "Vikramaditya Shenoy",
      projectLead: "Vikramaditya Shenoy",
      team: "Techno Architecture Studio Team",
      photography: "Shamanth Patil Photography",
      lightingConsultant: "Studio Illumine",
    },
    featured: true,
    relatedSlugs: ["aikya", "far-site-buildofy", "kanasu"],
    videoTour: {
      title: "2400 sq.ft Compact Home in Bengaluru | Belaku Residence by Techno Architecture (Home Tour)",
      url: "https://www.youtube.com/results?search_query=Belaku+Residence+Techno+Architecture+Home+Tour",
      platform: "YouTube",
      actionText: "Watch House Tour",
    },
    testimonial: {
      quote: "Techno created a private urban sanctuary that dances with natural light throughout the day. The interplay of cantilevered concrete, corten steel, and sculptural timber screens makes Belaku an architectural masterwork we are proud to call home.",
      clientName: "Suresh & Anitha Gowda",
      designation: "Homeowners",
      company: "Belaku Residence",
    },
  },
  {
    id: "proj-3",
    slug: "between-two-trees",
    title: "BETWEEN TWO TREES",
    category: "Residential",
    status: "completed",
    location: "Bengaluru, India",
    year: 2024,
    client: "Private Family Residence",
    area: "7,500 sq.ft",
    description: "Conceived in intimate communion with two majestic centenary trees, the residence weaves contemporary brick jali facades and cantilevered timber volumes with a traditional four-pillared inner mandapa courtyard.",
    processNarrative: "Preserving the site's two towering trees served as the guiding axis of the architectural layout. The house bends and cantilevers around their lush trunks, creating an earthen brick screen facade that dapples southern sunlight. Inside, a soaring double-height atrium shelters an authentic granite water court framed by hand-carved Chettinad timber pillars, connecting seamless ochre stone living zones to a contemporary gourmet kitchen.",
    mainImage: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-mandapa-court-nandi-pool.jpg?alt=media&token=between-two-trees-mandapa-court-nandi-pool.jpg",
    gallery: [
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-facade-street.jpg?alt=media&token=between-two-trees-facade-street.jpg", caption: "Multi-tiered brick screen and timber facade organically nestled between two majestic heritage trees", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-living-mandapa-court.jpg?alt=media&token=between-two-trees-living-mandapa-court.jpg", caption: "Formal living salon with fluted timber ceiling overlooking the traditional four-pillared mandapa water courtyard", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-dining-traditional-pillars.jpg?alt=media&token=between-two-trees-dining-traditional-pillars.jpg", caption: "Dining pavilion under double-height volume with artisanal cane sideboard and view of the stone nandi water feature", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-atrium-dining-view.jpg?alt=media&token=between-two-trees-atrium-dining-view.jpg", caption: "Two-story skylit central atrium linking upper walkway to the carved timber pillars and dining table below", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-modern-kitchen-ochre.jpg?alt=media&token=between-two-trees-modern-kitchen-ochre.jpg", caption: "Contemporary modular chef's kitchen finished with warm ochre flooring and walnut millwork cabinetry", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-living-lounge-pillars-view.jpg?alt=media&token=between-two-trees-living-lounge-pillars-view.jpg", caption: "Wide perspective of the formal lounge with acoustic fluted ceiling, looking across ochre stone floors to the mandapa court", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-mandapa-court-nandi-pool.jpg?alt=media&token=between-two-trees-mandapa-court-nandi-pool.jpg", caption: "Entrance lobby vista framing the four Chettinad carved timber columns, stone nandi reflection pool, and courtyard garden", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-formal-drawing-room.jpg?alt=media&token=between-two-trees-formal-drawing-room.jpg", caption: "Formal drawing salon featuring mid-century seating, live-edge tree trunk coffee table, and vintage wooden wall art shutters", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-cane-stools-vignette.jpg?alt=media&token=between-two-trees-cane-stools-vignette.jpg", caption: "Artisanal woven rattan stools, teak magazine stand, and tactile rust-toned pillar detail", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-facade-canopy-detail.jpg?alt=media&token=between-two-trees-facade-canopy-detail.jpg", caption: "Close-up of horizontal timber soffit and brick jali screen under the canopy of centenary trees", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-nandi-sculpture-detail.jpg?alt=media&token=between-two-trees-nandi-sculpture-detail.jpg", caption: "Hand-carved black stone Nandi sculpture resting on tiered terracotta pedestal between Chettinad timber pillars", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-console-credenza-relief-wall.jpg?alt=media&token=between-two-trees-console-credenza-relief-wall.jpg", caption: "Solid teak credenza and carved mirror against geometric relief-tile feature wall with bronze gazelle accent", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-puja-pavilion-sanctum.jpg?alt=media&token=between-two-trees-puja-pavilion-sanctum.jpg", caption: "Timber-slatted puja pavilion with suspended brass temple bell overlooking the warm ochre living salon", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-courtyard-verandah-seating.jpg?alt=media&token=between-two-trees-courtyard-verandah-seating.jpg", caption: "Courtyard verandah with woven rattan stools, jute rug, and floor-to-ceiling glass door opening to the brick-walled garden", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-elevation-dusk-trees.jpg?alt=media&token=between-two-trees-elevation-dusk-trees.jpg", caption: "Dramatic dusk elevation showing the residence nestled between two centenary trees with illuminated timber volumes and embossed signage", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-upper-landing-skylight.jpg?alt=media&token=between-two-trees-upper-landing-skylight.jpg", caption: "Upper landing overlooking the central glass atrium with timber-framed pyramidal skylight and suspended cluster pendants", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-cane-armchair-daybed.jpg?alt=media&token=between-two-trees-cane-armchair-daybed.jpg", caption: "Intimate reading salon featuring curved cane armchair, artisanal daybed, and colorful kilim runner over ochre floors", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-cantilever-balcony-tree-canopy.jpg?alt=media&token=between-two-trees-cantilever-balcony-tree-canopy.jpg", caption: "Cantilevered upper balcony with glass balustrade and illuminated timber soffit framed within the canopy of the heritage tree", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-reading-corner-woven-plates.jpg?alt=media&token=between-two-trees-reading-corner-woven-plates.jpg", caption: "Artisanal reading nook with cane tub chair, vintage telephone side table, teak magazine stand, and woven grass wall discs", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-master-bedroom-four-poster.jpg?alt=media&token=between-two-trees-master-bedroom-four-poster.jpg", caption: "Master bedroom suite featuring bespoke dark teak four-poster bed, sculpted botanical floor lamp, and cane armchair under ambient cove lighting", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-master-suite-courtyard-access.jpg?alt=media&token=between-two-trees-master-suite-courtyard-access.jpg", caption: "Expansive master suite with four-poster bed opening directly through sliding glass doors to a private landscaped courtyard terrace", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-master-bathroom-ochre-glass.jpg?alt=media&token=between-two-trees-master-bathroom-ochre-glass.jpg", caption: "Master ensuite bathroom featuring glass shower enclosure, vibrant ochre stone flooring, concrete vanity counter, and lush biophilic greenery", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-bedroom-terracotta-dado-wall.jpg?alt=media&token=between-two-trees-bedroom-terracotta-dado-wall.jpg", caption: "Spacious bedroom suite showcasing fluted terracotta acoustic wainscoting, limewash walls, upholstered bed in cobalt blue, and mid-century furnishings", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-bedroom-suite-study-desk.jpg?alt=media&token=between-two-trees-bedroom-suite-study-desk.jpg", caption: "Guest bedroom suite featuring solid hardwood flooring, fluted brick acoustic wall, upholstered bed, and bespoke cantilevered study desk", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-powder-room-skylit-pebble-court.jpg?alt=media&token=between-two-trees-powder-room-skylit-pebble-court.jpg", caption: "Skylit ensuite powder room with river pebble flooring, natural stepping stones, stone vanity, and fluted terracotta feature wall with tropical ferns", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-bedroom-suite-balcony-view.jpg?alt=media&token=between-two-trees-bedroom-suite-balcony-view.jpg", caption: "Panoramic bedroom suite overlooking the lush tree canopy, integrating sleeping quarters, study zone, and private terrace", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-open-air-ensuite-courtyard-bath.jpg?alt=media&token=between-two-trees-open-air-ensuite-courtyard-bath.jpg", caption: "Open-air ensuite bathroom sanctuary with walnut cabinetry, floating basin, river pebble perimeter, and skylit tropical planter", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-bedroom-sitting-lounge.jpg?alt=media&token=between-two-trees-bedroom-sitting-lounge.jpg", caption: "Intimate bedroom sitting lounge featuring tailored grey sofa, artisanal embroidered cushions, and potted fiddle-leaf fig", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-bedroom-study-nook.jpg?alt=media&token=between-two-trees-bedroom-study-nook.jpg", caption: "Cantilevered walnut study desk with ergonomic armchair, curated architectural monographs, and monochrome artwork", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbetween-two-trees%2Fbetween-two-trees-bedroom-media-lounge.jpg?alt=media&token=between-two-trees-bedroom-media-lounge.jpg", caption: "Cozy bedroom entertainment nook with wall-mounted media display, woven rattan poufs, and fluted terracotta acoustic wall", aspect: "portrait" },
    ],
    servicesInvolved: ["Heritage Residential Architecture", "Biophilic Tree Preservation", "Interior & Landscape Design"],
    teamMembers: ["Ar. Rajesh Shivaram", "Vikramaditya Shenoy", "Karthik Sundaram"],
    credits: {
      principalArchitect: "Ar. Rajesh Shivaram",
      projectArchitect: "Vikramaditya Shenoy",
      projectLead: "Vikramaditya Shenoy",
      team: "Techno Architecture Studio Team",
      landscapeArchitect: "Verdant Studio",
      photography: "Anand Jaju",
    },
    featured: true,
    relatedSlugs: ["aikya", "belaku", "far-site-buildofy"],
    videoTour: {
      title: "House With a Traditional Chettinad Courtyard Between 2 Trees | Bengaluru | Technoarchitecture",
      url: "https://www.youtube.com/results?search_query=Between+Two+Trees+House+With+a+Traditional+Chettinad+Courtyard+Technoarchitecture",
      platform: "YouTube",
      actionText: "Watch Video Tour",
    },
    testimonial: {
      quote: "Techno designed a home that feels like a sacred sanctuary cradled by our centenary trees. The four-pillared inner mandapa courtyard and brick jali light create a living experience of timeless elegance.",
      clientName: "Dr. Sandeep & Deepa Rao",
      designation: "Homeowners",
      company: "Between Two Trees Residence",
    },
  },
  {
    id: "proj-4",
    slug: "brindavan",
    title: "BRINDAVAN",
    category: "Residential",
    status: "completed",
    location: "Bengaluru, India",
    year: 2024,
    client: "Private Client",
    area: "4,500 sq.ft",
    description: "An expressive vertical urban residence in Bengaluru defined by textural buff brick cladding, sage green cantilevered balconies with cascading biophilic planters, and a sculptural spiral staircase leading to the entrance portal.",
    processNarrative: "Conceived as 'Brindavan'—a verdant garden sanctuary within the dense urban fabric—the residence layers vertical buff-brick tilework with tactile sage green stucco terraces. Cantilevered balconies burst with indigenous flora, creating a living microclimate that shields interior living quarters from street bustle while dappling tropical sunlight into double-height timber volumes. A floating external spiral stair ascends directly from street level to the arrival balcony, announcing the home with sculpted Kannada brass typography.",
    mainImage: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-suspended-granite-staircase-motion.jpg?alt=media&token=brindavan-suspended-granite-staircase-motion.jpg",
    gallery: [
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-facade-elevation.jpg?alt=media&token=brindavan-facade-elevation.jpg", caption: "Multi-storey street elevation framed by tree canopy with stacked sage green planter balconies and buff brick cladding", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-balcony-spiral-stair-entry.jpg?alt=media&token=brindavan-balcony-spiral-stair-entry.jpg", caption: "Street perspective showing resident ascending the external steel spiral staircase to the sage green entrance balcony with Kannada 'Brindavan 1714' signage", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-signage-spiral-stair-detail.jpg?alt=media&token=brindavan-signage-spiral-stair-detail.jpg", caption: "Close-up of the cantilevered sage green balcony corner with Kannada 'Brindavan' brass typography, house number 1714, and black granite spiral steps", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-green-terrace-balcony.jpg?alt=media&token=brindavan-green-terrace-balcony.jpg", caption: "First-floor cantilevered terrace with resident pet, lush tropical planters, trailing creepers, and solid teak entrance portal", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-interior-landing-pendants.jpg?alt=media&token=brindavan-interior-landing-pendants.jpg", caption: "Upper level interior hallway with solid teak flooring, vertical fluted brick feature wall, and trio of sculptural fabric cocoon pendants", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-teak-spiral-stair-overhead.jpg?alt=media&token=brindavan-teak-spiral-stair-overhead.jpg", caption: "Bird's-eye perspective of the internal spiral staircase featuring fan-splayed solid teak treads, cylindrical steel spine, and buff brick perimeter", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-living-lounge-floating-stair.jpg?alt=media&token=brindavan-living-lounge-floating-stair.jpg", caption: "Living salon with rust boucle lounge, dining table, floating black granite staircase with ceiling suspension rods, and glass balcony opening", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-stairwell-skylit-brick-shadows.jpg?alt=media&token=brindavan-stairwell-skylit-brick-shadows.jpg", caption: "Stairwell lightwell showcasing vertical buff brick bond, potted indoor ficus, manual gear-lever mechanism, and linear skylight shadowplay", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-cantilever-green-balcony-terrace.jpg?alt=media&token=brindavan-cantilever-green-balcony-terrace.jpg", caption: "Cantilevered green balcony terrace with olive plaster soffit, potted frangipani, vertical brick cladding, and lush treetop canopy view", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-balcony-spiral-stair-facade.jpg?alt=media&token=brindavan-balcony-spiral-stair-facade.jpg", caption: "Mid-level perspective of the arrival terrace featuring the external spiral staircase, Kannada house inscription, and slatted security grilles", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-atrium-lightwell-timber-pergola.jpg?alt=media&token=brindavan-atrium-lightwell-timber-pergola.jpg", caption: "Double-height lightwell court looking up toward timber pergola rafters with suspended cocoon lanterns and upper balcony threshold", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-louvered-skylight-shadow-terrace.jpg?alt=media&token=brindavan-louvered-skylight-shadow-terrace.jpg", caption: "Upper terrace court defined by vertical architectural louvers casting rhythmic linear shadow lines across the brick floor", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-brick-wall-bench-meditation.jpg?alt=media&token=brindavan-brick-wall-bench-meditation.jpg", caption: "Resident sitting on woven timber bench against vertical buff brick feature wall under kinetic linear skylight shadows", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-staircase-planter-pergola-shadows.jpg?alt=media&token=brindavan-staircase-planter-pergola-shadows.jpg", caption: "Lightwell staircase landing with potted umbrella tree, vertical buff brick bond, timber pergola, and skylight mechanical gear operator", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-landing-golden-retriever-pendants.jpg?alt=media&token=brindavan-landing-golden-retriever-pendants.jpg", caption: "Upper floor landing featuring resident pet, vertical buff brick wall, cluster of paper cocoon pendants, and sunlit balcony garden opening", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-dining-sage-wall-open-stair.jpg?alt=media&token=brindavan-dining-sage-wall-open-stair.jpg", caption: "Open-plan dining area with round stone table, teak wishbone chairs, sage green lime plaster accent wall, and suspended granite staircase", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-suspended-granite-staircase-motion.jpg?alt=media&token=brindavan-suspended-granite-staircase-motion.jpg", caption: "Suspended granite open-riser staircase with slender steel ceiling rods, modern wall art tiles, and polished concrete floor", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-double-height-atrium-sculptural-niche.jpg?alt=media&token=brindavan-double-height-atrium-sculptural-niche.jpg", caption: "Dramatic double-height living atrium featuring sculptural concrete niche divider, solid teak mezzanine bridge, and vertical buff brick lightwell", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-brick-wall-mechanical-wheel-vignette.jpg?alt=media&token=brindavan-brick-wall-mechanical-wheel-vignette.jpg", caption: "Architectural vignette of the buff brick lightwell wall, artisanal bench with design monographs, and industrial gear wheel operator", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-upper-teak-bridge-lightwell-view.jpg?alt=media&token=brindavan-upper-teak-bridge-lightwell-view.jpg", caption: "Upper level teak-lined bridge walkway overlooking the double-height lightwell court, sculptural cocoon pendants, and spiral stair landing", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-floating-stair-treads-rods-detail.jpg?alt=media&token=brindavan-floating-stair-treads-rods-detail.jpg", caption: "Graphic architectural profile of cantilevered timber treads suspended by slender steel rods against white plaster wall", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-lightwell-teak-bridge-balcony-view.jpg?alt=media&token=brindavan-lightwell-teak-bridge-balcony-view.jpg", caption: "Perspective down the lightwell court over solid teak bridge balustrade toward buff brick wall and pergola shadow bands", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-teak-bookshelf-brick-shadows.jpg?alt=media&token=brindavan-teak-bookshelf-brick-shadows.jpg", caption: "Bespoke open teak shelving unit displaying books and pop art bulldog sculpture against diagonal pergola sun shadows", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fbrindavan%2Fbrindavan-upper-gallery-reading-nook-shadows.jpg?alt=media&token=brindavan-upper-gallery-reading-nook-shadows.jpg", caption: "Upper gallery reading nook featuring teak balustrade, curated open bookshelf, and dynamic pergola shadow patterns on buff brick", aspect: "portrait" },
    ],
    servicesInvolved: ["Urban Residential Architecture", "Biophilic Facade Engineering", "Bespoke Interior Design"],
    teamMembers: ["Ar. Rajesh Shivaram", "Vikramaditya Shenoy", "Naveen Prasad"],
    credits: {
      principalArchitect: "Ar. Rajesh Shivaram",
      projectArchitect: "Vikramaditya Shenoy",
      projectLead: "Vikramaditya Shenoy",
      team: "Techno Architecture Studio Team",
      photography: "Shamanth Patil Photography",
    },
    featured: true,
    relatedSlugs: ["belaku", "between-two-trees", "aikya"],
    testimonial: {
      quote: "Techno Architecture crafted Brindavan as a serene haven where suspended granite staircases and floating volumes blend seamlessly with traditional materials. Every room feels alive with natural ventilation and daylight.",
      clientName: "K. S. Balasubramanian & Family",
      designation: "Homeowners",
      company: "Brindavan Villa",
    },
  },
  {
    id: "proj-5",
    slug: "far-site-buildofy",
    title: "FAR SITE BUILDOFY",
    category: "Residential",
    status: "completed",
    location: "Bengaluru, India",
    year: 2023,
    client: "Private Client",
    area: "4,800 sq.ft",
    description: "A striking multi-tier biophilic residence articulated with rich wire-cut terracotta brick cladding, intricate geometric jali screens, cantilevered exposed-aggregate balconies, and an expansive sky garden.",
    processNarrative: "Featured on Buildofy, Far Site represents an inventive urban response to tight site constraints and climatic performance. Deep cantilevered balconies finished in textural grey aggregate contrast vividly against warm wire-cut terracotta brick tilework. Perforated terracotta jali screens provide thermal comfort and privacy while casting kinetic shadow geometric patterns throughout interior living spaces. The internal circulation culminates in a cast concrete open-riser stair and a lushly landscaped rooftop terrace under a dramatic floating canopy slab.",
    mainImage: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-twilight-facade-sky-garden.jpg?alt=media&token=far-site-buildofy-twilight-facade-sky-garden.jpg",
    gallery: [
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-street-facade-elevation.jpg?alt=media&token=far-site-buildofy-street-facade-elevation.jpg", caption: "Three-quarter street elevation showcasing cantilevered timber louvers, wire-cut brick cladding, and lush rooftop terrace", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-wide-street-context.jpg?alt=media&token=far-site-buildofy-wide-street-context.jpg", caption: "Full contextual street elevation nestled in the neighborhood, featuring ground-floor garage, timber bay screen, and rooftop garden", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-cantilever-balconies-foliage.jpg?alt=media&token=far-site-buildofy-cantilever-balconies-foliage.jpg", caption: "Side perspective of cantilevered grit-finish balconies with tropical greenery, wire-cut brick tower, and terracotta jali screen", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-concrete-staircase-terracotta-jali.jpg?alt=media&token=far-site-buildofy-concrete-staircase-terracotta-jali.jpg", caption: "Entrance stairwell featuring cast concrete open-riser staircase, steel suspension balustrade, botanical artwork, and terracotta jali window", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-balcony-cantilever-upward.jpg?alt=media&token=far-site-buildofy-balcony-cantilever-upward.jpg", caption: "Dramatic upward perspective of cantilevered planter balconies, floral terracotta jali screen, and exposed concrete roof canopy", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-indoor-water-court-staircase.jpg?alt=media&token=far-site-buildofy-indoor-water-court-staircase.jpg", caption: "Entry foyer leading over black granite stepping stones across an indoor reflecting pool to the concrete staircase and terracotta jali screen", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-water-feature-jali-stairs.jpg?alt=media&token=far-site-buildofy-water-feature-jali-stairs.jpg", caption: "Internal water courtyard with aquatic planters and decorative accents connecting the open-riser concrete stair to the floor-to-ceiling jali", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-indoor-garden-lounge.jpg?alt=media&token=far-site-buildofy-indoor-garden-lounge.jpg", caption: "Intimate garden sitting area with contemporary woven armchairs, tribal kilim rug, and lush indoor tropical foliage against brickwork", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-mezzanine-stairwell-overlook.jpg?alt=media&token=far-site-buildofy-mezzanine-stairwell-overlook.jpg", caption: "Mezzanine corridor overlooking the skylit stairwell with full-height terracotta jali wall and timber balcony doors", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-double-height-living-salon.jpg?alt=media&token=far-site-buildofy-double-height-living-salon.jpg", caption: "Soaring double-height living room featuring vibrant yellow seating, exposed brick fireplace pillar, and timber mezzanine gallery", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-woven-pendant-atrium-sculpture.jpg?alt=media&token=far-site-buildofy-woven-pendant-atrium-sculpture.jpg", caption: "Grand double-height atrium illuminated by a constellation of sculptural woven mesh pendant lights, connecting the ground salon to the glass-railed mezzanine", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-timber-louver-sunlit-corridor.jpg?alt=media&token=far-site-buildofy-timber-louver-sunlit-corridor.jpg", caption: "Sun-drenched upper corridor framed by full-height teak slatted doors and terracotta jali screens casting linear shadow patterns across polished marble", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-living-room-timber-louver-fenestration.jpg?alt=media&token=far-site-buildofy-living-room-timber-louver-fenestration.jpg", caption: "Spacious main living lounge featuring mustard seating, exposed brick column with curated art, and floor-to-ceiling timber louvered fenestration", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-rooftop-terrace-lawn-patio.jpg?alt=media&token=far-site-buildofy-rooftop-terrace-lawn-patio.jpg", caption: "Private rooftop garden oasis complete with manicured lawn, shaded wood-deck seating patio, brick accent wall with artwork, and terracotta jali enclosure", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-terracotta-jali-canopy-detail.jpg?alt=media&token=far-site-buildofy-terracotta-jali-canopy-detail.jpg", caption: "Architectural material junction showing the intricate terracotta breeze blocks, wire-cut brick parapet, and deep cantilevered concrete roof canopy", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-concrete-stair-brick-lightwell.jpg?alt=media&token=far-site-buildofy-concrete-stair-brick-lightwell.jpg", caption: "Cast concrete open-riser staircase ascending toward a skylit brick lightwell with vertical steel suspension rods", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-mezzanine-stair-landing-perspective.jpg?alt=media&token=far-site-buildofy-mezzanine-stair-landing-perspective.jpg", caption: "Multi-level spatial dialogue connecting the glass-railed bridge, intermediate stair flight, and brick-clad lightwell", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-staircase-spatial-divider-dining.jpg?alt=media&token=far-site-buildofy-staircase-spatial-divider-dining.jpg", caption: "Floating concrete staircase acting as a sculptural divider between the intimate living lounge and open dining room", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-upper-mezzanine-sitting-lounge.jpg?alt=media&token=far-site-buildofy-upper-mezzanine-sitting-lounge.jpg", caption: "Upper mezzanine lounge with cognac armchairs, potted botanical planters, geometric rug, and glass overlook", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-terracotta-jali-courtyard-terrace.jpg?alt=media&token=far-site-buildofy-terracotta-jali-courtyard-terrace.jpg", caption: "Sunlit open-air courtyard terrace enclosed by an intricate terracotta breeze block screen and wire-cut brick walls", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-skylit-spa-ensuite-bathroom.jpg?alt=media&token=far-site-buildofy-skylit-spa-ensuite-bathroom.jpg", caption: "Skylit master ensuite bathroom featuring weathered wood tiles, river pebble borders, minimalist vessel vanity, and brass mirror", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-master-bedroom-geometric-headboard.jpg?alt=media&token=far-site-buildofy-master-bedroom-geometric-headboard.jpg", caption: "Master bedroom suite with backlit geometric timber relief headboard, copper drop pendants, and floating bedside cabinetry", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-mustard-armchairs-concrete-lamp-vignette.jpg?alt=media&token=far-site-buildofy-mustard-armchairs-concrete-lamp-vignette.jpg", caption: "Living room reading corner with patterned mustard armchairs, artisanal concrete and woven tripod lamp, and timber louvers", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-velvet-lounge-chairs-biophilic-corner.jpg?alt=media&token=far-site-buildofy-velvet-lounge-chairs-biophilic-corner.jpg", caption: "Intimate lounge nook featuring rust velvet armchairs, lush bird of paradise foliage, blue rug, and bespoke timber window slats", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-antique-brass-door-brick-nook.jpg?alt=media&token=far-site-buildofy-antique-brass-door-brick-nook.jpg", caption: "Heritage-contemporary architectural vignette with antique brass-clad temple door mounted against wire-cut brickwork and cognac leather lounge", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-twilight-facade-sky-garden.jpg?alt=media&token=far-site-buildofy-twilight-facade-sky-garden.jpg", caption: "Twilight elevation under sunset sky highlighting illuminated rooftop garden, wire-cut brick massing, and drive-in portico", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-twilight-dusk-elevation-driveway.jpg?alt=media&token=far-site-buildofy-twilight-dusk-elevation-driveway.jpg", caption: "Dramatic low-angle dusk view showing layered cantilevered slabs, timber bay louvers, and warm architectural lighting", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-arrival-court-tree-canopy.jpg?alt=media&token=far-site-buildofy-arrival-court-tree-canopy.jpg", caption: "Entrance arrival court framed by mature tree canopy, aggregate cantilevered planter terrace, and terracotta jali boundary", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-entrance-jali-screen-nameplate.jpg?alt=media&token=far-site-buildofy-entrance-jali-screen-nameplate.jpg", caption: "Ground level entry portal with terracotta breeze-block screen wall, brass house nameplate, and cantilevered planter terrace", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Ffar-site-buildofy%2Ffar-site-buildofy-biophilic-street-elevation-daylight.jpg?alt=media&token=far-site-buildofy-biophilic-street-elevation-daylight.jpg", caption: "Daylight street perspective framed by surrounding tree foliage, showcasing cantilevered concrete canopies and wire-cut brickwork", aspect: "portrait" },
    ],
    servicesInvolved: ["Urban Residential Architecture", "Biophilic Facade Engineering", "Terracotta Jali Screen Craft"],
    teamMembers: ["Ar. Rajesh Shivaram", "Vikramaditya Shenoy", "Karthik Sundaram"],
    credits: {
      principalArchitect: "Ar. Rajesh Shivaram",
      projectArchitect: "Vikramaditya Shenoy",
      projectLead: "Vikramaditya Shenoy",
      team: "Techno Architecture Studio Team",
      photography: "Shamanth Patil Photography",
    },
    featured: true,
    relatedSlugs: ["aikya", "belaku", "brindavan"],
    videoTour: {
      title: "2,400 sq.ft Compact House in Malleshwaram Bengaluru Karnataka Explores a Courtyard in a Unique Way",
      url: "https://www.youtube.com/results?search_query=2400+sqft+Compact+House+in+Malleshwaram+Bengaluru+The+Far+Site+Technoarchitecture",
      platform: "Buildofy",
      actionText: "Watch Buildofy Film",
    },
    testimonial: {
      quote: "The play of shadows cast by the terracotta jali and the lush cantilevered terraces make this home feel like a personal sanctuary in the city. Techno Architecture's vision featured on Buildofy is truly exemplary.",
      clientName: "Dr. Arvind Natarajan",
      designation: "Founder",
      company: "Natarajan Medical Group",
    },
  },
  {
    id: "proj-6",
    slug: "house-in-the-air",
    title: "HOUSE IN THE AIR",
    category: "Residential",
    status: "completed",
    location: "Bengaluru, India",
    year: 2023,
    client: "Private Client",
    area: "5,200 sq.ft",
    description: "A gravity-defying urban residence distinguished by dramatic cantilevered timber canopies, continuous glass planter balconies, a freestanding glass prayer pavilion, and a sculptural helical staircase.",
    processNarrative: "Conceived as 'House in the Air', the home elevates private living quarters above a secure stilt arrival zone with bold cantilevered volumes finished in warm teak cladding and crisp white stucco frames. Deep planter balconies provide a lush green buffer against the street while filtering tropical daylight into double-height interior spaces. Inside, an architectural journey unfolds around a central illuminated glass prayer sanctum, a sunlit living salon under a clerestory lantern, and an ethereal white steel spiral stair connecting upper galleries.",
    mainImage: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-glass-prayer-sanctuary-foyer.jpg?alt=media&token=house-in-the-air-glass-prayer-sanctuary-foyer.jpg",
    gallery: [
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-cantilever-facade-elevation.jpg?alt=media&token=house-in-the-air-cantilever-facade-elevation.jpg", caption: "Multi-tier street elevation featuring cantilevered teak canopy volumes, glass planter balconies with tropical palms, and stilt arrival", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-glass-prayer-sanctuary-foyer.jpg?alt=media&token=house-in-the-air-glass-prayer-sanctuary-foyer.jpg", caption: "Central glass prayer pavilion with teak framing and illuminated deity sanctum, set below warm timber ceiling with linear light channels", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-fluted-teak-pivot-door-foyer.jpg?alt=media&token=house-in-the-air-fluted-teak-pivot-door-foyer.jpg", caption: "Foyer entrance anchored by an oversized solid teak pivot door with vertical fluting, brass drop pendants, and hardwood flooring", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-sculptural-spiral-staircase-mezzanine.jpg?alt=media&token=house-in-the-air-sculptural-spiral-staircase-mezzanine.jpg", caption: "Dramatic white steel sculptural spiral stair ascending from hardwood mezzanine bridge through double-height atrium", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-double-height-living-skylight.jpg?alt=media&token=house-in-the-air-double-height-living-skylight.jpg", caption: "Soaring double-height formal living salon flooded with natural daylight through a high clerestory lantern skylight", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-twilight-facade-overcast.jpg?alt=media&token=house-in-the-air-twilight-facade-overcast.jpg", caption: "Twilight elevation under atmospheric overcast skies showcasing cantilevered teak volumes, illuminated stair, and planter balconies", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-atrium-timber-ceiling-disc-pendants.jpg?alt=media&token=house-in-the-air-atrium-timber-ceiling-disc-pendants.jpg", caption: "Direct upward perspective of the skylit timber ceiling featuring bespoke circular textured luminous pendant fixtures", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-foyer-living-panoramic-transition.jpg?alt=media&token=house-in-the-air-foyer-living-panoramic-transition.jpg", caption: "Panoramic vista capturing the material threshold from the rich teak foyer into the expansive marble double-height living salon", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-steel-rod-stairwell-chandelier.jpg?alt=media&token=house-in-the-air-steel-rod-stairwell-chandelier.jpg", caption: "Vertical steel suspension rod balustrade framing the marble stairwell and cluster of faceted crystal drop pendants", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-elevated-dusk-street-perspective.jpg?alt=media&token=house-in-the-air-elevated-dusk-street-perspective.jpg", caption: "Elevated dusk perspective revealing the floating multi-tier architecture, illuminated teak facade, and cantilevered balconies", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-dusk-elevation-entry-stair.jpg?alt=media&token=house-in-the-air-dusk-elevation-entry-stair.jpg", caption: "Three-quarter dusk perspective highlighting illuminated entrance steps, backlit wall sculpture, and cantilevered teak canopies", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-frontal-twilight-facade.jpg?alt=media&token=house-in-the-air-frontal-twilight-facade.jpg", caption: "Direct frontal twilight elevation capturing the hovering teak volumes, warm soffit illumination, and lush planter balconies", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-dining-pavilion-open-kitchen.jpg?alt=media&token=house-in-the-air-dining-pavilion-open-kitchen.jpg", caption: "Open-plan dining pavilion with sculptural leather seating, marble table, linear bronze pendants, and teak ceiling soffit", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-daylight-street-elevation-sunlight.jpg?alt=media&token=house-in-the-air-daylight-street-elevation-sunlight.jpg", caption: "Crisp daylight street perspective showing the contrasting dialogue between white stucco frames, teak cladding, and green palms", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-spiral-staircase-overhead-helix.jpg?alt=media&token=house-in-the-air-spiral-staircase-overhead-helix.jpg", caption: "Dramatic downward helical perspective of the sculpted white steel spiral stair with fan-splayed solid teak treads", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-double-height-salon-spiral-void.jpg?alt=media&token=house-in-the-air-double-height-salon-spiral-void.jpg", caption: "Double-height living salon overlooking the helical spiral staircase, suspended luminous pendants, and open plan ground level", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-illuminated-stair-prayer-pavilion.jpg?alt=media&token=house-in-the-air-illuminated-stair-prayer-pavilion.jpg", caption: "Step-lit marble staircase flanked by the freestanding glass and teak prayer sanctuary with geometric filigree screen", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fhouse-in-the-air%2Fhouse-in-the-air-soaring-living-void-mezzanine-view.jpg?alt=media&token=house-in-the-air-soaring-living-void-mezzanine-view.jpg", caption: "Vertical perspective of the double-height volume connecting the marble lounge, timber ceiling lanterns, and upper glass bridge", aspect: "portrait" },
    ],
    servicesInvolved: ["Urban Residential Architecture", "Cantilever Engineering", "Bespoke Interior Design"],
    teamMembers: ["Vikramaditya Shenoy", "Divya Raghavan", "Naveen Prasad"],
    credits: {
      principalArchitect: "Ar. Rajesh Shivaram",
      projectArchitect: "Vikramaditya Shenoy",
      projectLead: "Vikramaditya Shenoy",
      team: "Techno Architecture Studio Team",
      photography: "Technoarchitecture Studio",
    },
    featured: true,
    relatedSlugs: ["far-site-buildofy", "brindavan", "belaku"],
    testimonial: {
      quote: "The elevated glass prayer sanctuary and seamless terrace verandas make House in the Air feel suspended above the city. Living here is a serene daily experience of panoramic sky and floating greens.",
      clientName: "Rahul & Meera Krishnan",
      designation: "Homeowners",
      company: "House in the Air",
    },
  },
  {
    id: "proj-7",
    slug: "kanasu",
    title: "KANASU",
    category: "Residential",
    status: "completed",
    location: "Sadashivanagar, Bengaluru",
    year: 2024,
    client: "Private Residence",
    area: "8,900 sq.ft",
    description: "An ultra-luxury private sanctuary featuring cantilevered post-tensioned slabs, a soaring double-height dining volume, warm teak vertical screens, and a serene rooftop swimming pool pavilion overlooking Bengaluru's tree line.",
    processNarrative: "Centred on the seamless dialogue between indoor living spaces and verdant perimeter courtyards, Kanasu choreographs movement across marble-lined living halls, double-height volumes, and an elevated rooftop pool canopy crafted with warm slatted timber soffits and slender steel columns.",
    mainImage: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-rooftop-pool-timber-canopy.jpg?alt=media&token=kanasu-rooftop-pool-timber-canopy.jpg",
    gallery: [
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-rooftop-pool-timber-canopy.jpg?alt=media&token=kanasu-rooftop-pool-timber-canopy.jpg", caption: "Cantilevered rooftop lap pool pavilion featuring warm timber ceiling soffit, stone terrace, and lush treetop canopy", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-double-height-dining-sculptural-art.jpg?alt=media&token=kanasu-double-height-dining-sculptural-art.jpg", caption: "Soaring double-height dining volume with custom mustard leather chairs, sculptural cloud pendants, and copper herd wall relief", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-living-lounge-timber-screen.jpg?alt=media&token=kanasu-living-lounge-timber-screen.jpg", caption: "Ground level living lounge with Italian calacatta marble flooring, bespoke leather seating, and slatted vertical timber partition", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-column-veranda-timber-accent-wall.jpg?alt=media&token=kanasu-column-veranda-timber-accent-wall.jpg", caption: "Transition gallery framed by a cylindrical exposed concrete column, vertical timber paneling, and sunken garden greenery", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-poolside-terrace-wicker-lounge.jpg?alt=media&token=kanasu-poolside-terrace-wicker-lounge.jpg", caption: "Rooftop poolside lounge with sage green woven wicker armchairs, tropical planter bed, and azure swimming pool waters", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-master-bath-calacatta-marble-spa.jpg?alt=media&token=kanasu-master-bath-calacatta-marble-spa.jpg", caption: "Master bathroom sanctuary featuring bookmatched calacatta marble, frameless glass rain shower, floating bench, and rich teak ceiling soffit", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-living-partition-dining-vista.jpg?alt=media&token=kanasu-living-partition-dining-vista.jpg", caption: "Living lounge looking across the vertical timber screen toward the dining volume, double-height ceiling, and illuminated art gallery", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-panoramic-living-media-suite-flow.jpg?alt=media&token=kanasu-panoramic-living-media-suite-flow.jpg", caption: "Expansive open-plan circulation connecting the marble living salon, vertical timber divider, and timber-framed media lounge", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-timber-canopy-veranda-lounge.jpg?alt=media&token=kanasu-timber-canopy-veranda-lounge.jpg", caption: "Deep timber-clad cantilevered balcony veranda with woven rope armchair, stone flooring, and lush treetop garden canopy", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-veranda-reading-nook-garden-balcony.jpg?alt=media&token=kanasu-veranda-reading-nook-garden-balcony.jpg", caption: "Intimate balcony reading nook enveloped by rich vertical timber slats, timber ceiling, tropical planter bed, and tree shadows", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-cantilever-balconies-tree-canopy.jpg?alt=media&token=kanasu-cantilever-balconies-tree-canopy.jpg", caption: "Dramatic low-angle view of the cantilevered white balcony slabs and glass planter balustrades framed by mature green tree canopies", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-monolithic-cantilever-facade-entry.jpg?alt=media&token=kanasu-monolithic-cantilever-facade-entry.jpg", caption: "Towering vertical street elevation showing the cylindrical exposed concrete column, corten entrance gate, and cantilevered upper balcony trays", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-double-height-curtain-wall-greenery.jpg?alt=media&token=kanasu-double-height-curtain-wall-greenery.jpg", caption: "Soaring double-height dining room featuring floor-to-ceiling curtain wall looking onto lush vertical garden wall and sculptural pendant chandeliers", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-dining-atrium-mezzanine-bridge.jpg?alt=media&token=kanasu-dining-atrium-mezzanine-bridge.jpg", caption: "Double-height dining atrium with yellow leather chairs, timber mezzanine bridge, and slatted vertical screen", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-dining-vista-glass-elevator-stairs.jpg?alt=media&token=kanasu-dining-vista-glass-elevator-stairs.jpg", caption: "Perspective across dining suite toward the glass elevator tower, step-lit floating marble staircase, and timber mezzanine", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-rooftop-pool-garden-pergola-lounge.jpg?alt=media&token=kanasu-rooftop-pool-garden-pergola-lounge.jpg", caption: "Rooftop swimming pool terrace under steel pergola with lush garden planters, yellow pots, and soft outdoor lounge seating", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-family-lounge-hardwood-elevator-vista.jpg?alt=media&token=kanasu-family-lounge-hardwood-elevator-vista.jpg", caption: "Upper level family lounge with solid hardwood flooring, bespoke upholstered seating, backlit shelving, and glass elevator vista", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-master-suite-timber-portal-entry.jpg?alt=media&token=kanasu-master-suite-timber-portal-entry.jpg", caption: "Master bedroom threshold framed by rich walnut paneling, backlit display unit, calacatta marble, and canopy window", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-master-bedroom-backlit-timber-headboard.jpg?alt=media&token=kanasu-master-bedroom-backlit-timber-headboard.jpg", caption: "Master bedroom interior showcasing bespoke backlit timber storage niche, upholstered bed, and acoustic fabric wall panel", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-poolside-pavilion-indoor-outdoor-terrace.jpg?alt=media&token=kanasu-poolside-pavilion-indoor-outdoor-terrace.jpg", caption: "Seamless indoor-outdoor pool pavilion connecting the covered living suite with the rooftop lap pool and timber pergola terrace", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-twilight-street-facade-corten-gate.jpg?alt=media&token=kanasu-twilight-street-facade-corten-gate.jpg", caption: "Frontal twilight elevation featuring illuminated corten fence with Kannada 'Kanasu' typography, glowing cantilevered soffit, and tree canopy", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-corner-twilight-street-perspective.jpg?alt=media&token=kanasu-corner-twilight-street-perspective.jpg", caption: "Corner street perspective at twilight showcasing the multi-tier architectural volumes harmoniously integrated into mature Bangalore trees", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-dusk-garage-ramp-entrance-elevation.jpg?alt=media&token=kanasu-dusk-garage-ramp-entrance-elevation.jpg", caption: "Dusk street entrance showcasing illuminated subterranean garage ramp, cantilevered glowing LED soffit, and exposed concrete column", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-sunset-poolside-wicker-terrace.jpg?alt=media&token=kanasu-sunset-poolside-wicker-terrace.jpg", caption: "Rooftop poolside lounge at golden hour sunset with woven armchairs, lanterns, and tranquil azure waters", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkanasu%2Fkanasu-covered-rooftop-pergola-lounge-suite.jpg?alt=media&token=kanasu-covered-rooftop-pergola-lounge-suite.jpg", caption: "Covered timber pergola roof lounge with modular pink seating, floating step benches, and lush tropical planters", aspect: "portrait" },
    ],
    servicesInvolved: ["Turnkey Architecture", "Structural BIM Coordination", "Interior Design"],
    teamMembers: ["Vikramaditya Shenoy", "Karthik Sundaram", "Aditya Joshi"],
    credits: {
      principalArchitect: "Ar. Rajesh Shivaram",
      projectArchitect: "Aditya Joshi",
      projectLead: "Aditya Joshi",
      team: "Techno Architecture Studio Team",
      photography: "Shamanth Patil Photography",
    },
    featured: true,
    relatedSlugs: ["house-in-the-air", "far-site-buildofy", "between-two-trees"],
    videoTour: {
      title: "Luxury Vastu House Kanasu in Bengaluru, Karnataka | Technoarchitecture (Home Tour)",
      url: "https://www.youtube.com/results?search_query=Luxury+Vastu+House+Kanasu+in+Bengaluru+Technoarchitecture+Home+Tour",
      platform: "YouTube",
      actionText: "Watch House Tour",
    },
    testimonial: {
      quote: "Kanasu perfectly balances traditional Vastu principles with contemporary tropical design. The volumetric light and serene internal courtyards give our family an extraordinary sense of calm.",
      clientName: "Raghavendra & Priya Joshi",
      designation: "Homeowners",
      company: "Kanasu Residence",
    },
  },
  {
    id: "proj-8",
    slug: "kripa",
    title: "KRIPA",
    category: "Residential",
    status: "completed",
    location: "Bengaluru, India",
    year: 2024,
    client: "Private Residence",
    area: "5,800 sq.ft",
    description: "A biophilic residential sanctuary harmonizing geometric concrete breeze-block jaali screens, textured charcoal stone cladding, cascading hanging gardens, and a sculpted steel-and-teak folded plate staircase.",
    processNarrative: "Conceived as a breathing urban home, Kripa filters southern sunlight and street activity through an intricate porous concrete breeze block screen. Deep recessed balconies drape with lush curtain creepers, creating an introspective, tropical microclimate centered around a minimalist black folded steel staircase flight.",
    mainImage: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-dining-room-indoor-outdoor-veranda.jpg?alt=media&token=kripa-dining-room-indoor-outdoor-veranda.jpg",
    gallery: [
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-frontal-facade-cascading-greenery.jpg?alt=media&token=kripa-frontal-facade-cascading-greenery.jpg", caption: "Frontal street elevation featuring porous concrete breeze block jaali, entrance portal, and cascading balcony greenery", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-dusk-illuminated-jaali-facade.jpg?alt=media&token=kripa-dusk-illuminated-jaali-facade.jpg", caption: "Twilight facade perspective featuring warm interior illumination glowing through the breeze-block jaali screen and floor-to-ceiling timber windows", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-stone-cladding-terrace-facade.jpg?alt=media&token=kripa-stone-cladding-terrace-facade.jpg", caption: "Upper facade geometry clad in textured charcoal ashlar stone with recessed balcony planter beds and hanging curtain creepers", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-breeze-block-jaali-street-entry.jpg?alt=media&token=kripa-breeze-block-jaali-street-entry.jpg", caption: "Street-level perspective showing the geometric concrete jaali wall, perimeter garden beds, and mature shade trees", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-double-height-living-room-jaali-shadows.jpg?alt=media&token=kripa-double-height-living-room-jaali-shadows.jpg", caption: "Dramatic double-height living room with sculptural glass-balustrade staircase, breeze-block jaali light filtration, and dandelion crystal chandelier", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-timber-aperture-staircase-study-foyer.jpg?alt=media&token=kripa-timber-aperture-staircase-study-foyer.jpg", caption: "Internal architectural aperture framed in warm teak wood looking toward the folded steel stair flight, reading nook, and integrated study desk", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-double-height-hallway-stair-descent.jpg?alt=media&token=kripa-double-height-hallway-stair-descent.jpg", caption: "Double-height circulation volume featuring glass balustrade mezzanine, lush indoor foliage, and central black steel folded stair flight", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-folded-steel-staircase-profile.jpg?alt=media&token=kripa-folded-steel-staircase-profile.jpg", caption: "Architectural folded plate black steel staircase with warm teak treads, vertical balusters, and sculpted wooden handrail", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-stairwell-reading-lounge-plants.jpg?alt=media&token=kripa-stairwell-reading-lounge-plants.jpg", caption: "Light-filled stairwell landing lounge with reading armchair, woven rug, indoor planters, and folded steel stair flight", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-olive-green-master-bedroom-suite.jpg?alt=media&token=kripa-olive-green-master-bedroom-suite.jpg", caption: "Master bedroom suite with olive green upholstered headboard, sage bedding, textured bedside nightstand, and lush indoor plant", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-dusk-street-corner-elevation-suv.jpg?alt=media&token=kripa-dusk-street-corner-elevation-suv.jpg", caption: "Dusk street corner perspective showcasing the multi-tier architectural volumes, angled roof canopy, illuminated jaali facade, and ground-level carport", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-carport-entrance-cascading-balcony-dusk.jpg?alt=media&token=kripa-carport-entrance-cascading-balcony-dusk.jpg", caption: "Warm illuminated carport entrance with geometric breeze-block jaali wall beneath the cantilevered balcony draped with cascading greenery", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-frontal-dusk-elevation-driveway.jpg?alt=media&token=kripa-frontal-dusk-elevation-driveway.jpg", caption: "Full frontal dusk elevation highlighting the dramatic interplay between textured charcoal ashlar stone, illuminated breeze-block jaali screen, and paved driveway", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-corner-carport-glazed-volume-twilight.jpg?alt=media&token=kripa-corner-carport-glazed-volume-twilight.jpg", caption: "Twilight corner perspective revealing the wrap-around floor-to-ceiling timber glazing, deep cantilevered soffit, and breeze-block jaali screen", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-driveway-carport-balcony-garden.jpg?alt=media&token=kripa-driveway-carport-balcony-garden.jpg", caption: "Ground-level carport and paved driveway framed by lush cascading balcony planter beds, warm interior lighting, and concrete jaali screens", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-granite-entry-steps-teak-door-creepers.jpg?alt=media&token=kripa-granite-entry-steps-teak-door-creepers.jpg", caption: "Polished granite entrance stairway with sculpted teak handrail, solid wood front door, and cascading balcony curtain creepers", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-slatted-steel-gate-courtyard-breeze-blocks.jpg?alt=media&token=kripa-slatted-steel-gate-courtyard-breeze-blocks.jpg", caption: "Vertical slatted steel security gate opening toward the courtyard steps, framed by sunlit triangular concrete breeze-block jaali screens", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-dining-living-salon-garden-windows.jpg?alt=media&token=kripa-dining-living-salon-garden-windows.jpg", caption: "Light-drenched dining and living salon with circular walnut table, textured area rug, and floor-to-ceiling timber windows framing garden greenery", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-cantilevered-terrace-balcony-granite-bench.jpg?alt=media&token=kripa-cantilevered-terrace-balcony-granite-bench.jpg", caption: "Deep cantilevered terrace with polished black granite bench, lush planter boxes, and curtain creepers framing views of neighborhood tree canopies", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-dining-room-indoor-outdoor-veranda.jpg?alt=media&token=kripa-dining-room-indoor-outdoor-veranda.jpg", caption: "Seamless indoor-outdoor dining space with custom circular table, bespoke timber joinery, and expansive sliding glass doors opening to the veranda planter garden", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-patinated-copper-coffee-table-lounge.jpg?alt=media&token=kripa-patinated-copper-coffee-table-lounge.jpg", caption: "Bespoke patinated copper coffee tables with Geoffrey Bawa monograph, textured area rug, and woven cane lounge seating", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-double-height-atrium-staircase-dining-vista.jpg?alt=media&token=kripa-double-height-atrium-staircase-dining-vista.jpg", caption: "Double-height central atrium connecting the formal living room, sculptural glass-and-teak staircase flight, and ground-floor dining suite", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-modular-kitchen-circular-dining-table.jpg?alt=media&token=kripa-modular-kitchen-circular-dining-table.jpg", caption: "Minimalist open-concept modular kitchen and dining zone featuring circular walnut table, leather chairs, and seamless teak joinery", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-mezzanine-lounge-blue-armchairs-jaali.jpg?alt=media&token=kripa-mezzanine-lounge-blue-armchairs-jaali.jpg", caption: "Upper mezzanine seating lounge with blue velvet armchairs, geometric circular rug, and floor-to-ceiling concrete breeze-block jaali screen", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-double-height-corner-glass-living-salon.jpg?alt=media&token=kripa-double-height-corner-glass-living-salon.jpg", caption: "Double-height living salon with wrap-around corner timber glazing framing centenary tree canopies, cane daybeds, and dandelion chandelier", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-upper-jaali-screen-cantilever-canopy.jpg?alt=media&token=kripa-upper-jaali-screen-cantilever-canopy.jpg", caption: "Upper facade detail showcasing the concrete breeze-block jaali lattice, deep cantilevered white canopy soffit, and lush framing tree canopy", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fkripa%2Fkripa-timber-louvers-foliage-staircase-vista.jpg?alt=media&token=kripa-timber-louvers-foliage-staircase-vista.jpg", caption: "Lush tropical planter greenery and timber-louvered shutters with staircase flight visible through large glazed window panels", aspect: "portrait" },
    ],
    servicesInvolved: ["Urban Residential Architecture", "Biophilic Facade Engineering", "Bespoke Interior Design"],
    teamMembers: ["Vikramaditya Shenoy", "Divya Raghavan", "Naveen Prasad"],
    credits: {
      principalArchitect: "Ar. Rajesh Shivaram",
      projectArchitect: "Divya Raghavan",
      projectLead: "Divya Raghavan",
      team: "Techno Architecture Studio Team",
      photography: "Shamanth Patil Photography",
    },
    featured: true,
    relatedSlugs: ["kanasu", "house-in-the-air", "brindavan"],
    videoTour: {
      title: "1,500 sq.ft. Compact Home in Bangalore (House Tour)",
      url: "https://www.youtube.com/results?search_query=Kripa+1500+sq+ft+Techno+Architecture+House+Tour",
      platform: "YouTube",
      actionText: "Watch House Tour",
    },
    testimonial: {
      quote: "Kripa's climate-responsive screens, timber terraces, and central water court provide our family with unmatched comfort and thermal serenity throughout Bengaluru's changing seasons.",
      clientName: "Vikram & Radhika Chandran",
      designation: "Homeowners",
      company: "Kripa Residence",
    },
  },
  {
    id: "proj-10",
    slug: "salut",
    title: "SALUT",
    category: "Hospitality",
    status: "completed",
    location: "Bengaluru, India",
    year: 2023,
    client: "Salut Hospitality Ventures",
    area: "6,800 sq.ft",
    description: "An energetic biophilic rooftop gastro-lounge characterized by double-height exposed steel trusses, vertical living plant walls, a signature terracotta breeze-block jali bar, and elevated treetop cocktail decks.",
    processNarrative: "Conceived as an airy urban sanctuary among the tree canopies. We orchestrated a multi-level social venue featuring an industrial mezzanine, vibrant street-facing high-top balconies, living greenery facades, and bespoke acoustic brickwork.",
    mainImage: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-terracotta-jali-bar-atrium.jpg?alt=media&token=salut-terracotta-jali-bar-atrium.jpg",
    gallery: [
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-terracotta-jali-bar-atrium.jpg?alt=media&token=salut-terracotta-jali-bar-atrium.jpg", caption: "Double-height open-air dining hall featuring the central terracotta jali wall, illuminated Salut emblem, exposed brick bar, and vertical living wall.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-living-wall-bar-deck.jpg?alt=media&token=salut-living-wall-bar-deck.jpg", caption: "Lush biophilic living wall and projection screen framed by raw exposed brick bar counter, tiled dining tables, and elevated timber terrace deck.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-tree-canopy-rooftop-terrace.jpg?alt=media&token=salut-tree-canopy-rooftop-terrace.jpg", caption: "Upper terrace dining deck floating amidst the treetops with vertical steel sun-fins, suspended botanical planters, and reclaimed timber flooring.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-mezzanine-rock-lounge.jpg?alt=media&token=salut-mezzanine-rock-lounge.jpg", caption: "Under-mezzanine cocktail lounge with exposed industrial steel structure, curated musical art accents, and bespoke tiled dining tables.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-deck-treetop-cocktail-balcony.jpg?alt=media&token=salut-deck-treetop-cocktail-balcony.jpg", caption: "Elevated treetop cocktail deck with vibrant high-top seating, warm Edison pendant lamps, and seamless outdoor biophilic connection.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-indoor-taproom-brewery-bar.jpg?alt=media&token=salut-indoor-taproom-brewery-bar.jpg", caption: "Moody indoor craft taproom with ambient Edison cage pendants, exposed brick counter, and solid timber bench seating.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-double-height-mezzanine-dining-atrium.jpg?alt=media&token=salut-double-height-mezzanine-dining-atrium.jpg", caption: "Double-height dining hall with mint green steel mezzanine balcony, suspended Edison bulbs, and terracotta jali feature wall.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-vintage-bicycle-cocktail-corner.jpg?alt=media&token=salut-vintage-bicycle-cocktail-corner.jpg", caption: "Elevated timber deck nook with vintage penny-farthing bicycle art, warm brick masonry pillar, and high-top cocktail seating.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-guitar-art-dining-hall-vista.jpg?alt=media&token=salut-guitar-art-dining-hall-vista.jpg", caption: "Open dining hall vista featuring trio guitar art installations, lush perimeter planter beds, and views to the tree-canopy terrace.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-linear-brick-bar-vertical-garden.jpg?alt=media&token=salut-linear-brick-bar-vertical-garden.jpg", caption: "Panoramic view of the linear exposed brick bar counter, double-height vertical garden wall with projection screen, and terracotta jali screen.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-frosted-glass-high-top-seating.jpg?alt=media&token=salut-frosted-glass-high-top-seating.jpg", caption: "Intimate indoor high-top seating aligned along frosted glass windows with glowing neon table centerpiece and exposed electrical conduit.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-geometric-tile-bar-counter-stools.jpg?alt=media&token=salut-geometric-tile-bar-counter-stools.jpg", caption: "Sculptural bar counter featuring 3D geometric relief tiles, warm under-counter illumination, live-edge wood barstools, and bespoke copper pipe lighting.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-indoor-craft-brewery-hall-vista.jpg?alt=media&token=salut-indoor-craft-brewery-hall-vista.jpg", caption: "Indoor craft brewery dining hall with solid wooden picnic benches, pyramid cage pendants, and dual-tone faceted tile and brick bar.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-craft-beer-bar-picnic-seating.jpg?alt=media&token=salut-craft-beer-bar-picnic-seating.jpg", caption: "Frontal perspective of the geometric tile bar counter and craft beer taps with solid timber picnic bench arrangements.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-entrance-vestibule-illuminated-staircase.jpg?alt=media&token=salut-entrance-vestibule-illuminated-staircase.jpg", caption: "Atmospheric arrival foyer with illuminated floating stair treads, elevator landing, wall-mounted botanical ceramic planters, and cocktail seating.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-rooftop-dining-live-sports-projection.jpg?alt=media&token=salut-rooftop-dining-live-sports-projection.jpg", caption: "Open-air rooftop dining hall with live sports projection on the central biophilic wall, flanked by the terracotta jali screen and mezzanine.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-terracotta-jali-dining-staircase-view.jpg?alt=media&token=salut-terracotta-jali-dining-staircase-view.jpg", caption: "Central dining room framing the terracotta breeze-block jali with illuminated Salut emblem, brick bar, and open-tread staircase.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-mezzanine-aerial-dining-vista.jpg?alt=media&token=salut-mezzanine-aerial-dining-vista.jpg", caption: "Overhead mezzanine vantage point capturing the energetic dining floor, long service bar, and elevated treetop terrace deck.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-planter-veranda-cocktail-corridor.jpg?alt=media&token=salut-planter-veranda-cocktail-corridor.jpg", caption: "Lush tropical planter corridor along the balcony edge with vintage patterned floor tiles, yellow metal barstools, and treetop canopy views.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-twilight-neon-atrium-ambience.jpg?alt=media&token=salut-twilight-neon-atrium-ambience.jpg", caption: "Dramatic twilight ambience featuring neon under-mezzanine glow, projection screening, and silhouette of centenary trees against the dusk sky.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-cathedral-rafters-pendant-canopy.jpg?alt=media&token=salut-cathedral-rafters-pendant-canopy.jpg", caption: "Double-height industrial ceiling rafters with suspended warm incandescent pendants and green mezzanine plant balconies.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-terrace-bar-screening-ambience.jpg?alt=media&token=salut-terrace-bar-screening-ambience.jpg", caption: "Evening bar ambience showcasing the lit brick counter, biophilic projection wall, and terracotta jali accent screen.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-central-dining-hall-evening-vista.jpg?alt=media&token=salut-central-dining-hall-evening-vista.jpg", caption: "Central dining room arrangement facing the illuminated live sports screening wall and terracotta breeze-block screen.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-signature-terracotta-jali-emblem.jpg?alt=media&token=salut-signature-terracotta-jali-emblem.jpg", caption: "Signature architectural feature wall: hand-laid terracotta breeze blocks with integrated planter box and backlit circular Salut emblem.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-brick-counter-hairpin-barstools.jpg?alt=media&token=salut-brick-counter-hairpin-barstools.jpg", caption: "Tactile exposed brick bar counter illuminated by hidden LED grazing, paired with sculpted timber barstools on patterned floor tiles.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-mezzanine-balcony-mural-geometric-tiles.jpg?alt=media&token=salut-mezzanine-balcony-mural-geometric-tiles.jpg", caption: "Upper mezzanine balcony with graphic animal wall mural, geometric monochrome tiled flooring, and high barstools overlooking the atrium.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-upper-mezzanine-dining-geometric-terrazzo.jpg?alt=media&token=salut-upper-mezzanine-dining-geometric-terrazzo.jpg", caption: "Spacious upper mezzanine dining hall with timber dining tables, industrial pendant fixtures, and vertical slatted louvre screens.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-mezzanine-planter-railing-cocktail-corridor.jpg?alt=media&token=salut-mezzanine-planter-railing-cocktail-corridor.jpg", caption: "Cocktail promenade along the upper mezzanine featuring perforated steel balustrades with integrated planters and treetop outlooks.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-upper-level-dining-hall-louvre-facade.jpg?alt=media&token=salut-upper-level-dining-hall-louvre-facade.jpg", caption: "Upper dining hall bathed in natural light through vertical steel louvres, paired with industrial hanging fixtures and colorful dining chairs.", aspect: "full" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-terracotta-jali-staircase-mezzanine-perspective.jpg?alt=media&token=salut-terracotta-jali-staircase-mezzanine-perspective.jpg", caption: "Upward architectural perspective capturing the terracotta breeze-block jali with illuminated emblem, open-tread staircase, and mezzanine balcony.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-terrace-balcony-vertical-fins-overlook.jpg?alt=media&token=salut-terrace-balcony-vertical-fins-overlook.jpg", caption: "Elevated vantage overlooking the outdoor dining terrace, flanked by vertical steel sun fins and perimeter planters.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-sunlit-terracotta-atrium-bar-morning.jpg?alt=media&token=salut-sunlit-terracotta-atrium-bar-morning.jpg", caption: "Sunlit morning atrium with angular daylight washing across the terracotta jali screen, brick bar, and living wall.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-high-top-cocktail-nook-treetop-canopy.jpg?alt=media&token=salut-high-top-cocktail-nook-treetop-canopy.jpg", caption: "High-top cocktail nook nestled beside tall ornamental grass planters and expansive flowering tree canopies.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-open-air-balcony-dining-treetop-vista.jpg?alt=media&token=salut-open-air-balcony-dining-treetop-vista.jpg", caption: "Open-air balcony dining corridor lined with flourishing planter beds and custom patterned tile floor inlays.", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsalut%2Fsalut-sunlit-brick-bar-hairpin-stools.jpg?alt=media&token=salut-sunlit-brick-bar-hairpin-stools.jpg", caption: "Raking sunlight illuminating the exposed brick bar counter, hairpin barstools, and biophilic vertical garden.", aspect: "portrait" },
    ],
    servicesInvolved: ["Hospitality Architecture", "Interior Design", "Biophilic Landscape Integration"],
    teamMembers: ["Vikramaditya Shenoy", "Divya Raghavan"],
    credits: {
      principalArchitect: "Ar. Rajesh Shivaram",
      projectArchitect: "Divya Raghavan",
      projectLead: "Divya Raghavan",
      team: "Techno Architecture Studio Team",
      photography: "Technoarchitecture Studio",
    },
    featured: false,
    relatedSlugs: ["kripa", "between-two-trees", "far-site-buildofy"],
    testimonial: {
      quote: "Techno Architecture's design of Salut created one of Bengaluru's most distinctive brewery landmarks. The terracotta breeze-block jali and biophilic garden wall attract design enthusiasts from all across India.",
      clientName: "Salut Hospitality Ventures",
      designation: "Patrons",
      company: "Salut Craft Brewery",
    },
  },
  {
    id: "proj-12",
    slug: "the-mantle",
    title: "THE MANTLE",
    category: "Residential",
    status: "completed",
    location: "Banashankari, Bengaluru",
    year: 2021,
    client: "Private Client",
    area: "8,300 sq.ft",
    description: "Featured on Buildofy, The Mantle is an introspective residential retreat articulated around a central light court, raw textured concrete, teakwood louvers, floating steel staircases, and luminous double-height volumes.",
    processNarrative: "Conceived as a protective mantle shielding its inhabitants from the bustling street, the home organizes living spaces around a series of serene lightwells, courtyards, and a contemplative reflecting water body. Teak privacy screens and slatted pergolas modulate tropical light, casting dramatic linear shadows across white terrazzo and warm timber surfaces.",
    mainImage: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2Fmantle-buildofy-double-height-living-atrium.jpg?alt=media&token=mantle-buildofy-double-height-living-atrium.jpg",
    gallery: [
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2Fmantle-buildofy-double-height-living-atrium.jpg?alt=media&token=mantle-buildofy-double-height-living-atrium.jpg", caption: "Double-height central living court featuring suspended cylindrical glass tube chandeliers and petrol blue leather seating", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2Fmantle-buildofy-sunken-living-courtyard.jpg?alt=media&token=mantle-buildofy-sunken-living-courtyard.jpg", caption: "Sunken formal living lounge with bespoke floral carpet looking out towards internal court garden and slatted timber screens", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2Fmantle-buildofy-floating-steel-timber-staircase.jpg?alt=media&token=mantle-buildofy-floating-steel-timber-staircase.jpg", caption: "Sculptural floating steel and teak timber staircase with slender vertical tension rods", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2Fmantle-buildofy-skylight-pergola-stairwell.jpg?alt=media&token=mantle-buildofy-skylight-pergola-stairwell.jpg", caption: "Upper stairwell illuminated by linear slatted pergola skylight casting rhythmic geometric shadow patterns", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2Fmantle-buildofy-master-bedroom-terrace.jpg?alt=media&token=mantle-buildofy-master-bedroom-terrace.jpg", caption: "Master bedroom suite with dusty rose feature wall, low platform bed, and floor-to-ceiling glass terrace doors", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F25-zenith-residence-street-facade-yellow-portal.jpg?alt=media&token=25-zenith-residence-street-facade-yellow-portal.jpg", caption: "Signature street elevation highlighting mustard-yellow entry portal and timber louvers", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F01-zenith-residence-twilight-cantilever-facade.jpg?alt=media&token=01-zenith-residence-twilight-cantilever-facade.jpg", caption: "Twilight exterior view of cantilevered cubes and timber louvers", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F02-zenith-residence-yellow-entrance-portico.jpg?alt=media&token=02-zenith-residence-yellow-entrance-portico.jpg", caption: "Framed entrance portico with vibrant yellow portal and teak door", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F03-zenith-residence-street-elevation-evening.jpg?alt=media&token=03-zenith-residence-street-elevation-evening.jpg", caption: "Illuminated evening street elevation showing fair-faced concrete and privacy screens", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F04-zenith-residence-concrete-framing-canopy.jpg?alt=media&token=04-zenith-residence-concrete-framing-canopy.jpg", caption: "Geometric concrete frame canopy surrounded by tropical foliage", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F05-zenith-residence-timber-louver-balcony-detail.jpg?alt=media&token=05-zenith-residence-timber-louver-balcony-detail.jpg", caption: "Balcony detail with vertical teak slats, planter boxes, and concrete soffit", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F06-zenith-residence-buddha-water-court-portal.jpg?alt=media&token=06-zenith-residence-buddha-water-court-portal.jpg", caption: "Arrival entrance alcove with yellow accent portal and serene sculpture", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F07-zenith-residence-double-height-atrium-chandeliers.jpg?alt=media&token=07-zenith-residence-double-height-atrium-chandeliers.jpg", caption: "Internal courtyard with lush tropical planters and vertical timber screens", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F08-zenith-residence-courtyard-indoor-planters.jpg?alt=media&token=08-zenith-residence-courtyard-indoor-planters.jpg", caption: "Internal courtyard with lush tropical planters and vertical timber screens", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F11-zenith-residence-atrium-living-garden-view.jpg?alt=media&token=11-zenith-residence-atrium-living-garden-view.jpg", caption: "Living area looking out towards internal court garden and floor-to-ceiling glass", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F12-zenith-residence-chandelier-lightwell-upward.jpg?alt=media&token=12-zenith-residence-chandelier-lightwell-upward.jpg", caption: "Vertical perspective looking up through the suspended tube chandeliers", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F13-zenith-residence-formal-living-marble-tables.jpg?alt=media&token=13-zenith-residence-formal-living-marble-tables.jpg", caption: "Formal seating area framed by marble tables and courtyard backdrop", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F15-zenith-residence-upper-corridor-bridge-overlook.jpg?alt=media&token=15-zenith-residence-upper-corridor-bridge-overlook.jpg", caption: "Upper corridor glazed bridge overlooking central atrium light well", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F17-zenith-residence-ensuite-jacuzzi-timber-wall.jpg?alt=media&token=17-zenith-residence-ensuite-jacuzzi-timber-wall.jpg", caption: "Ensuite bath sanctuary with sunken tub, black marble, and timber screen", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F18-zenith-residence-dining-pavilion-marble-table.jpg?alt=media&token=18-zenith-residence-dining-pavilion-marble-table.jpg", caption: "Open dining pavilion with Italian marble dining table and pendant light", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F19-zenith-residence-contemporary-kitchen-island.jpg?alt=media&token=19-zenith-residence-contemporary-kitchen-island.jpg", caption: "Modern open kitchen with fluted charcoal cabinetry and quartz island counter", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F20-zenith-residence-foyer-entrance-chevron-door.jpg?alt=media&token=20-zenith-residence-foyer-entrance-chevron-door.jpg", caption: "Foyer arrival threshold with chevron-carved teak door and water channel steps", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F21-zenith-residence-master-suite-chinoiserie-bed.jpg?alt=media&token=21-zenith-residence-master-suite-chinoiserie-bed.jpg", caption: "Master suite with bespoke botanical accent wall and low platform bed", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F22-zenith-residence-master-suite-reading-lounge.jpg?alt=media&token=22-zenith-residence-master-suite-reading-lounge.jpg", caption: "Master bedroom reading lounge with plush terracotta armchair and full-height glazing", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F24-zenith-residence-atrium-aerial-top-down-view.jpg?alt=media&token=24-zenith-residence-atrium-aerial-top-down-view.jpg", caption: "Aerial perspective looking down into the landscaped courtyard through glass pendants", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F26-zenith-residence-corner-facade-cantilever-box.jpg?alt=media&token=26-zenith-residence-corner-facade-cantilever-box.jpg", caption: "Corner facade detail showing dramatic upper cantilevered box and entrance volume", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F27-zenith-residence-entry-gate-lush-landscape.jpg?alt=media&token=27-zenith-residence-entry-gate-lush-landscape.jpg", caption: "Entry courtyard framed by lush perimeter greenery and fair-faced concrete walls", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F28-zenith-residence-rooftop-terrace-deck-dusk.jpg?alt=media&token=28-zenith-residence-rooftop-terrace-deck-dusk.jpg", caption: "Rooftop deck at dusk with ambient lit planter seating and skyline panorama", aspect: "landscape" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F29-zenith-residence-rooftop-bar-pergola-canopy.jpg?alt=media&token=29-zenith-residence-rooftop-bar-pergola-canopy.jpg", caption: "Terrace bar pavilion with curved micro-concrete plinth and geometric pergola", aspect: "portrait" },
      { url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmantle-buildofy%2F30-zenith-residence-terrace-garden-lounge-nook.jpg?alt=media&token=30-zenith-residence-terrace-garden-lounge-nook.jpg", caption: "Rooftop garden lounge corner with designer outdoor seating and tropical plants", aspect: "portrait" },
    ],
    servicesInvolved: ["Architecture", "Interior Architecture", "Landscape Design"],
    teamMembers: ["Ar. Rajesh Shivaram", "Vikramaditya Shenoy", "Naveen Prasad"],
    credits: {
      principalArchitect: "Ar. Rajesh Shivaram",
      projectArchitect: "Techno Architecture",
      projectLead: "Techno Architecture",
      team: "Techno Architecture Studio Team",
      photography: "Shamanth Patil Photography",
    },
    featured: false,
    relatedSlugs: ["aikya", "between-two-trees", "far-site-buildofy"],
    videoTour: {
      title: "The Mantle | Main Video Review 2",
      url: "https://www.youtube.com/results?search_query=The+Mantle+Techno+Architecture+Review",
      platform: "Buildofy",
      actionText: "Watch Video Review",
    },
    testimonial: {
      quote: "The sculptural facade and tactile materiality established by Techno Architecture made this commission a flagship architectural landmark in Bengaluru. Featured on Buildofy, it is an absolute masterpiece.",
      clientName: "Pradeep & Shweta Nair",
      designation: "Patrons",
      company: "The Mantle Residence",
    },
  },
  {
    id: "proj-13",
    slug: "echoes-of-nirvana",
    title: "ECHOES OF NIRVANA",
    category: "Residential",
    status: "completed",
    location: "Bengaluru, India",
    year: 2024,
    client: "Private Residential Client",
    area: "7,800 sq.ft",
    description: "A contemplative residential sanctuary balancing bold fair-faced concrete cantilevers with textured granite masonry, sheltered open-to-sky verandas, and double-height light courts.",
    processNarrative: "Echoes of Nirvana is envisioned as a timeless dwelling that breathes in sync with Bengaluru's tropical microclimate. Defined by sweeping exposed concrete roof slabs under-clad in rich teak timber, the residence alternates between monumental masonry walls and transparent glazed apertures. Deep cantilevered overhangs shade the internal living pavilions from direct solar gain while an elevated timber veranda merges outdoor lounge seating with lush perimeter foliage and sculptural lightwells.",
    mainImage: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fechoes-of-nirvana%2Fechoes-of-nirvana-cantilever-sky-elevation.jpg?alt=media&token=echoes-of-nirvana-cantilever-sky-elevation.jpg",
    gallery: [
      {
        url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fechoes-of-nirvana%2Fechoes-of-nirvana-cantilever-sky-elevation.jpg?alt=media&token=echoes-of-nirvana-cantilever-sky-elevation.jpg",
        caption: "Signature exterior cantilevered concrete roof slabs under-clad in warm teak timber against the open sky",
        aspect: "landscape",
      },
      {
        url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fechoes-of-nirvana%2Fechoes-of-nirvana-stone-clad-courtyard.jpg?alt=media&token=echoes-of-nirvana-stone-clad-courtyard.jpg",
        caption: "Courtyard composition highlighting coursed granite masonry, raw concrete soffits, and tropical broadleaf landscaping",
        aspect: "landscape",
      },
      {
        url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fechoes-of-nirvana%2Fechoes-of-nirvana-double-height-living-atrium.jpg?alt=media&token=echoes-of-nirvana-double-height-living-atrium.jpg",
        caption: "Dramatic double-height living atrium with reflective Tom Dixon style copper and chrome cluster pendant light installation",
        aspect: "portrait",
      },
      {
        url: "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fechoes-of-nirvana%2Fechoes-of-nirvana-timber-veranda-lounge.jpg?alt=media&token=echoes-of-nirvana-timber-veranda-lounge.jpg",
        caption: "Covered outdoor veranda and terrace lounge framed by a slatted timber ceiling, designer seating, and flourishing gardens",
        aspect: "landscape",
      },
    ],
    servicesInvolved: [
      "Architectural Design",
      "Interior Architecture",
      "Landscape Architecture",
      "Lighting & Materiality Strategy",
    ],
    teamMembers: [
      "Ar. Rajesh Shivaram",
      "Technoarchitecture Design Studio",
    ],
    credits: {
      principalArchitect: "Ar. Rajesh Shivaram",
      projectArchitect: "Techno Architecture",
      projectLead: "Techno Architecture Studio Team",
      team: "Ar. Rajesh Shivaram & Studio Team",
      photography: "Shamanth Patil Photography",
      landscapeArchitect: "Verdant Studio",
      lightingConsultant: "Lumen Praxis",
    },
    featured: true,
    relatedSlugs: ["the-mantle", "aikya", "kanasu", "between-two-trees"],
    testimonial: {
      quote: "Echoes of Nirvana captures tranquility and architectural discipline in equal measure. The cantilevered forms and open verandas create an enduring sanctuary for our family.",
      clientName: "Private Client",
      designation: "Homeowner",
      company: "Echoes of Nirvana Residence",
    },
  },
{
  "id": "proj-ongoing-1",
  "slug": "jagan-residence",
  "title": "JAGAN RESIDENCE",
  "category": "Residential",
  "status": "ongoing",
  "location": "Bengaluru, India",
  "year": 2026,
  "client": "Jagan & Family",
  "area": "5,800 sq.ft",
  "description": "A bold residential composition characterized by dramatic cantilevers, textured concrete, and warm timber screening designed for seamless indoor-outdoor living.",
  "processNarrative": "Currently under construction in Bengaluru, the Jagan Residence explores interlocking geometric forms that balance privacy from the streetscape with open, light-filled internal courtyards and terrace gardens.",
  "mainImage": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fjagan-residence%2Felevation-front.jpg?alt=media&token=elevation-front.jpg",
  "gallery": [
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fjagan-residence%2Felevation-front.jpg?alt=media&token=elevation-front.jpg",
      "caption": "Front elevation contemporary facade render",
      "aspect": "full"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fjagan-residence%2Fperspective-view.jpg?alt=media&token=perspective-view.jpg",
      "caption": "Perspective architectural view",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fjagan-residence%2Fdetail-view.jpg?alt=media&token=detail-view.jpg",
      "caption": "Architectural detail and fenestration render",
      "aspect": "portrait"
    }
  ],
  "servicesInvolved": [
    "Architectural Design",
    "Structural Engineering",
    "Landscape Architecture"
  ],
  "teamMembers": [
    "Ar. Rajesh Shivaram",
    "Technoarchitecture Design Studio"
  ],
  "credits": {
    "principalArchitect": "Ar. Rajesh Shivaram",
    "projectArchitect": "Technoarchitecture Studio",
    "team": "Ar. Rajesh Shivaram & Studio Team",
    "landscapeArchitect": "Verdant Studio",
    "lightingConsultant": "Lumen Praxis",
    "generalContractor": "Apex Buildtech Projects"
  },
  "featured": true,
  "relatedSlugs": [
    "anandam-residence",
    "suhas-residence",
    "aikya"
  ]
},
{
  "id": "proj-ongoing-2",
  "slug": "anandam-residence",
  "title": "ANANDAM RESIDENCE",
  "category": "Residential",
  "status": "ongoing",
  "location": "RR Nagar, Bengaluru, India",
  "year": 2026,
  "client": "Private Client",
  "area": "6,500 sq.ft",
  "description": "An evocative contemporary home featuring deep roof overhangs, rhythmic vertical louvers, and atmospheric ambient lighting in Rajarajeshwari Nagar.",
  "processNarrative": "Designed with climate-responsive tropical modernist sensibilities, Anandam integrates natural cross-ventilation, shaded verandas, and panoramic fenestrations that capture shifting daytime light and dramatic dusk illumination.",
  "mainImage": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fanandam-residence%2Fexterior-day.jpg?alt=media&token=exterior-day.jpg",
  "gallery": [
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fanandam-residence%2Fexterior-day.jpg?alt=media&token=exterior-day.jpg",
      "caption": "Daytime exterior facade view in RR Nagar",
      "aspect": "full"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fanandam-residence%2Fexterior-dusk.jpg?alt=media&token=exterior-dusk.jpg",
      "caption": "Dusk illumination architectural render",
      "aspect": "full"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fanandam-residence%2Fdusk-angle-view.jpg?alt=media&token=dusk-angle-view.jpg",
      "caption": "Angled dusk perspective showing volumetric balance",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fanandam-residence%2Fdusk-palette-view.jpg?alt=media&token=dusk-palette-view.jpg",
      "caption": "Natural ambient dusk view",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fanandam-residence%2Fdusk-composition.jpg?alt=media&token=dusk-composition.jpg",
      "caption": "Volumetric dusk composition and warm interior glow",
      "aspect": "full"
    }
  ],
  "servicesInvolved": [
    "Architectural Design",
    "Interior Architecture",
    "Lighting Design"
  ],
  "teamMembers": [
    "Ar. Rajesh Shivaram",
    "Technoarchitecture Design Studio"
  ],
  "credits": {
    "principalArchitect": "Ar. Rajesh Shivaram",
    "projectArchitect": "Technoarchitecture Studio",
    "team": "Ar. Rajesh Shivaram & Studio Team",
    "landscapeArchitect": "Technoarchitecture Landscape",
    "lightingConsultant": "Lumen Praxis",
    "generalContractor": "Techno Construction"
  },
  "featured": true,
  "relatedSlugs": [
    "jagan-residence",
    "sneha-residence",
    "belaku"
  ]
},
{
  "id": "proj-ongoing-3",
  "slug": "suhas-residence",
  "title": "SUHAS RESIDENCE",
  "category": "Residential",
  "status": "ongoing",
  "location": "Bengaluru, India",
  "year": 2026,
  "client": "Suhas & Family",
  "area": "4,600 sq.ft",
  "description": "A sculptural urban residence balancing monolithic masonry planes with delicate timber lattice work and curated garden portals.",
  "processNarrative": "Suhas Residence addresses dense urban context with an introverted layout focused around private internal daylight shafts, double-height volumes, and lush vertical vegetation.",
  "mainImage": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsuhas-residence%2Fday-elevation.jpg?alt=media&token=day-elevation.jpg",
  "gallery": [
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsuhas-residence%2Fday-elevation.jpg?alt=media&token=day-elevation.jpg",
      "caption": "Daylight facade render showing geometric volumes",
      "aspect": "full"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsuhas-residence%2Fnight-elevation.jpg?alt=media&token=night-elevation.jpg",
      "caption": "Night illumination highlighting textural facade",
      "aspect": "full"
    }
  ],
  "servicesInvolved": [
    "Architectural Design",
    "Interior Architecture",
    "Landscape Integration"
  ],
  "teamMembers": [
    "Ar. Rajesh Shivaram",
    "Technoarchitecture Design Studio"
  ],
  "credits": {
    "principalArchitect": "Ar. Rajesh Shivaram",
    "projectArchitect": "Technoarchitecture Studio",
    "team": "Ar. Rajesh Shivaram & Studio Team",
    "landscapeArchitect": "Verdant Studio",
    "lightingConsultant": "Lumen Praxis",
    "generalContractor": "Apex Buildtech Projects"
  },
  "featured": true,
  "relatedSlugs": [
    "jagan-residence",
    "smrithi-residence",
    "kanasu"
  ]
},
{
  "id": "proj-ongoing-4",
  "slug": "sneha-residence",
  "title": "SNEHA RESIDENCE",
  "category": "Residential",
  "status": "ongoing",
  "location": "Bengaluru, India",
  "year": 2026,
  "client": "Sneha & Family",
  "area": "7,200 sq.ft",
  "description": "An expansive multi-level luxury residence sculpted with floating slabs, extensive glazing, and sheltered garden terraces.",
  "processNarrative": "Featuring interconnected spatial zones, Sneha Residence orchestrates fluid movement between entertainment pavilions, private suites, and landscaped open courts with meticulous material craft.",
  "mainImage": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsneha-residence%2Felevation-b.jpg?alt=media&token=elevation-b.jpg",
  "gallery": [
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsneha-residence%2Felevation-b.jpg?alt=media&token=elevation-b.jpg",
      "caption": "Volumetric residential elevation render",
      "aspect": "full"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsneha-residence%2Felevation-c.jpg?alt=media&token=elevation-c.jpg",
      "caption": "Facade articulation and screening",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsneha-residence%2Felevation-d.jpg?alt=media&token=elevation-d.jpg",
      "caption": "Garden and entrance portal view",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsneha-residence%2Felevation-04.jpg?alt=media&token=elevation-04.jpg",
      "caption": "Contemporary modern facade detailing",
      "aspect": "portrait"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsneha-residence%2Fexterior-i.jpg?alt=media&token=exterior-i.jpg",
      "caption": "Balcony overhangs and outdoor connectivity",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsneha-residence%2Fexterior-k.jpg?alt=media&token=exterior-k.jpg",
      "caption": "Vertical circulation and fenestration render",
      "aspect": "portrait"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsneha-residence%2Fexterior-m.jpg?alt=media&token=exterior-m.jpg",
      "caption": "Courtyard and ambient lighting perspective",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsneha-residence%2Fexterior-n.jpg?alt=media&token=exterior-n.jpg",
      "caption": "Streetscape architectural perspective",
      "aspect": "landscape"
    }
  ],
  "servicesInvolved": [
    "Architectural Design",
    "Interior Architecture",
    "Landscape Architecture"
  ],
  "teamMembers": [
    "Ar. Rajesh Shivaram",
    "Technoarchitecture Design Studio"
  ],
  "credits": {
    "principalArchitect": "Ar. Rajesh Shivaram",
    "projectArchitect": "Technoarchitecture Studio",
    "team": "Ar. Rajesh Shivaram & Studio Team",
    "landscapeArchitect": "Verdant Studio",
    "lightingConsultant": "Lumen Praxis",
    "generalContractor": "Techno Construction"
  },
  "featured": true,
  "relatedSlugs": [
    "anandam-residence",
    "praana-villas",
    "between-two-trees"
  ]
},
{
  "id": "proj-ongoing-5",
  "slug": "smrithi-residence",
  "title": "SMRITHI RESIDENCE",
  "category": "Residential",
  "status": "ongoing",
  "location": "Bengaluru, India",
  "year": 2026,
  "client": "Private Client",
  "area": "5,400 sq.ft",
  "description": "A refined dwelling celebrating tactile material contrasts \u2014 raw stone plinths, floating timber eaves, and expansive garden apertures.",
  "processNarrative": "Smrithi Residence reinterprets the traditional veranda house through contemporary architectural grammar, featuring cantilevered canopy terraces and climate-moderating passive shading.",
  "mainImage": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsmrithi-residence%2Felevation-main.jpg?alt=media&token=elevation-main.jpg",
  "gallery": [
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsmrithi-residence%2Felevation-main.jpg?alt=media&token=elevation-main.jpg",
      "caption": "Main frontal elevation render",
      "aspect": "full"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsmrithi-residence%2Fperspective-corner.jpg?alt=media&token=perspective-corner.jpg",
      "caption": "Corner volumetric perspective",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsmrithi-residence%2Fterrace-overhang.jpg?alt=media&token=terrace-overhang.jpg",
      "caption": "Cantilevered roof and terrace view",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsmrithi-residence%2Fentry-approach.jpg?alt=media&token=entry-approach.jpg",
      "caption": "Entry approach and landscape integration",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsmrithi-residence%2Fside-elevation.jpg?alt=media&token=side-elevation.jpg",
      "caption": "Lateral facade articulation",
      "aspect": "portrait"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsmrithi-residence%2Frear-terrace.jpg?alt=media&token=rear-terrace.jpg",
      "caption": "Rear elevation and private garden court",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fsmrithi-residence%2Fdusk-render.jpg?alt=media&token=dusk-render.jpg",
      "caption": "Atmospheric dusk lighting render",
      "aspect": "full"
    }
  ],
  "servicesInvolved": [
    "Architectural Design",
    "Interior Architecture",
    "Landscape Architecture"
  ],
  "teamMembers": [
    "Ar. Rajesh Shivaram",
    "Technoarchitecture Design Studio"
  ],
  "credits": {
    "principalArchitect": "Ar. Rajesh Shivaram",
    "projectArchitect": "Technoarchitecture Studio",
    "team": "Ar. Rajesh Shivaram & Studio Team",
    "landscapeArchitect": "Verdant Studio",
    "lightingConsultant": "Lumen Praxis",
    "generalContractor": "Apex Buildtech Projects"
  },
  "featured": true,
  "relatedSlugs": [
    "suhas-residence",
    "ruchi-sharma-residence",
    "aikya"
  ]
},
{
  "id": "proj-ongoing-6",
  "slug": "ruchi-sharma-residence",
  "title": "RUCHI SHARMA RESIDENCE",
  "category": "Residential",
  "status": "ongoing",
  "location": "Bengaluru, India",
  "year": 2026,
  "client": "Ruchi Sharma",
  "area": "4,200 sq.ft",
  "description": "An elegant, bespoke residence defined by earthy tonal palettes, clean rectilinear geometry, and rhythmic exterior screening.",
  "processNarrative": "Designed for a creative client, this residence emphasizes visual connection with nature, crafted brickwork accents, and tranquil micro-courtyards that filter tropical sunlight.",
  "mainImage": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fruchi-sharma-residence%2Felevation-render-01.jpg?alt=media&token=elevation-render-01.jpg",
  "gallery": [
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fruchi-sharma-residence%2Felevation-render-01.jpg?alt=media&token=elevation-render-01.jpg",
      "caption": "Primary elevation render with earthy material textures",
      "aspect": "full"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fruchi-sharma-residence%2Felevation-render-02.jpg?alt=media&token=elevation-render-02.jpg",
      "caption": "Secondary angle showcasing vertical screening",
      "aspect": "landscape"
    }
  ],
  "servicesInvolved": [
    "Architectural Design",
    "Interior Architecture",
    "Lighting Design"
  ],
  "teamMembers": [
    "Ar. Rajesh Shivaram",
    "Technoarchitecture Design Studio"
  ],
  "credits": {
    "principalArchitect": "Ar. Rajesh Shivaram",
    "projectArchitect": "Technoarchitecture Studio",
    "team": "Ar. Rajesh Shivaram & Studio Team",
    "landscapeArchitect": "Verdant Studio",
    "lightingConsultant": "Lumen Praxis",
    "generalContractor": "Techno Construction"
  },
  "featured": true,
  "relatedSlugs": [
    "smrithi-residence",
    "jagan-residence",
    "kripa"
  ]
},
{
  "id": "proj-ongoing-7",
  "slug": "praana-villas",
  "title": "PRAANA VILLAS",
  "category": "Residential",
  "status": "ongoing",
  "location": "Bengaluru, India",
  "year": 2026,
  "client": "Praana Living",
  "area": "18,500 sq.ft",
  "description": "An exclusive enclave of luxury tropical villas centered around shared botanical commons, water pavilions, and private landscaped enclaves.",
  "processNarrative": "Praana Villas creates an integrated community masterplan where each villa orientation maximizes prevailing breezes and solar orientation while looking out onto landscaped community promenades.",
  "mainImage": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fpraana-villas%2Feast-villa-elevation.jpg?alt=media&token=east-villa-elevation.jpg",
  "gallery": [
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fpraana-villas%2Feast-villa-elevation.jpg?alt=media&token=east-villa-elevation.jpg",
      "caption": "East villa elevation with contemporary tropical volumes",
      "aspect": "full"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fpraana-villas%2Fwest-villa-elevation.jpg?alt=media&token=west-villa-elevation.jpg",
      "caption": "West villa elevation featuring climate-responsive overhangs",
      "aspect": "full"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fpraana-villas%2Fcommon-space.jpg?alt=media&token=common-space.jpg",
      "caption": "Central landscaped common space and communal pavilions",
      "aspect": "landscape"
    }
  ],
  "servicesInvolved": [
    "Master Planning",
    "Architectural Design",
    "Landscape Architecture"
  ],
  "teamMembers": [
    "Ar. Rajesh Shivaram",
    "Technoarchitecture Design Studio"
  ],
  "credits": {
    "principalArchitect": "Ar. Rajesh Shivaram",
    "projectArchitect": "Technoarchitecture Studio",
    "team": "Ar. Rajesh Shivaram & Studio Team",
    "landscapeArchitect": "Verdant Studio",
    "lightingConsultant": "Lumen Praxis",
    "generalContractor": "Apex Buildtech Projects"
  },
  "featured": true,
  "relatedSlugs": [
    "sneha-residence",
    "anandam-residence",
    "brindavan"
  ]
},
{
  "id": "proj-ongoing-8",
  "slug": "vidyanidhi-campus",
  "title": "VIDYANIDHI EDUCATIONAL CAMPUS",
  "category": "Commercial",
  "status": "ongoing",
  "location": "Bengaluru, India",
  "year": 2026,
  "client": "Vidyanidhi Education Trust",
  "area": "85,000 sq.ft",
  "description": "A forward-thinking educational campus characterized by cantilevered rectilinear volumes, terracotta reveals, expressive V-pilotis, and shaded communal breezeway plazas that foster interactive learning.",
  "processNarrative": "Conceived as an academic ecosystem rather than a monolithic institution, Vidyanidhi Campus elevates classroom blocks on angled pilotis to liberate the ground plane for open-air amphitheaters, shaded courts, and cross-ventilated gathering plazas. Terracotta louvers regulate solar gain while maintaining visual connection with surrounding green corridors.",
  "mainImage": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fvidyanidhi-campus%2Fvidyanidhi-atrium-dusk-cantilever.jpg?alt=media&token=vidyanidhi-atrium-dusk-cantilever.jpg",
  "gallery": [
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fvidyanidhi-campus%2Fvidyanidhi-atrium-dusk-cantilever.jpg?alt=media&token=vidyanidhi-atrium-dusk-cantilever.jpg",
      "caption": "Dusk illumination of the elevated cantilevered academic wings and central light-filled atrium",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fvidyanidhi-campus%2Fvidyanidhi-courtyard-facade-elevation.jpg?alt=media&token=vidyanidhi-courtyard-facade-elevation.jpg",
      "caption": "Geometric facade elevation highlighting rhythm of terracotta reveals and angled V-pilotis",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fvidyanidhi-campus%2Fvidyanidhi-cantilever-entrance-plaza.jpg?alt=media&token=vidyanidhi-cantilever-entrance-plaza.jpg",
      "caption": "Main entrance plaza featuring shaded landscaped steps and stepped seating breezeway",
      "aspect": "landscape"
    }
  ],
  "servicesInvolved": [
    "Campus Master Planning",
    "Architectural Design",
    "Structural Expression",
    "Sustainable Engineering"
  ],
  "teamMembers": [
    "Ar. Rajesh Shivaram",
    "Technoarchitecture Design Studio"
  ],
  "credits": {
    "principalArchitect": "Ar. Rajesh Shivaram",
    "projectArchitect": "Technoarchitecture Studio",
    "team": "Ar. Rajesh Shivaram & Studio Team",
    "structuralEngineer": "Base Consultants",
    "mepConsultant": "Synergy MEP Systems",
    "landscapeArchitect": "Verdant Studio",
    "lightingConsultant": "Lumen Praxis"
  },
  "featured": true,
  "relatedSlugs": [
    "maddur-commercial-retreat",
    "urvi-commercial-hub",
    "prana-commercial-commons"
  ]
},
{
  "id": "proj-ongoing-9",
  "slug": "maddur-commercial-retreat",
  "title": "MADDUR COMMERCIAL & WELLNESS RETREAT",
  "category": "Commercial",
  "status": "ongoing",
  "location": "Maddur, Karnataka, India",
  "year": 2026,
  "client": "Maddur Agri-Tourism & Wellness Ventures",
  "area": "120,000 sq.ft (12-Acre Master Plan)",
  "description": "A comprehensive 12-acre master-planned commercial and agro-wellness retreat featuring 32 integrated zones including reception pavilions, eco-villas, open-air amphitheaters, bio-ponds, and wellness commons.",
  "processNarrative": "The Maddur master plan synthesizes agrarian landscapes with contemporary vernacular hospitality architecture. Anchored by a monolithic arched portal and curved bamboo welcome pavilion, the design arranges private wellness suites, all-day dining decks, and recreation zones along natural water rills and bio-retention ponds, celebrating Karnataka's rural topography.",
  "mainImage": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmaddur-retreat%2Fmaddur-entrance-pavilion.jpg?alt=media&token=maddur-entrance-pavilion.jpg",
  "gallery": [
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmaddur-retreat%2Fmaddur-entrance-pavilion.jpg?alt=media&token=maddur-entrance-pavilion.jpg",
      "caption": "Grand entrance portal and arched welcome pavilion with reflecting lotus pool at dusk",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmaddur-retreat%2Fmaddur-master-plan-layout.jpg?alt=media&token=maddur-master-plan-layout.jpg",
      "caption": "Comprehensive 32-zone master plan layout encompassing wellness suites, sports commons, and bio-lakes",
      "aspect": "full"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fmaddur-retreat%2Fmaddur-wellness-lagoon.jpg?alt=media&token=maddur-wellness-lagoon.jpg",
      "caption": "Elevated bamboo dining pavilion and boardwalk overlooking natural bio-lagoon",
      "aspect": "landscape"
    }
  ],
  "servicesInvolved": [
    "Master Planning",
    "Eco-Hospitality Architecture",
    "Landscape Urbanism",
    "Vernacular Engineering"
  ],
  "teamMembers": [
    "Ar. Rajesh Shivaram",
    "Technoarchitecture Design Studio"
  ],
  "credits": {
    "principalArchitect": "Ar. Rajesh Shivaram",
    "projectArchitect": "Technoarchitecture Studio",
    "team": "Ar. Rajesh Shivaram & Studio Team",
    "landscapeUrbanist": "Verdant Studio",
    "lightingConsultant": "Lumen Praxis",
    "sustainabilityConsultant": "Green Terra Systems"
  },
  "featured": true,
  "relatedSlugs": [
    "vidyanidhi-campus",
    "urvi-commercial-hub",
    "praana-villas"
  ]
},
{
  "id": "proj-ongoing-10",
  "slug": "urvi-commercial-hub",
  "title": "URVI COMMERCIAL HUB",
  "category": "Commercial",
  "status": "ongoing",
  "location": "Bengaluru, India",
  "year": 2026,
  "client": "Urvi Retail & Infrastructure Ltd.",
  "area": "42,000 sq.ft",
  "description": "A boutique urban commercial destination fusing fair-faced board-marked concrete massing with warm teak brise-soleil, biophilic cantilevered gardens, and ground-level luxury retail colonnades.",
  "processNarrative": "URVI redefines the contemporary commercial street edge in Bengaluru. By carving stepped volumetric recesses and deep cantilevered overhangs, the structure introduces passive solar protection while creating dramatic multi-story vertical gardens. The interior features a central biophilic lightwell that brings natural daylight down through every level of workspace and gallery retail.",
  "mainImage": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Furvi-commercial%2Furvi-facade-dusk.jpg?alt=media&token=urvi-facade-dusk.jpg",
  "gallery": [
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Furvi-commercial%2Furvi-facade-dusk.jpg?alt=media&token=urvi-facade-dusk.jpg",
      "caption": "Twilight facade view featuring rhythmic board-formed concrete volumes, teak louvers, and retail showcase",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Furvi-commercial%2Furvi-atrium-terrace.jpg?alt=media&token=urvi-atrium-terrace.jpg",
      "caption": "Triple-height skylit biophilic central atrium with floating stairs and lush interior planting",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Furvi-commercial%2Furvi-retail-plaza.jpg?alt=media&token=urvi-retail-plaza.jpg",
      "caption": "Pedestrian entrance colonnade with cantilevered waffle slab, dark bronze glazing, and reflecting water feature",
      "aspect": "landscape"
    }
  ],
  "servicesInvolved": [
    "Commercial Architecture",
    "Facade Engineering",
    "Interior Architecture",
    "Biophilic Workplace Design"
  ],
  "teamMembers": [
    "Ar. Rajesh Shivaram",
    "Technoarchitecture Design Studio"
  ],
  "credits": {
    "principalArchitect": "Ar. Rajesh Shivaram",
    "projectArchitect": "Technoarchitecture Studio",
    "team": "Ar. Rajesh Shivaram & Studio Team",
    "facadeConsultant": "Glass & Steel Engineering",
    "landscapeArchitect": "Verdant Studio",
    "lightingConsultant": "Lumen Praxis"
  },
  "featured": true,
  "relatedSlugs": [
    "vidyanidhi-campus",
    "prana-commercial-commons",
    "maddur-commercial-retreat"
  ]
},
{
  "id": "proj-ongoing-11",
  "slug": "prana-commercial-commons",
  "title": "PRAANA COMMERCIAL COMMONS",
  "category": "Commercial",
  "status": "ongoing",
  "location": "Bengaluru, India",
  "year": 2026,
  "client": "Praana Commercial Developments",
  "area": "68,000 sq.ft",
  "description": "An innovative commercial campus balancing sculpted raw concrete architecture with perforated brass sunscreens, verdant courtyard promenades, and an expansive rooftop collaborative pavilion.",
  "processNarrative": "Designed around the ethos of well-being in the modern workspace, Praana Commercial Commons alternates enclosed high-performance office floors with semi-open landscaped meeting decks and perimeter reflection pools. Jali-inspired perforated brass screens modulate daylight while maintaining high transparency to the surrounding cityscape.",
  "mainImage": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fprana-commercial%2Fprana-commercial-facade.jpg?alt=media&token=prana-commercial-facade.jpg",
  "gallery": [
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fprana-commercial%2Fprana-commercial-facade.jpg?alt=media&token=prana-commercial-facade.jpg",
      "caption": "Golden hour perspective of the staggered concrete volumes, brass battens, and landscaped perimeter water rills",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fprana-commercial%2Fprana-plaza-promenade.jpg?alt=media&token=prana-plaza-promenade.jpg",
      "caption": "Pedestrian courtyard promenade featuring perforated brass sunscreens, water features, and meeting pergolas",
      "aspect": "landscape"
    },
    {
      "url": "https://firebasestorage.googleapis.com/v0/b/technoarchitecture-7d718.firebasestorage.app/o/projects%2Fprana-commercial%2Fprana-rooftop-pavilion.jpg?alt=media&token=prana-rooftop-pavilion.jpg",
      "caption": "Panoramic rooftop collaborative pavilion and sky lounge framed by cantilevered steel-and-teak pergola",
      "aspect": "landscape"
    }
  ],
  "servicesInvolved": [
    "Master Planning",
    "Commercial Architecture",
    "Workplace Strategy",
    "Landscape Architecture"
  ],
  "teamMembers": [
    "Ar. Rajesh Shivaram",
    "Technoarchitecture Design Studio"
  ],
  "credits": {
    "principalArchitect": "Ar. Rajesh Shivaram",
    "projectArchitect": "Technoarchitecture Studio",
    "team": "Ar. Rajesh Shivaram & Studio Team",
    "structuralEngineer": "Base Consultants",
    "landscapeArchitect": "Verdant Studio",
    "lightingConsultant": "Lumen Praxis"
  },
  "featured": true,
  "relatedSlugs": [
    "urvi-commercial-hub",
    "vidyanidhi-campus",
    "praana-villas"
  ]
}
];
