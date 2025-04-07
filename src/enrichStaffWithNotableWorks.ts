import { CleanStaffMember } from "./types";
import { fetchStaffDetails } from "./fetchStaffDetails";
import { extractTopWorks } from "./extractTopWorks";

export async function enrichStaffWithNotableWorks(
  staff: CleanStaffMember[],
  currentAnimeId: number
): Promise<CleanStaffMember[]> {
  const uniqueIds = Array.from(new Set(staff.map((s) => s.id)));

  const fetchedMap = new Map<number, { allWorks: any[]; notableWorks: any[] }>();

  // Fetch once per unique ID
  await Promise.all(
    uniqueIds.map(async (id) => {
      console.log(`Fetching details for staff ID: ${id}`);
      const allFetched = await fetchStaffDetails(id);
      const filtered = allFetched.filter((w) => w.id !== currentAnimeId);
      const notableWorks = extractTopWorks(filtered);
      fetchedMap.set(id, { allWorks: filtered, notableWorks });
    })
  );

  // Apply results to each staff member
  return staff.map((person) => {
    const entry = fetchedMap.get(person.id);
    return {
      ...person,
      allWorks: entry?.allWorks ?? [],
      notableWorks: entry?.notableWorks ?? [],
    };
  });
}
