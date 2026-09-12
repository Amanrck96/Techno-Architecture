export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  image: string;
  process: {
    step: string;
    title: string;
    description: string;
  }[];
  deliverables: string[];
  relatedProjectSlugs: string[];
}

export const initialServices: Service[] = [
  {
    id: "serv-1",
    slug: "architectural-design",
    title: "ARCHITECTURAL DESIGN",
    shortDescription: "Bespoke residential, commercial, and civic architecture characterized by tectonic clarity, geometric purity, and context sensitivity.",
    detailedDescription: "Our primary discipline centers on the creation of enduring architectural forms. We believe that true luxury lies in restraint, generous volume, the intentional choreography of natural light, and the honest expression of materials such as fair-faced concrete, regional stone, and mass timber.",
    image: "/projects/aikya/elevation-east.jpg",
    process: [
      { step: "01", title: "Context & Site Ecology", description: "In-depth solar path, microclimate, topographical, and zoning analysis to anchor the form." },
      { step: "02", title: "Conceptual Massing & Tectonics", description: "Exploration through physical wood models, spatial sketches, and computational solar testing." },
      { step: "03", title: "Design Development & BIM", description: "High-precision 3D coordination integrating structural, MEP, and envelope details." },
      { step: "04", title: "Construction Administration", description: "Rigorous on-site review ensuring formwork precision, material finishes, and execution integrity." },
    ],
    deliverables: [
      "Site Feasibility & Microclimate Report",
      "Conceptual Master Sketches & 3D Spatial Models",
      "Statutory Approval & Permit Documentation Sets",
      "Comprehensive Architectural Working Drawings & Detailing",
      "Periodic On-Site Architectural Supervision & Quality Audits",
    ],
    relatedProjectSlugs: ["aikya", "between-two-trees", "kanasu", "zenith-residence"],
  },
  {
    id: "serv-2",
    slug: "interior-architecture",
    title: "INTERIOR ARCHITECTURE",
    shortDescription: "Seamless spatial transitions, custom architectural millwork, crafted material palettes, and bespoke atmosphere.",
    detailedDescription: "We do not treat interiors as mere decoration applied over structure. For Techno, interior architecture is an unbroken continuation of the exterior language. We sculpt internal partitions, customize joinery, select artisanal textiles, and embed indirect luminaires that gently reveal the texture of lime plaster, smoked oak, and natural basalt.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85",
    process: [
      { step: "01", title: "Spatial Programming & Circulation", description: "Mapping daily living rhythms, sightlines, acoustics, and acoustic privacy zones." },
      { step: "02", title: "Material Tactility Curation", description: "Sourcing bespoke stones, metal patinas, tactile woods, and natural plaster finishes." },
      { step: "03", title: "Bespoke Millwork & Detailing", description: "1:5 scale detailing of custom cabinetry, concealed doors, and integrated lighting channels." },
      { step: "04", title: "Art & Furniture Curation", description: "Collaborating with local artisans, sculptors, and international design houses for tailored pieces." },
    ],
    deliverables: [
      "Comprehensive Interior Layout & Mood Ensembles",
      "Full Interior Elevations & Millwork Shop Drawings",
      "Lighting & Switch Scheduling with Scene Choreography",
      "Material, Fixture, and Sanitaryware Specifications",
      "Art & Object Curation Catalogues",
    ],
    relatedProjectSlugs: ["brindavan", "salut", "far-site-buildofy"],
  },
  {
    id: "serv-3",
    slug: "urban-masterplanning",
    title: "URBAN & MASTERPLANNING",
    shortDescription: "Holistic masterplans balancing dense urban growth, human-scale connectivity, ecological restoration, and civic identity.",
    detailedDescription: "From multi-acre institutional campuses to mixed-use urban enclaves, our urban planning methodology prioritizes pedestrian porosity, native biodiversity corridors, and sustainable infrastructure. We design masterplans that are resilient to climate shifts and promote vibrant communal culture.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    process: [
      { step: "01", title: "Ecological Baseline & Watershed", description: "Mapping natural aquifers, tree surveys, wind channels, and regional transport nodes." },
      { step: "02", title: "Framework & Density Strategy", description: "Developing flexible FAR distribution, public green spines, and active ground-floor edges." },
      { step: "03", title: "Phaseable Phasing Guidelines", description: "Establishing architectural design guidelines, material codes, and infrastructure corridors." },
    ],
    deliverables: [
      "Master Land-Use & Phasing Strategies",
      "Pedestrian & Transit Network Optimization",
      "Regenerative Stormwater & Wetland Master Plans",
      "Architectural Design Guidelines & Urban Codes",
    ],
    relatedProjectSlugs: ["aikya", "kripa"],
  },
  {
    id: "serv-4",
    slug: "sustainable-net-zero",
    title: "SUSTAINABLE & NET-ZERO DESIGN",
    shortDescription: "Passive solar engineering, low-embodied carbon materiality, energy autonomy, and regenerative water cycles.",
    detailedDescription: "Sustainability is fundamentally embedded in Techno's DNA rather than an afterthought. By employing passive building physics—orientation, self-shading envelopes, stack ventilation, and high-mass envelopes—we drastically cut active cooling and heating loads before integrating clean energy generation.",
    image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=85",
    process: [
      { step: "01", title: "Microclimatic & Daylight Simulation", description: "Computational solar radiation mapping and computational fluid dynamics (CFD) airflow." },
      { step: "02", title: "Embodied Carbon Lifecycle Assessment", description: "Prioritizing local stone, mass timber, and low-clinker concretes over intensive metals." },
      { step: "03", title: "Renewable & Closed-Loop Integration", description: "Integrating building-integrated photovoltaics (BIPV) and greywater biological reed beds." },
    ],
    deliverables: [
      "Energy Performance & Thermal Comfort Simulations",
      "Embodied & Operational Carbon Audit Reports",
      "LEED / GRIHA / WELL Platinum Certification Support",
      "Passive Shading & Natural Ventilation Engineering Guides",
    ],
    relatedProjectSlugs: ["kripa", "between-two-trees", "belaku"],
  },
  {
    id: "serv-5",
    slug: "heritage-adaptive-reuse",
    title: "HERITAGE & ADAPTIVE REUSE",
    shortDescription: "Sensitive conservation and transformative modern interventions within historically significant architectural fabrics.",
    detailedDescription: "We breathe fresh contemporary vitality into heritage structures while revering their historical memory. Our interventions create an invigorating dialogue between old craftsmanship and modern architectural precision.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85",
    process: [
      { step: "01", title: "Archaeological & Structural Survey", description: "Detailed 3D point-cloud laser scanning and non-destructive material degradation testing." },
      { step: "02", title: "Conservation & Structural Stabilization", description: "Traditional lime mortar consolidation, timber repair, and seismic reinforcement." },
      { step: "03", title: "Contemporary Insertion", description: "Inserting light-touch steel, glass, and bespoke cabinetry that clearly distinguishes the new from the old." },
    ],
    deliverables: [
      "Heritage Documentation & Point-Cloud Scans",
      "Restoration Methodology Reports",
      "Adaptive Reuse Feasibility & Permitting Sets",
      "Craftsman Specifications & Lime Masonry Protocols",
    ],
    relatedProjectSlugs: ["brindavan", "house-in-the-air"],
  },
  {
    id: "serv-6",
    slug: "bim-project-management",
    title: "BIM & PROJECT COORDINATION",
    shortDescription: "Full Level-2 BIM workflows, clash detection, parametric schedules, and precision construction delivery.",
    detailedDescription: "Complex architectural ideas require uncompromising technical execution. We manage projects using multi-disciplinary BIM platforms that detect clashes, calculate exact material quantities, and give clients total transparency from initial concept to handover.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=85",
    process: [
      { step: "01", title: "Federated 3D BIM Modeling", description: "Integrating architectural, structural, and MEP engineering in a single cloud model." },
      { step: "02", title: "Clash Resolution & Value Engineering", description: "Pre-empting site discrepancies to minimize contractor change-orders and delays." },
      { step: "03", title: "4D Construction Scheduling & Cost", description: "Tracking physical progress against virtual construction milestones in real time." },
    ],
    deliverables: [
      "Federated Level-2 BIM Models (Revit / IFC)",
      "Automated Clash Detection & Coordination Matrices",
      "Parametric Bill of Quantities (BOQ)",
      "Site Execution Protocol Guides & As-Built Verification",
    ],
    relatedProjectSlugs: ["kanasu", "kripa", "belaku"],
  },
];
