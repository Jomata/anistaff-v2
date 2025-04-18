export interface AniListMedia {
  id: number;
  title: { romaji: string };
  description: string;
  season: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  seasonYear: number;
  genres: string[];
  siteUrl: string;
  tags: { name: string }[];
  trailer?: { id: string; site: string } | null;
  coverImage?: { large: string; extraLarge:string; } | null;
  bannerImage?: string;
  staff: {
    edges: {
      role: string;
      node: {
        id: number;
        name: { full: string };
        siteUrl: string;
      };
    }[];
  };
}

export interface AniListStaff {
  staffMedia: {
    edges: {
      staffRole: string;
      node: {
        id: number;
        title: { romaji: string };
        siteUrl: string;
        startDate: { year: number | null; month: number | null; day: number | null };
      };
    }[];
  };
}
