import { BasicAnimeCardData } from "@/types";
import { fetchGraphQL } from "./anilist/fetchGraphQL";

export async function getSearchResults(term: string): Promise<BasicAnimeCardData[]> {
  const query = `
    query SearchAnime($term: String) {
      Page(perPage: 10) {
        media(search: $term, type: ANIME, sort: [POPULARITY_DESC]) {
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

  const variables = { term };
  const data = await fetchGraphQL<{ Page: { media: any[] } }>(query, variables);

  return data.Page.media.map((anime) => ({
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
