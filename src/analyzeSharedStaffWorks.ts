import { CleanStaffMember, SharedStaffWork } from "./types";

export function analyzeSharedStaffWorks(
  staff: CleanStaffMember[]
): SharedStaffWork[] {
  const sharedMap = new Map<number, Map<number, {
    id: number;
    name: string;
    siteUrl: string;
    roles: string[];
  }>>();

  const workTitles = new Map<number, string>();
  const workUrls = new Map<number, string>();

  for (const person of staff) {
    for (const work of person.allWorks) {
      // Store title and siteUrl for later
      workTitles.set(work.id, work.title);
      workUrls.set(work.id, work.siteUrl);

      if (!sharedMap.has(work.id)) {
        sharedMap.set(work.id, new Map());
      }

      const staffMap = sharedMap.get(work.id)!;

      if (!staffMap.has(person.id)) {
        staffMap.set(person.id, {
          id: person.id,
          name: person.name,
          siteUrl: person.siteUrl,
          roles: [],
        });
      }

      staffMap.get(person.id)!.roles.push(work.role);
    }
  }

  return Array.from(sharedMap.entries())
    .map(([workId, staffMap]) => ({
      id: workId,
      title: workTitles.get(workId) ?? "(Untitled)",
      siteUrl: workUrls.get(workId) ?? "",
      sharedStaff: Array.from(staffMap.values()),
    }))
    .filter((entry) => entry.sharedStaff.length >= 2)
    .sort((a, b) => b.sharedStaff.length - a.sharedStaff.length);
}
