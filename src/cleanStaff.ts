import { categorizeStaffRole } from "./categorizeStaffRole";
import { RawStaff, CleanStaffMember } from "./types";

export function cleanStaff(raw: RawStaff): CleanStaffMember | null {
  const category = categorizeStaffRole(raw.role);
  if (!category) return null;

  return {
    id: raw.id,
    name: raw.name,
    siteUrl: raw.siteUrl,
    roles: [raw.role],
    category,
    notableWorks: [],
    allWorks: [],
  };
}
