/**
 * Company → website domain. Used to fetch logos into /public/logos via
 * `npm run logos`. Names must match the lists in recruiters.ts,
 * achievements.ts (internship hosts) and curriculum.ts (industry partners).
 * Companies without a domain (or whose logo can't be fetched) show a monogram tile.
 */
export const COMPANY_DOMAINS: Record<string, string> = {
  // Recruiters
  ADP: "adp.com",
  ANZ: "anz.com",
  "Aon Hewitt": "aon.com",
  Accenture: "accenture.com",
  "Axis Bank": "axisbank.com",
  "Asian Paints": "asianpaints.com",
  BlueStone: "bluestone.com",
  BSES: "bsesdelhi.com",
  "Bajaj Finance": "bajajfinserv.in",
  Berger: "bergerpaints.com",
  "Birla Opus": "birlaopus.com",
  Cognizant: "cognizant.com",
  "Digit Insurance": "godigit.com",
  Digisol: "digisol.com",
  Dabur: "dabur.com",
  Deloitte: "deloitte.com",
  EaseMyTrip: "easemytrip.com",
  "ESAF Bank": "esafbank.com",
  EY: "ey.com",
  "Great Learning": "mygreatlearning.com",
  GlobalStep: "globalstep.com",
  HCLTech: "hcltech.com",
  HFFC: "homefirstindia.com",
  "IDFC First Bank": "idfcfirstbank.com",
  "Info Edge": "infoedge.in",
  ITC: "itcportal.com",
  "ICICI Bank": "icicibank.com",
  Incedo: "incedoinc.com",
  "JM Financial": "jmfl.com",
  KPMG: "kpmg.com",
  Livspace: "livspace.com",
  MRF: "mrftyres.com",
  "Reliance Retail": "relianceretail.com",
  "Stanza Living": "stanzaliving.com",
  "S&P Global": "spglobal.com",
  Swiggy: "swiggy.com",
  TCS: "tcs.com",
  "Tech Mahindra": "techmahindra.com",
  Infosys: "infosys.com",
  PwC: "pwc.com",
  // Unicorns
  BigBasket: "bigbasket.com",
  "BYJU'S": "byjus.com",
  CARS24: "cars24.com",
  "cure.fit": "cult.fit",
  Lenskart: "lenskart.com",
  NoBroker: "nobroker.in",
  OYO: "oyorooms.com",
  PhonePe: "phonepe.com",
  Unacademy: "unacademy.com",
  upGrad: "upgrad.com",
  "Urban Company": "urbancompany.com",
  Vedantu: "vedantu.com",
  Zerodha: "zerodha.com",
  Zomato: "zomato.com",
  LeadSquared: "leadsquared.com",
  // Internship hosts
  "OCAC CSOC (Govt. of Odisha)": "ocac.in",
  "TCS iON": "tcsion.com",
  "IIT (ISM) Dhanbad": "iitism.ac.in",
  "IBM SkillsBuild": "ibm.com",
  "Infosys Springboard": "infosys.com",
  NALCO: "nalcoindia.com",
  HAL: "hal-india.co.in",
  IFFCO: "iffco.in",
  "NIT Rourkela": "nitrkl.ac.in",
  "Google Cloud": "cloud.google.com",
  Intellipaat: "intellipaat.com",
  Zidio: "zidio.in",
  CodeAlpha: "codealpha.tech",
  "Forage (Deloitte · Mastercard · Tata)": "theforage.com",
  // Industry partners
  "L&T EduTech": "lntedutech.com",
  Intel: "intel.com",
  IBM: "ibm.com",
  IESA: "iesaonline.org",
};

export function logoSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
