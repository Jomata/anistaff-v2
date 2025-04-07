import { fetchGraphQL } from "./fetchGraphQL";

export async function getRandomRecentAnime(minYear = 2020): Promise<{ id: number; title: string }> {
  const page = Math.floor(Math.random() * 50) + 1;

  const query = `
    query ($date: FuzzyDateInt, $page: Int) {
      Page(page: $page, perPage: 1) {
        media(
          type: ANIME
          startDate_greater: $date
          sort: POPULARITY_DESC
        ) {
          id
          title {
            romaji
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL<{
    Page: {
      media: {
        id: number;
        title: { romaji: string };
      }[];
    };
  }>(query, {
    date: minYear * 10000, // e.g., 2020 → 20200000
    page,
  });

  const anime = data.Page.media[0];
  return {
    id: anime.id,
    title: anime.title.romaji,
  };
}
