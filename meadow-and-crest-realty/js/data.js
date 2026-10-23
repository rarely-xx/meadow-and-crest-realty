const EXCHANGE_RATE = 1600; // 1 USD = 1,600 NGN

const LOCATION_COORDS = {
  "Ikoyi / Banana Island": { lat: 6.4646, lng: 3.4508 },
  "Lekki Phase 1": { lat: 6.4478, lng: 3.4723 },
  "Victoria Island": { lat: 6.4281, lng: 3.4219 },
  "Ikeja GRA": { lat: 6.5818, lng: 3.3565 },
  "Maitama Abuja": { lat: 9.0882, lng: 7.4934 }
};

const ADVISORS_DATA = [
  {
    id: "adv-1",
    name: "Iyanu",
    role: "Senior Private Wealth Advisor",
    specialization: "Banana Island & Old Ikoyi Ultra-Prime Estates",
    office: "Ikoyi Headquarters",
    phone: "2349063862966",
    email: "workingonit@meadowandcrest.com",
    experience: "12+ Years",
    volume: "₦48B+ Closed",
    image: "https://images."
  },
  {
    id: "adv-2",
    name: "Bolaji",
    role: "Head of Residential Sales",
    specialization: "Lekki Phase 1, Ikeja GRA & Waterfront Developments",
    office: "Lekki Phase 1 Advisory Lounge",
    phone: "2349063862966",
    email: "workingonit@meadowandcrest.com",
    experience: "9+ Years",
    volume: "₦31B+ Closed",
    image: "https://images"
  },
  {
    id: "adv-3",
    name: "Victor",
    role: "Executive Leasing Director",
    specialization: "Victoria Island Penthouses & Corporate Expat Leases",
    office: "Ikoyi Headquarters",
    phone: "2349063862966",
    email: "workingonit@meadowandcrest.com",
    experience: "10+ Years",
    volume: "₦39B+ Closed",
    image: "https://images.0"
  },
  {
    id: "adv-4",
    name: "Ayodeji",
    role: "Abuja Regional Partner",
    specialization: "Maitama, Asokoro & Diplomatic Enclave Mandates",
    office: "Maitama Abuja Regional Desk",
    phone: "2349063862966",
    email: "workingonit@meadowandcrest.com",
    experience: "11+ Years",
    volume: "₦29B+ Closed",
    image: "https://images."
  }
];

