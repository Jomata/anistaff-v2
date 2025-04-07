import { CleanStaffMember } from "./types";
import { fetchStaffDetails } from "./fetchStaffDetails";
import { extractTopWorks } from "./extractTopWorks";

export async function enrichStaffWithNotableWorks(
  staff: CleanStaffMember[],
  currentAnimeId: number
): Promise<CleanStaffMember[]> {
  return await Promise.all(
    staff.map(async (person) => {
      const allFetched = await fetchStaffDetails(person.id);
      const filtered = allFetched.filter((w) => w.id !== currentAnimeId);
      const notableWorks = extractTopWorks(filtered);

      return {
        ...person,
        allWorks: filtered,
        notableWorks,
      };
    })
  );
}
