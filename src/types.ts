export type StaffCategory =
  | "creative"
  | "visual"
  | "audio"
  | "theme-song"
  | "other";

export interface StaffWork {
  id: number;
  title: string;
  siteUrl: string;
  role: string;
  date?: string;
}

export interface CleanStaffMember {
  id: number;
  name: string;
  siteUrl: string;
  category: StaffCategory;
  roles: string[];
  notableWorks: StaffWork[];
  allWorks: StaffWork[];
}

export interface GroupedStaffEntry {
  id: number;
  name: string;
  siteUrl: string;
  roles: string[]; // all roles for this person
  notableWorks: {
    title: string;
    siteUrl: string;
    roles: string[]; // all roles the person had in that anime
  }[];
}

export interface SharedStaffWork {
  id: number;
  title: string;
  siteUrl: string;
  sharedStaff: {
    id: number;
    name: string;
    roles: string[];
    siteUrl: string;
  }[];
}

export interface CleanAnime {
  id: number;
  title: string;
  description: string;
  season: string;
  seasonYear: number;
  siteUrl: string;
  tags: string[];
  genres: string[];
  trailerUrl?: string;
  coverImageUrl?: string;
  coverImageUrlXL?: string;
  bannerImageUrl?: string;
  staff: CleanStaffMember[];
  sharedStaffWorks: SharedStaffWork[];
  groupedStaffByCategory: Record<StaffCategory, GroupedStaffEntry[]>;
}

export interface RawStaff {
  id: number;
  name: string;
  siteUrl: string;
  role: string;
}

export interface AnimeCoreDetails {
  id: number;
  title: string;
  description: string;
  season: string;
  seasonYear: number;
  tags: string[];
  siteUrl: string;
  genres: string[];
  trailerUrl?: string;
  coverImageUrl?: string;
  coverImageUrlXL?: string;
  bannerImageUrl?: string;
  staffEdges: RawStaff[];
}

export interface BasicAnimeCardData {
  id: number;
  title: string;
  imageUrl: string;
  studio: string;
  description: string;
  genres: string[];
  season?: string;
  seasonYear?: number;
  siteUrl: string;
}

const seasons = ["Winter", "Spring", "Summer", "Fall"] as const;
export type Season = (typeof seasons)[number];
