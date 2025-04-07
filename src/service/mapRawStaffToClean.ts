import { RawStaff } from "../types";
import { CleanStaffMember } from "../types";
import { categorizeStaffRole } from "../lib/categorizeStaffRole";

export function mapRawStaffToClean(rawList: RawStaff[]): CleanStaffMember[] {
  const grouped = new Map<string, CleanStaffMember>();

  for (const entry of rawList) {
    const { id, name, siteUrl, role } = entry;
    if (!role) continue;

    const category = categorizeStaffRole(role);
    if(!category) continue;
    
    const compositeKey = `${id}|${category}`;
    const existing = grouped.get(compositeKey);
    if (existing) {
      if (!existing.roles.includes(role)) {
        existing.roles.push(role);
      }
    } else {
      grouped.set(compositeKey, {
        id,
        name,
        siteUrl,
        roles: [role],
        category,
        notableWorks: [],
        allWorks: [],
      });
    }
  }

  return Array.from(grouped.values());
}
