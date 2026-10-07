/**
 * Recruiters. To show a logo instead of a text pill, drop the file into
 * /public/recruiters/ and set `logo: "/recruiters/<file>.svg"` on the entry.
 */

export type Recruiter = { name: string; logo?: string; unicorn?: boolean };

const names = (list: string[], unicorn = false): Recruiter[] =>
  list.map((name) => ({ name, unicorn }));

export const RECRUITERS: Recruiter[] = [
  ...names([
    "ADP",
    "ANZ",
    "Aon Hewitt",
    "Accenture",
    "Axis Bank",
    "Asian Paints",
    "BlueStone",
    "BSES",
    "Bajaj Finance",
    "Berger",
    "Birla Opus",
    "Cognizant",
    "Digit Insurance",
    "Digisol",
    "Dabur",
    "Deloitte",
    "EaseMyTrip",
    "ESAF Bank",
    "EY",
    "Great Learning",
    "GlobalStep",
    "HCLTech",
    "HFFC",
    "IDFC First Bank",
    "Info Edge",
    "ITC",
    "ICICI Bank",
    "Incedo",
    "JM Financial",
    "KehanSri Solar",
    "KPMG",
    "Livspace",
    "MRF",
    "Reliance Retail",
    "Stanza Living",
    "S&P Global",
    "Swiggy",
    "TCS",
    "Tech Mahindra",
    "Infosys",
    "PwC",
  ]),
  ...names(
    [
      "BigBasket",
      "BYJU'S",
      "CARS24",
      "cure.fit",
      "Lenskart",
      "NoBroker",
      "OYO",
      "PhonePe",
      "Unacademy",
      "upGrad",
      "Urban Company",
      "Vedantu",
      "Zerodha",
      "Zomato",
      "LeadSquared",
    ],
    true,
  ),
];
