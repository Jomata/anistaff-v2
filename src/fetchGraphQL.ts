import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  reservoir: 30,
  reservoirRefreshAmount: 30,
  reservoirRefreshInterval: 60 * 1000,
  maxConcurrent: 1,
  minTime: 50,
  rejectOnDrop: false,
});

export async function fetchGraphQL<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  return limiter.schedule(async () => {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AniList GraphQL Error: ${res.status} — ${text}`);
    }

    const json: { data: T } = await res.json();
    return json.data;
  });
}
