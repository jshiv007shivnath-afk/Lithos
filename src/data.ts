import { Course, RockGuide, GeologicLayer, SubscriptionPlan, LiveTourSession } from './types';

export const COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Sedimentology & Stratigraphy',
    instructor: 'Dr. Helen Vance',
    duration: '6 weeks (32 hrs)',
    level: 'Beginner',
    rating: 4.8,
    studentsCount: 1420,
    price: 49,
    description: 'Deconstruct the records of ancient environments written in gravel, sand, mud, and chemical precipitates. Learn to decode historical sea-levels, climate cycles, and tectonic movements.',
    coverImage: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800&auto=format&fit=crop&q=80',
    syllabus: [
      'Introduction to sedimentary processes and transport mechanics',
      'Classification of siliciclastic and carbonate rocks',
      'Depositional systems: Fluvial, deltaic, glacial, and deep marine',
      'Principles of stratigraphy and geological time correlation',
      'Facies modeling and sequence stratigraphic analysis',
      'Practical lab: Analyzing core samples and cross-sections'
    ]
  },
  {
    id: 'course-2',
    title: 'Deep Earth Geodynamics',
    instructor: 'Prof. Marcus Sterling',
    duration: '8 weeks (45 hrs)',
    level: 'Advanced',
    rating: 4.9,
    studentsCount: 940,
    price: 89,
    description: 'Explore mantle convection, lithosphere dynamics, subduction zone mechanics, and thermal plume cycles that shape continents and fuel the planetary engine.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    syllabus: [
      'Earth’s interior thermodynamics and gravity fields',
      'Rheology of the lithosphere and upper mantle flow dynamics',
      'Forces driving plate motion and mechanical subduction modeling',
      'Continental rifting, supercontinent cycles, and plume genesis',
      'Seismological imaging of mantle structure and core-mantle boundary',
      'Dynamic simulation modeling of continental collisions'
    ]
  },
  {
    id: 'course-3',
    title: 'Crystallography & Optical Mineralogy',
    instructor: 'Dr. Evelyn Moss',
    duration: '5 weeks (24 hrs)',
    level: 'Intermediate',
    rating: 4.7,
    studentsCount: 1100,
    price: 35,
    description: 'An immersive guide to mineral structure symmetry, light propagation, and mineral identification using petrographic microscopes and polarized light.',
    coverImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=80',
    syllabus: [
      'Crystal chemistry and 3D symmetry systems',
      'Introduction to optical physics and refractive indexes',
      'Petrographic microscope alignment and operations',
      'Uniaxial and biaxial mineral optical properties',
      'Identifying major rock-forming minerals in thin sections',
      'Modern analytical techniques: XRD and electron microprobe'
    ]
  },
  {
    id: 'course-4',
    title: 'Volcanology & Igneous Petrology',
    instructor: 'Dr. Helen Vance',
    duration: '7 weeks (38 hrs)',
    level: 'Intermediate',
    rating: 4.9,
    studentsCount: 1280,
    price: 59,
    description: 'Journey from magma generation in the lower crust to cataclysmic eruptions on the surface. Study magmatic differentiation and volcanic hazard assessment.',
    coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    syllabus: [
      'Magmagenesis: Partial melting and thermal anomalies',
      'Viscosity, volatiles, and vesicular structures of lavas',
      'Eruptive dynamics: Effusive domes to plinian columns',
      'Pyroclastic transport, surges, and caldera collapse',
      'Geochemistry of igneous suites and tectonic settings',
      'Volcanic monitoring, seismology, and gas emissions'
    ]
  }
];

