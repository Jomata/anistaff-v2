import { fetchGraphQL } from "./fetchGraphQL";
import { AniListMedia } from "./anilistTypes";
import { AnimeCoreDetails } from "./types";

export async function fetchAnimeCoreDetails(id: number): Promise<AnimeCoreDetails> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title { romaji }
        description
        season
        seasonYear
        genres
        tags { name }
        trailer { id site }
        coverImage { large }
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
    description: Media.description,
    season: Media.season,
    seasonYear: Media.seasonYear,
    genres: Media.genres,
    tags: Media.tags.map((t) => t.name),
    trailerUrl: Media.trailer?.site === "youtube" ? `https://www.youtube.com/watch?v=${Media.trailer.id}` : undefined,
    coverImageUrl: Media.coverImage?.large,
    staffEdges: Media.staff.edges.map((e) => ({
      id: e.node.id,
      name: e.node.name.full,
      siteUrl: e.node.siteUrl,
      role: e.role,
    })),
  };
}
