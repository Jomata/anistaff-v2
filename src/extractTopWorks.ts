import { StaffWork } from "./types";

export function extractTopWorks(works: StaffWork[], max = 4): StaffWork[] {
  if (works.length <= max) return works;

  const top = works.slice(0, 2);
  const recent = [...works]
    .filter((w) => w.date)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .slice(0, 2);

  const seen = new Set<number>();
  const combined: StaffWork[] = [];

  for (const w of [...top, ...recent]) {
    if (!seen.has(w.id)) {
      combined.push(w);
      seen.add(w.id);
    }
    if (combined.length >= max) break;
  }

  return combined;
}
