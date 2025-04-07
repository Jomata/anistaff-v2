import { CleanStaffMember, GroupedStaffEntry, StaffCategory } from "./types";

export function groupStaffByCategory(
    staff: CleanStaffMember[]
  ): Record<StaffCategory, GroupedStaffEntry[]> {
    const grouped: Record<StaffCategory, Map<number, GroupedStaffEntry>> = {
      creative: new Map(),
      visual: new Map(),
      audio: new Map(),
      "theme-song": new Map(),
      other: new Map(),
    };
  
    for (const person of staff) {
      const map = grouped[person.category];
  
      if (!map.has(person.id)) {
        map.set(person.id, {
          id: person.id,
          name: person.name,
          siteUrl: person.siteUrl,
          roles: [],
          notableWorks: [],
        });
      }
  
      const entry = map.get(person.id)!;
      entry.roles.push(person.role);
  
      for (const work of person.notableWorks) {
        const found = entry.notableWorks.find(w => w.title === work.title);
        if (found) {
          found.roles.push(work.role);
        } else {
          entry.notableWorks.push({ title: work.title, roles: [work.role] });
        }
      }
    }
  
    // Convert maps to arrays and dedupe
    const result: Record<StaffCategory, GroupedStaffEntry[]> = {
      creative: [],
      visual: [],
      audio: [],
      "theme-song": [],
      other: [],
    };
  
    for (const category of Object.keys(grouped) as StaffCategory[]) {
      result[category] = Array.from(grouped[category].values()).map((entry) => ({
        ...entry,
        roles: [...new Set(entry.roles)],
        notableWorks: entry.notableWorks.map((w) => ({
          title: w.title,
          roles: [...new Set(w.roles)],
        })),
      }));
    }
  
    return result;
  }
  