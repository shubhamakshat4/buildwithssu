export type Contact = {
  name: string;
  role: string;
  phone?: string;
  email?: string;
};

export const TNP_TEAM: Contact[] = [
  {
    name: "Dilip Kumar Sinha",
    role: "Sr. Manager – Training & Placement",
    phone: "+91 97164 52098",
    email: "dilip.s@srisriuniversity.edu.in",
  },
  {
    name: "Sangram Kishore Pattanaik",
    role: "Manager – Corporate Relations",
    phone: "+91 77356 39282",
  },
];

/**
 * FET_FACULTY_COORDINATOR — fill these in here, or set FET_COORDINATOR_NAME /
 * FET_COORDINATOR_EMAIL / FET_COORDINATOR_PHONE in the environment (env wins).
 * Hidden everywhere while `name` is empty.
 */
const FET_FACULTY_COORDINATOR_DEFAULT: Contact = {
  name: "Akshat Shubham",
  role: "Assistant Professor & Faculty Coordinator for Training & Placement, FET, SSU",
  email: "akshat.s@srisriuniversity.edu.in",
  phone: "+91 63618 50679",
};

export function getFetCoordinator(): Contact | null {
  const c: Contact = {
    ...FET_FACULTY_COORDINATOR_DEFAULT,
    name: process.env.FET_COORDINATOR_NAME || FET_FACULTY_COORDINATOR_DEFAULT.name,
    email: process.env.FET_COORDINATOR_EMAIL || FET_FACULTY_COORDINATOR_DEFAULT.email,
    phone: process.env.FET_COORDINATOR_PHONE || FET_FACULTY_COORDINATOR_DEFAULT.phone,
  };
  return c.name ? c : null;
}

/** Contacts shown in the footer / thank-you page. */
export function getContacts(): Contact[] {
  const coord = getFetCoordinator();
  return coord ? [coord, ...TNP_TEAM] : TNP_TEAM;
}
