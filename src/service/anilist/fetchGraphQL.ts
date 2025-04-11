import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  reservoir: 30,
  reservoirRefreshAmount: 30,
  reservoirRefreshInterval: 60 * 1000,
  maxConcurrent: 1,
  minTime: 50,
  rejectOnDrop: false,
});

const memoryCache = new Map<string, { data: any; timestamp: number }>();
const TTL_MS = 1000 * 60 * 60; // 1 hour

function getCacheKey(query: string, variables: Record<string, unknown>): string {
  return JSON.stringify({ query, variables });
}

export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const key = getCacheKey(query, variables);
  const now = Date.now();

  console.debug("Fetching GraphQL data:", { query, variables });

  // 1. Memory Cache
  const memoryEntry = memoryCache.get(key);
  if (memoryEntry && memoryEntry.data as T && now - memoryEntry.timestamp < TTL_MS) {
    console.debug("Cache hit in memory:", { key });
    return Promise.resolve(memoryEntry.data as T);
  }

  // 2. LocalStorage Cache
  const localEntryRaw = localStorage.getItem(key);
  if (localEntryRaw) {
    try {
      const localEntry = JSON.parse(localEntryRaw) as {data:T, timestamp:number} ;
      if (localEntry?.data as T && now - localEntry.timestamp < TTL_MS) {
        console.debug("Cache hit in localStorage:", { key });
        memoryCache.set(key, localEntry);
        return Promise.resolve(localEntry.data);
      }
    } catch (err) {
      console.warn("Failed to parse cached response:", err);
    }
  }

  // 3. Fallback to network request
  console.debug("Cache miss, fetching from network:", { key });
  const result = await limiter.schedule(async () => {
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
    const entry = { data: json.data, timestamp: now };
    memoryCache.set(key, entry);
    localStorage.setItem(key, JSON.stringify(entry));
    return json.data;
  });

  return result;
}
