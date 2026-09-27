export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "Spatial Theory" | "Materiality" | "Sustainability" | "Monographs" | "Urbanism";
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readingTime: string;
  heroImage: string;
  featured: boolean;
  content: {
    introduction: string;
    sections: {
      heading: string;
      body: string[];
      quote?: string;
    }[];
    conclusion: string;
  };
  tags: string[];
  relatedSlugs: string[];
}

export const initialBlogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "monolithic-concrete-tropical-context",
    title: "Monolithic Concrete in Tropical Microclimates: The Poetics of Board-Formed Restraint",
    excerpt: "Exploring the tectonic and thermodynamic realities of cast-in-place concrete under South Indian monsoons and intense solar radiation.",
    category: "Materiality",
    author: {
      name: "Ar. Rajesh Shivaram",
      role: "Principal Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    },
    publishedAt: "2024-08-14",
    readingTime: "7 min read",
    heroImage: "/projects/aikya/elevation-evening.jpg",
    featured: true,
    content: {
      introduction: "Concrete in contemporary South Asian architecture is frequently misunderstood as a purely brutalist gesture. Yet, when modulated with regional awareness, board-formed concrete functions as an extraordinary climatic regulator, gathering cool night air and releasing it slowly across sweltering daylight hours.",
      sections: [
        {
          heading: "The Dialogue Between Formwork and Finish",
          body: [
            "At Monolith House, our primary challenge was giving emotional warmth to cast walls without applying superficial cladding. We collaborated with regional timber yards to reclaim untreated pine boards with pronounced grain patterns. As the slurry settled, the wood sap and knots imparted an organic, tactile grain that softens the massive planes.",
            "The concrete mix itself integrated 35% fly ash—an industrial by-product that not only reduces the carbon footprint of cement clinker but produces a denser matrix resistant to tropical water ingress during torrential monsoon seasons."
          ],
          quote: "Architecture is not merely the envelope that contains space; it is the atmospheric medium that filters light, breeze, and the memory of time."
        },
        {
          heading: "Courtyards as Thermodynamic Engines",
          body: [
            "A monolithic structure without intentional voids risks becoming an impenetrable heat trap. By hollowing the core with a deep basalt-lined sunken courtyard, we activated natural stack ventilation. Warmer air rises along the inner concrete clerestory and exhausts through continuous shadow-line vents, pulling cooler air across the ground-floor water body.",
            "This simple physical mechanism maintains indoor ambient temperatures at 24°C to 26°C even when outdoor temperatures climb above 35°C in mid-April."
          ]
        }
      ],
      conclusion: "When we treat concrete not as an industrial default but as liquid stone carved by timber and sun, architecture ceases to be an imposition on landscape—it becomes an organic extension of regional geology."
    },
    tags: ["Concrete", "Thermal Mass", "Tropical Architecture", "Passive Design"],
    relatedSlugs: ["mass-timber-future-commercial", "sacred-geometry-light"],
  },
  {
    id: "blog-2",
    slug: "mass-timber-future-commercial",
    title: "Mass Timber in the Subtropics: Overcoming Humidity, Termites, and Tradition",
    excerpt: "How engineered glulam and cross-laminated timber (CLT) are pioneering carbon-negative commercial spaces in Bengaluru's tech corridors.",
    category: "Sustainability",
    author: {
      name: "Vikramaditya Shenoy",
      role: "Partner & Urbanist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    publishedAt: "2024-06-20",
    readingTime: "9 min read",
    heroImage: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=85",
    featured: true,
    content: {
      introduction: "For decades, commercial construction in India has been synonymous with steel frames and glass curtain walls. However, the operational and embodied carbon penalties of these materials are no longer tenable. Our work on Timber Terrace proves that mass timber is both climatically viable and economically competitive.",
      sections: [
        {
          heading: "Engineered Timber vs. Humid Climates",
          body: [
            "The prevailing myth against timber in peninsular India is rapid decay due to monsoon moisture and subterranean termites. By elevating the structural timber grid onto a 1.2m polished basalt podium, we physically disconnect the organic material from soil-dwelling pests.",
            "Furthermore, non-toxic bio-based silane water-repellent impregnations permit the wood fibers to breathe without absorbing liquid water, maintaining dimensional stability across wet and dry cycles."
          ],
          quote: "A steel beam represents energy consumed; a timber beam represents carbon captured and stored for a century."
        },
        {
          heading: "Biophilic Productivity Gains",
          body: [
            "Beyond carbon balance, the biophilic advantages of exposed structural timber are profound. Sensor tracking in our prototype timber studios documented a 14% drop in baseline employee cortisol levels and measurably improved acoustic clarity compared to reverberant drywall enclosures."
          ]
        }
      ],
      conclusion: "The architectural horizon belongs to hybridized structures where concrete anchors the earth, steel spans the extraordinary, and mass timber warms the human habitat."
    },
    tags: ["Mass Timber", "CLT", "Embodied Carbon", "Commercial Design"],
    relatedSlugs: ["monolithic-concrete-tropical-context", "quiet-thresholds-sacred-space"],
  },
  {
    id: "blog-3",
    slug: "sacred-geometry-light",
    title: "Sacred Geometry & The Controlled Infiltration of Daylighting",
    excerpt: "Choreographing shadows: How calibrated apertures and jali screens transform ordinary domestic volumes into contemplative sanctuaries.",
    category: "Spatial Theory",
    author: {
      name: "Divya Raghavan",
      role: "Director of Interiors",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    },
    publishedAt: "2024-04-11",
    readingTime: "5 min read",
    heroImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85",
    featured: false,
    content: {
      introduction: "In equatorial regions, light is not scarce; it is an overwhelming force that must be tamed, sculpted, and cooled before it enters our private spaces.",
      sections: [
        {
          heading: "The Jali as a Spatial Filter",
          body: [
            "In Shadow House, our aperture placement was determined through solstice simulations. Rather than opening vast unobstructed glazed walls to the west, we deployed custom terracotta perforated modules with a 45-degree angled geometry that blocks direct afternoon sun while admitting soft ambient illumination.",
            "The resulting patterns move across lime-plastered walls like a sundial, reminding inhabitants of the earth's quiet cosmic rotation."
          ],
          quote: "Light does not simply illuminate space; light creates space."
        }
      ],
      conclusion: "By designing with shadow rather than flooding every corner with glare, architecture returns to its primordial duty: offering shelter that restores the soul."
    },
    tags: ["Daylighting", "Jali Screens", "Sacred Geometry", "Atmosphere"],
    relatedSlugs: ["monolithic-concrete-tropical-context"],
  },
  {
    id: "blog-4",
    slug: "restoring-heritage-fabrics",
    title: "The Architecture of Erasure vs. Preservation: Transforming Mid-Century Enclaves",
    excerpt: "Reflections on renovating historic brick fabrics in Bengaluru's Basavanagudi without resorting to nostalgic pastiche.",
    category: "Monographs",
    author: {
      name: "Ar. Rajesh Shivaram",
      role: "Principal Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    },
    publishedAt: "2024-02-28",
    readingTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85",
    featured: false,
    content: {
      introduction: "Basavanagudi is one of Bengaluru's quintessential historical neighborhoods, renowned for its stone rain trees, colonial bungalows, and conservative urban fabric.",
      sections: [
        {
          heading: "Contrast as Respect",
          body: [
            "When we acquired the dilapidated 1960s commercial depot that now houses our principal studio, local advice was unanimous: demolish and build a generic multi-story glass box.",
            "Instead, we chose radical preservation. We stripped away layers of acrylic paint to expose hand-made wire-cut bricks, reinforcing sagging timber rafters with slender black steel flitch plates. The new partitions are deliberately crisp and contemporary: fluted acoustic glass and anodized aluminium that never feigns to be vintage."
          ]
        }
      ],
      conclusion: "Authentic respect for heritage lies in creating an honest, articulate contrast between what was and what is."
    },
    tags: ["Adaptive Reuse", "Basavanagudi", "Heritage Conservation"],
    relatedSlugs: ["monolithic-concrete-tropical-context", "mass-timber-future-commercial"],
  },
];