export const ROCK_GUIDES: RockGuide[] = [
  {
    id: 'rock-1',
    name: 'Obsidian',
    type: 'Igneous',
    age: 'Recent to 20 Million Years',
    formation: 'Rapid cooling of high-silica rhyolitic lava, preventing crystalline structure.',
    hardness: '5.5 on Mohs Scale',
    description: 'A naturally occurring volcanic glass. It is extremely rich in silica and cools so rapidly that crystals do not form. It exhibits highly defined conchoidal fracturing with razor-sharp edges historically prized for blade forging.',
    specimenUrl: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&auto=format&fit=crop&q=80',
    geologicEra: 'Cenozoic',
    mohsHardness: 5.5
  },
  {
    id: 'rock-2',
    name: 'Banded Iron Formation (BIF)',
    type: 'Sedimentary',
    age: '1.8 to 2.5 Billion Years',
    formation: 'Precipitation of dissolved iron in ancient oxygen-poor oceans during the Great Oxidation Event.',
    hardness: '6.0 to 7.0 on Mohs Scale',
    description: 'Bands of iron oxides (hematite/magnetite) alternating with chert or shale. They represent ancient oxygen flares as cyanobacteria released the first major atmospheric oxygen on Earth, reacting with sea-dissolved iron.',
    specimenUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&auto=format&fit=crop&q=80',
    geologicEra: 'Paleoproterozoic',
    mohsHardness: 6.5
  },
  {
    id: 'rock-3',
    name: 'Gneiss',
    type: 'Metamorphic',
    age: 'Variable (up to 4 Billion Years)',
    formation: 'High-grade regional metamorphism of shale, granite, or sedimentary precursors.',
    hardness: '7.0 on Mohs Scale',
    description: 'Distinguished by its gorgeous bands of light and dark minerals (gneissic banding). Subjected to immense temperature and pressure deep inside continental collisions, minerals segregate into distinct crystalline ribbons.',
    specimenUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=80',
    geologicEra: 'Archean to Phanerozoic',
    mohsHardness: 7.0
  },
  {
    id: 'rock-4',
    name: 'Basalt (Vesicular)',
    type: 'Igneous',
    age: 'Quaternary to Archean',
    formation: 'Decompression melting of mantle rock, flowing as low-viscosity lava and trapping dissolved gas bubbles.',
    hardness: '6.0 on Mohs Scale',
    description: 'An aphanitic igneous rock that covers the ocean floors and forms massive continental flood provinces. The vesicular variety preserves gas escape chambers (vesicles) frozen in solid dark iron-rich basaltic crust.',
    specimenUrl: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800&auto=format&fit=crop&q=80',
    geologicEra: 'Phanerozoic',
    mohsHardness: 6.0
  },
  {
    id: 'rock-5',
    name: 'Stromatolite Limestone',
    type: 'Sedimentary',
    age: 'Up to 3.5 Billion Years',
    formation: 'Accretion of sediment sheets by microbial mats (primarily photosynthetic cyanobacteria).',
    hardness: '3.5 on Mohs Scale',
    description: 'Laminated structure representing the oldest physical fossils of life on Earth. Stromatolite mounds pumped out oxygen into ocean water, initiating the Earth’s modern atmospheric cycle.',
    specimenUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
    geologicEra: 'Archean / Proterozoic',
    mohsHardness: 3.5
  }
];

