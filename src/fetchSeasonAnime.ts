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

export interface SeasonAnimeCardData {
  id: number;
  title: string;
  imageUrl: string;
  studio: string;
  description: string;
  genres: string[];
}

export async function fetchSeasonAnime(season: string, year: number): Promise<SeasonAnimeCardData[]> {
  const query = `
    query ($season: MediaSeason, $year: Int) {
      Page(perPage: 50) {
        media(season: $season, seasonYear: $year, type: ANIME, sort: POPULARITY_DESC) {
          id
          title { romaji }
          coverImage { large, extraLarge }
          bannerImage
          studios { nodes { name } }
          description(asHtml: false)
          genres
        }
      }
    }
  `;

  const variables = { season: season.toUpperCase(), year };

  const data = await fetchGraphQL<{
    Page: {
      media: SeasonAnimeRaw[];
    };
  }>(query, variables);
  const rawList: SeasonAnimeRaw[] = data?.Page?.media ?? [];

  return rawList.map((anime) => ({
    id: anime.id,
    title: anime.title.romaji,
    imageUrl: anime.coverImage.large,
    bannerImageUrl: anime.bannerImage,
    imageUrlXL: anime.coverImage.extraLarge,
    studio: anime.studios.nodes[0]?.name ?? "Unknown Studio",
    description: anime.description?.replace(/<[^>]+>/g, "") ?? "No description.",
    genres: anime.genres ?? [],
  }));
}
