import {
  CleanAnime,
  CleanStaffMember,
  SharedStaffWork,
  AnimeCoreDetails,
} from "./types";

import { fetchAnimeCoreDetails } from "./fetchAnimeCoreDetails";
import { mapRawStaffToClean } from "./mapRawStaffToClean";
import { enrichStaffWithNotableWorks } from "./enrichStaffWithNotableWorks";
import { analyzeSharedStaffWorks } from "./analyzeSharedStaffWorks";
import { groupStaffByCategory } from "./groupStaffByCategory";

export async function getAnimeDetails(animeId: number): Promise<CleanAnime> {
  const coreData: AnimeCoreDetails = await fetchAnimeCoreDetails(animeId);
  const cleanStaff: CleanStaffMember[] = mapRawStaffToClean(coreData.staffEdges);
  const enrichedStaff: CleanStaffMember[] = await enrichStaffWithNotableWorks(cleanStaff, animeId);
  const sharedStaffWorks: SharedStaffWork[] = analyzeSharedStaffWorks(enrichedStaff);
  const groupedStaffByCategory = groupStaffByCategory(enrichedStaff);

  return {
    id: coreData.id,
    title: coreData.title,
    description: coreData.description,
    season: coreData.season,
    seasonYear: coreData.seasonYear,
    genres: coreData.genres,
    tags: coreData.tags,
    trailerUrl: coreData.trailerUrl,
    coverImageUrl: coreData.coverImageUrl,
    coverImageUrlXL: coreData.coverImageUrlXL,
    bannerImageUrl: coreData.bannerImageUrl,
    staff: enrichedStaff,
    sharedStaffWorks,
    groupedStaffByCategory,
  };
}