export const GEOLOGIC_LAYERS: GeologicLayer[] = [
  {
    id: 'layer-1',
    depthRange: '0 - 50m',
    era: 'Quaternary (0 - 2.5 Ma)',
    name: 'Alluvial & Glacial Soil Bed',
    composition: 'Loose silt, quartz gravel, unconsolidated sand, and rich organic organic loam.',
    description: 'The uppermost layer, containing current river silt and sediment left behind by ice age glacial retreats. Hydrologically active with active root zones and fresh groundwater aquifers.',
    color: '#a18262',
    mineralPotential: 'Placer gold, industrial quartz gravel, silica sand'
  },
  {
    id: 'layer-2',
    depthRange: '50 - 500m',
    era: 'Neogene to Paleogene (2.5 - 66 Ma)',
    name: 'Siltstone & Carbonate Shell Sands',
    composition: 'Compacted claystone, limestone beds, shell fossils, marl, and calcarenite.',
    description: 'A densely stratified layer reflecting shallow tropical seas and continental lake beds. Contains extensive marine invertebrate fossils, petrified wood deposits, and volcanic ash horizons.',
    color: '#c29b70',
    mineralPotential: 'Carbonate limestone, calcium clay, lignite coal'
  },
  {
    id: 'layer-3',
    depthRange: '500 - 1500m',
    era: 'Cretaceous to Jurassic (66 - 201 Ma)',
    name: 'Dakota Sandstone & Shale Beds',
    composition: 'Cross-bedded sandstone, carbonaceous shale, bituminous seams, ironstones.',
    description: 'Formed from sprawling deltaic shorelines during the dinosaur era. Excellent high-porosity reservoir characteristics which house geothermal water channels and natural gas traps.',
    color: '#d48d48',
    mineralPotential: 'Uranium deposits, high-silica glass sands, natural reservoirs'
  },
  {
    id: 'layer-4',
    depthRange: '1500 - 3000m',
    era: 'Triassic to Permian (201 - 299 Ma)',
    name: 'Red Bed Evaporites & Siltstones',
    composition: 'Halite (rock salt), gypsum beds, reddish iron-rich siltstone, anhydrite.',
    description: 'Depicts severe dry climates, supercontinent conditions (Pangea), and saline desert basins. These massive salt beds act as mechanical traps sealing ancient fluid reservoirs under massive pressure.',
    color: '#b0593c',
    mineralPotential: 'Gypsum rock, halite salt, potash fertilizer salts'
  },
  {
    id: 'layer-5',
    depthRange: '3000 - 5000m',
    era: 'Precambrian Basement Rock',
    name: 'Granitic Plutons & Crystalline Schist',
    composition: 'Gneissic granite, pegmatites, high-silica quartzite, chlorite schist.',
    description: 'The rigid foundation core of the continental crust. Fractured only by ancient plate boundaries. Extremely dense, highly crystalline, and elevated in geothermal energy flow.',
    color: '#704f4a',
    mineralPotential: 'Rare-earth minerals, pegmatitic lithium, industrial granite'
  }
];

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-free',
    name: 'Crust Explorer',
    price: 0,
    period: 'month',
    description: 'For curious geophiles looking to understand basic stratigraphic layers and rocks.',
    features: [
      'Interactive Stratigraphic Dig Sandbox (up to 500m depth)',
      'Access to 5 standard Rock Specimen profiles',
      'Geology news and community updates',
      '1 standard virtual Field Tour seat'
    ]
  },
  {
    id: 'plan-pro',
    name: 'Mantle Surveyor',
    price: 19,
    period: 'month',
    description: 'For geology students, mineral collectors, and seasoned field naturalists.',
    features: [
      'Unrestricted Stratigraphic Dig (down to Precambrian basement)',
      'All 50+ Rock Specimen premium profiles with interactive 3D tools',
      'Free enrollment in 1 standard Course per month',
      'Unlimited Live Tour RSVP sessions',
      'Direct contact with field guides and academic staff'
    ],
    popular: true
  },
  {
    id: 'plan-elite',
    name: 'Core Pioneer',
    price: 149,
    period: 'year',
    description: 'The ultimate professional research grade suite for institutes and active collectors.',
    features: [
      'All Mantle Surveyor tier advantages included',
      'Unrestricted entry to ALL current & upcoming Lithos Courses',
      'High-priority live academic certification review',
      'Private 1-on-1 online video mineral analysis sessions',
      'Original sample specimen delivery box (1 rock/month shipped)'
    ]
  }
];

export const LIVE_TOURS: LiveTourSession[] = [
  {
    id: 'tour-1',
    title: 'The Great Oxidation Event: Banded Iron in Western Australia',
    guideName: 'Dr. Helen Vance',
    dateTime: 'Thursday, June 25, 2026 at 2:00 PM PDT',
    spotsLeft: 8,
    description: 'Join Helen Vance on-location from the Pilbara region of Western Australia as we examine real 2.5-billion-year-old banded iron formations and explain Earth’s first major oxidation cycle.',
    status: 'Upcoming',
    location: 'Pilbara, Western Australia (Live Streamed)'
  },
  {
    id: 'tour-2',
    title: 'Icelandic Rifting: Krafla Volcano Fissures & Basalt Dikes',
    guideName: 'Prof. Marcus Sterling',
    dateTime: 'Live Broadcast Active',
    spotsLeft: 24,
    description: 'Experience active rifting! Watch real-time streaming footage of massive basaltic fissure lava sheets, boiling silica hot pools, and tectonic cracks spreading across the Mid-Atlantic ridge.',
    status: 'Live',
    location: 'Krafla Rift Zone, Iceland (Active Broadcast)'
  },
  {
    id: 'tour-3',
    title: 'Deep Cave Formations: Carbonate Speleothems of Carlsbad',
    guideName: 'Dr. Evelyn Moss',
    dateTime: 'July 2, 2026 at 10:00 AM PDT',
    spotsLeft: 42,
    description: 'An underground tour detailing acid-leached limestone karst systems, stalactite deposition rates, and isotopic dating methods used to map pre-quaternary precipitation.',
    status: 'Upcoming',
    location: 'Carlsbad Caverns, New Mexico (Virtual Reality Feed)'
  }
];
