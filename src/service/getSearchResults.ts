import { CleanAnime } from "@/types";
import { fetchGraphQL } from "./anilist/fetchGraphQL";

export async function getSearchResults(term: string): Promise<CleanAnime[]> {
  const query = `
    query SearchAnime($term: String) {
      Page(perPage: 10) {
        media(search: $term, type: ANIME, sort: [POPULARITY_DESC]) {
          id
          title {
            romaji
          }
          description(asHtml: true)
          coverImage {
            extraLarge
            large
          }
          bannerImage
          genres
          season
          seasonYear
          siteUrl
          studios(isMain: true) {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    }
  `;

  const variables = { term };
  const data = await fetchGraphQL<{ Page: { media: any[] } }>(query, variables);

  return data.Page.media.map((anime) => ({
    id: anime.id,
    title: anime.title.romaji,
    description: anime.description ?? "",
    coverImageUrl: anime.coverImage?.large ?? "",
    coverImageUrlXL: anime.coverImage?.extraLarge ?? "",
    bannerImageUrl: anime.bannerImage ?? "",
    genres: anime.genres ?? [],
    season: anime.season,
    seasonYear: anime.seasonYear,
    siteUrl: anime.siteUrl,
    studio: anime.studios?.edges?.[0]?.node?.name ?? "",
  }));
}
