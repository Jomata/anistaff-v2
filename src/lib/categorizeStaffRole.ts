import { StaffCategory } from "../types";

export function categorizeStaffRole(role: string): StaffCategory | null {
  const normalized = role.toLowerCase();

  // Exclude Localization
  const isLocalized = /\b(english|german|french|spanish|portuguese|italian|chinese|korean|thai)\b/.test(normalized);
  if (isLocalized) return null;

  // Theme-related work
  if (
    normalized.includes("theme song") ||
    normalized.includes("insert song") ||
    (normalized.includes("arrangement") && (normalized.includes("op") || normalized.includes("ed") || normalized.includes("insert"))) ||
    (normalized.includes("composition") && (normalized.includes("op") || normalized.includes("ed") || normalized.includes("insert"))) ||
    normalized.includes("lyrics")
  ) {
    return "theme-song";
  }

  // Audio staff (before director catch-all)
  if (
    normalized.includes("music") ||
    normalized.includes("sound")
  ) {
    return "audio";
  }

  // Visual staff
  if (
    normalized.includes("animator") ||
    normalized.includes("animation") ||
    normalized.includes("storyboard") ||
    normalized.includes("character design") ||
    normalized.includes("art director") ||
    normalized.includes("cg") ||
    normalized.includes("photography") ||
    normalized.includes("action") ||
    normalized.includes("color") ||
    normalized.includes("art")
  ) {
    return "visual";
  }

  // Writing & creative lead
  if (
    normalized.includes("script") ||
    normalized.includes("composition") ||
    normalized === "original creator"
  ) {
    return "creative";
  }

  // Catch-all for general directors (after filtering out more specific ones)
  if (normalized.includes("director")) {
    return "creative";
  }

  console.error(`Unknown staff role: ${role}`);

  return null;
}
