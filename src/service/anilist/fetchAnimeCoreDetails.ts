import { fetchGraphQL } from "./fetchGraphQL";
import { AniListMedia } from "./anilistTypes";
import { AnimeCoreDetails } from "../../types";

export async function fetchAnimeCoreDetails(id: number): Promise<AnimeCoreDetails> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title { romaji }
        description(asHtml: false)
        season
        seasonYear
        genres
        siteUrl
        tags { name }
        trailer { id site }
        coverImage { large extraLarge }
        bannerImage
        staff {
          edges {
            role
            node {
              id
              name { full }
              siteUrl
            }
          }
        }
      }
    }
  `;

  const { Media } = await fetchGraphQL<{ Media: AniListMedia }>(query, { id });

  return {
    id: Media.id,
    title: Media.title.romaji,
    description: Media.description.replace(/<[^>]+>/g, ""),
    season: Media.season,
    seasonYear: Media.seasonYear,
    genres: Media.genres,
    siteUrl: Media.siteUrl,
    tags: Media.tags.map((t) => t.name),
    trailerUrl: Media.trailer?.site === "youtube" ? `https://www.youtube.com/watch?v=${Media.trailer.id}` : undefined,
    coverImageUrl: Media.coverImage?.large,
    coverImageUrlXL: Media.coverImage?.extraLarge,
    bannerImageUrl: Media.bannerImage,
    staffEdges: Media.staff.edges.map((e) => ({
      id: e.node.id,
      name: e.node.name.full,
      siteUrl: e.node.siteUrl,
      role: e.role,
    })),
  };
}
