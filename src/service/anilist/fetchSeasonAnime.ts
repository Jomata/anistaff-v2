import { BasicAnimeCardData, Season } from "@/types";
import { fetchGraphQL } from "./fetchGraphQL";

interface SeasonAnimeRaw {
  id: number;
  title: { romaji: string };
  coverImage: { large: string; extraLarge: string };
  bannerImage: string;
  studios: { nodes: { name: string }[] };
  description: string;
  genres: string[];
}

export async function fetchSeasonAnime(season: Season, year: number): Promise<BasicAnimeCardData[]> {
  const query = `
    query ($season: MediaSeason, $year: Int, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(season: $season, seasonYear: $year, type: ANIME, sort: POPULARITY_DESC) {
          id
          title { romaji }
          coverImage { large, extraLarge }
          bannerImage
          studios { nodes { name } }
          description(asHtml: false)
          genres
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `;

  const allResults: BasicAnimeCardData[] = [];
  let page = 1;
  const perPage = 50;
  let hasNextPage = true;

  while (hasNextPage) {
    const variables = {
      season: season.toUpperCase(),
      year,
      page,
      perPage,
    };

    const data = await fetchGraphQL<{
      Page: {
        media: SeasonAnimeRaw[];
        pageInfo: { hasNextPage: boolean };
      };
    }>(query, variables);

    const rawList = data?.Page?.media ?? [];
    hasNextPage = data?.Page?.pageInfo?.hasNextPage ?? false;

    const mapped = rawList.map((anime) => ({
      id: anime.id,
      title: anime.title.romaji,
      imageUrl: anime.coverImage.large,
      bannerImageUrl: anime.bannerImage,
      imageUrlXL: anime.coverImage.extraLarge,
      studio: anime.studios.nodes[0]?.name ?? "Unknown Studio",
      description: anime.description?.replace(/<[^>]+>/g, "") ?? "No description.",
      genres: anime.genres ?? [],
    }));

    allResults.push(...mapped);
    page++;
  }

  return allResults;
}
