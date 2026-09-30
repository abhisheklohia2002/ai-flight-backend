export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

const airports: Airport[] = [
  {
    code: "DEL",
    name: "Indira Gandhi International Airport",
    city: "Delhi",
    country: "India",
  },
  {
    code: "BLR",
    name: "Kempegowda International Airport",
    city: "Bengaluru",
    country: "India",
  },
  {
    code: "BOM",
    name: "Chhatrapati Shivaji Maharaj International Airport",
    city: "Mumbai",
    country: "India",
  },
  {
    code: "GOI",
    name: "Goa International Airport",
    city: "Goa",
    country: "India",
  },
  {
    code: "HYD",
    name: "Rajiv Gandhi International Airport",
    city: "Hyderabad",
    country: "India",
  },
  {
    code: "CCU",
    name: "Netaji Subhas Chandra Bose International Airport",
    city: "Kolkata",
    country: "India",
  },
  {
    code: "MAA",
    name: "Chennai International Airport",
    city: "Chennai",
    country: "India",
  },
  {
    code: "PNQ",
    name: "Pune Airport",
    city: "Pune",
    country: "India",
  },
  {
    code: "AMD",
    name: "Sardar Vallabhbhai Patel International Airport",
    city: "Ahmedabad",
    country: "India",
  },
  {
    code: "JAI",
    name: "Jaipur International Airport",
    city: "Jaipur",
    country: "India",
  },
  {
    code: "IXB",
    name: "Bagdogra Airport",
    city: "Bagdogra",
    country: "India",
  },
];

const aliases: Record<string, string> = {
  delhi: "DEL",
  "new delhi": "DEL",
  del: "DEL",

  bangalore: "BLR",
  bengaluru: "BLR",
  blr: "BLR",

  bombay: "BOM",
  mumbai: "BOM",
  bom: "BOM",

  goa: "GOI",
  goi: "GOI",

  hyderabad: "HYD",
  hyd: "HYD",

  kolkata: "CCU",
  calcutta: "CCU",
  ccu: "CCU",

  chennai: "MAA",
  madras: "MAA",
  maa: "MAA",

  pune: "PNQ",
  pnq: "PNQ",

  ahmedabad: "AMD",
  amd: "AMD",

  jaipur: "JAI",
  jai: "JAI",

  bagdogra: "IXB",
  ixb: "IXB",
};

function normalize(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function resolveAirport(
  input: string
): Airport | null {
  const normalized =
    normalize(input);

  const code =
    aliases[normalized];

  if (!code) {
    return null;
  }

  return (
    airports.find(
      (airport) =>
        airport.code === code
    ) ?? null
  );
}