const INITIAL_PROPERTIES = [
  {
    id: "mc-101",
    title: "The Aurelia Waterfront Villa",
    category: "Buy",
    type: "Waterfront Mansion",
    location: "Ikoyi / Banana Island",
    address: "Zone B, Close 4, Banana Island, Ikoyi, Lagos",
    lat: 6.4658,
    lng: 3.4529,
    priceNGN: 2400000000,
    beds: 6,
    baths: 7,
    sqm: 1250,
    titleDoc: "Federal C of O",
    featured: true,
    amenities: ["Swimming Pool", "24/7 Power", "BQ", "Waterfront", "Smart Home"],
    advisor: {
      name: "Iyanu",
      role: "Senior Private Wealth Advisor",
      phone: "2349063862966"
    },
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "An architectural masterpiece with a private jetty on Banana Island. Features a double-height grand foyer, home cinema, infinity pool overlooking the lagoon, elevator, 2-room Boys Quarters (BQ), and full Lutron home automation."
  },
  {
    id: "mc-102",
    title: "Crestview Contemporary Detached Duplex",
    category: "Buy",
    type: "Detached Duplex",
    location: "Lekki Phase 1",
    address: "Admiralty Way Axis, Lekki Phase 1, Lagos",
    lat: 6.4478,
    lng: 3.4723,
    priceNGN: 480000000,
    beds: 5,
    baths: 6,
    sqm: 600,
    titleDoc: "Governor's Consent",
    featured: true,
    amenities: ["Swimming Pool", "24/7 Power", "BQ", "Smart Home"],
    advisor: {
      name: "Bolaji",
      role: "Head of Residential Sales",
      phone: "2349063862966"
    },
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "Newly built 5-bedroom fully detached duplex in a gated Lekki Phase 1 enclave. Comes with a fitted Bosch kitchen, rooftop lounge, private swimming pool, biometric access, and 1-room BQ."
  },
  {
    id: "mc-103",
    title: "The Emerald Sky Penthouse",
    category: "Rent",
    type: "Penthouse",
    location: "Victoria Island",
    address: "Eko Atlantic / Ahmadu Bello Way, Victoria Island, Lagos",
    lat: 6.4225,
    lng: 3.4142,
    priceNGN: 45000000,
    period: "per annum",
    beds: 4,
    baths: 5,
    sqm: 490,
    titleDoc: "Lagos State C of O",
    featured: false,
    amenities: ["Swimming Pool", "24/7 Power", "Waterfront", "Smart Home"],
    advisor: {
      name: "Victor",
      role: "Executive Leasing Director",
      phone: "2349063862966"
    },
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "Panoramic ocean and city views from the 18th floor. Includes uninterrupted 24/7 power supply, concierge service, Olympic-size communal pool, private elevator access, and wrap-around terrace."
  },
  {
    id: "mc-104",
    title: "Maitama Ambassadorial Villa",
    category: "Buy",
    type: "Villa",
    location: "Maitama Abuja",
    address: "Minister's Hill, Maitama, Abuja FCT",
    lat: 9.0882,
    lng: 7.4934,
    priceNGN: 1650000000,
    beds: 7,
    baths: 8,
    sqm: 1400,
    titleDoc: "Federal C of O",
    featured: true,
    amenities: ["Swimming Pool", "24/7 Power", "BQ", "Smart Home"],
    advisor: {
      name: "Ayodeji",
      role: "Abuja Regional Partner",
      phone: "2349063862966"
    },
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "Palatial 7-bedroom ambassadorial residence nestled on Minister's Hill. Boasts lush landscaped gardens, a banquet hall, bulletproof security doors, solar-inverter hybrid grid, and 3-room staff quarters."
  },
  {
    id: "mc-105",
    title: "The Botanical Serviced Residence",
    category: "Rent",
    type: "Luxury Apartment",
    location: "Ikeja GRA",
    address: "Oduduwa Crescent, Ikeja GRA, Lagos",
    lat: 6.5818,
    lng: 3.3565,
    priceNGN: 22000000,
    period: "per annum",
    beds: 3,
    baths: 4,
    sqm: 280,
    titleDoc: "Governor's Consent",
    featured: false,
    amenities: ["Swimming Pool", "24/7 Power", "BQ"],
    advisor: {
      name: "Bolaji",
      role: "Head of Residential Sales",
      phone: "2349063862966"
    },
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "Serene 3-bedroom luxury apartment with a Boys Quarters in tree-lined Ikeja GRA. Minutes away from Murtala Muhammed International Airport with 24-hour power and club house access."
  },
  {
    id: "mc-106",
    title: "Meadow Executive Short-Let Suite",
    category: "Short-Let",
    type: "Luxury Apartment",
    location: "Victoria Island",
    address: "Oniru Royal Estate, Victoria Island, Lagos",
    lat: 6.4315,
    lng: 3.4445,
    priceNGN: 280000,
    period: "per night",
    beds: 3,
    baths: 3,
    sqm: 240,
    titleDoc: "Governor's Consent",
    featured: false,
    amenities: ["Swimming Pool", "24/7 Power", "Smart Home"],
    advisor: {
      name: "Victor",
      role: "Executive Leasing Director",
      phone: "2349063862966"
    },
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "Fully furnished executive short-let apartment featuring high-speed Starlink Wi-Fi, daily housekeeping, PS5 entertainment lounge, chef-on-demand option, and 24/7 power."
  }
];