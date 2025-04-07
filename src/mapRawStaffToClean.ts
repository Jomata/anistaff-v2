import { RawStaff, CleanStaffMember } from "./types";
import { cleanStaff } from "./cleanStaff";

export function mapRawStaffToClean(rawList: RawStaff[]): CleanStaffMember[] {
  return rawList
    .map(cleanStaff)
    .filter((s): s is CleanStaffMember => s !== null);
}
