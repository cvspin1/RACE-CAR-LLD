/* RACE CAR LLD — location courte & longue durée, Casablanca. Edit only this file for content.
   ⚠ prices, fees, deposit, age/licence rules = PLACEHOLDERS, confirm with the client. */
window.AGENCY_CONFIG = {
  name: "RACE CAR LLD",
  logo: "assets/logo.webp",
  whatsapp: "212663189751",
  whatsappDisplay: "+212 663 189 751",
  currency: "MAD",
  defaultLang: "fr",
  languages: ["fr", "en"],
  locations: [
    { id: "agency", fr: "Agence RACE CAR LLD — Casablanca", en: "RACE CAR LLD agency — Casablanca", fee: 0 },
    { id: "airport", fr: "Aéroport Mohammed V", en: "Mohammed V Airport", fee: 150 },
    { id: "city", fr: "Livraison en ville (Casablanca)", en: "City delivery (Casablanca)", fee: 100 }
  ],
  lldMonths: [6, 12, 24, 36],
  rules: { minAge: 21, licenseYears: 2, deposit: 3000, mileage: { fr: "250 km/jour (illimité sur sélection)", en: "250 km/day (unlimited on selected cars)" } },
  // category: city | sedan | family.  lld:true => also offered as business long-term lease (monthly price).
  cars: [
    { id: "golf8", name: "Volkswagen Golf 8", category: "sedan", image: "assets/cars/golf-8.webp", price: 600, monthly: 7500, lld: true, transmission: "auto", fuel: "diesel", seats: 5, available: true },
    { id: "accent", name: "Hyundai Accent", category: "sedan", image: "assets/cars/hyundai-accent.webp", price: 350, monthly: 4800, lld: true, transmission: "auto", fuel: "petrol_diesel", seats: 5, available: true },
    { id: "jogger", name: "Dacia Jogger", category: "family", image: "assets/cars/dacia-jogger.webp", price: 450, monthly: 5500, lld: true, transmission: "manual", fuel: "diesel", seats: 7, available: true },
    { id: "corsa", name: "Opel Corsa", category: "city", image: "assets/cars/opel-corsa.webp", price: 300, transmission: "manual", fuel: "petrol", seats: 5, available: true },
    { id: "express", name: "Renault Express", category: "family", image: "assets/cars/renault-express.webp", price: 400, monthly: 4900, lld: true, transmission: "manual", fuel: "diesel", seats: 3, available: true }
  ],
  map: {
    url: "https://www.google.com/maps/place/RACE+CAR+LLD/@33.5999207,-7.494173,15z/data=!4m10!1m2!2m1!1slocation+voiture!3m6!1s0xda7cb8d5df98e83:0xbf7c2648100c1941!8m2!3d33.6017636!4d-7.4785477!16s%2Fg%2F11p2pdnlrf",
    directions: "https://www.google.com/maps/dir/?api=1&destination=33.6017636,-7.4785477"
  },
  supabase: { enabled: false, url: "", anonKey: "", table: "leads" }
};
