import { getAnimeDetails } from "./getAnimeDetails";
import { getRandomRecentAnime } from "./getRandomRecentAnime";

async function main() {
  const arg = process.argv[2];
  const id = arg ? parseInt(arg, 10) : (await getRandomRecentAnime()).id;

  console.log(`🎲 Anime ID: ${id}${arg ? " (provided)" : " (random)"}`);

  try {
    const anime = await getAnimeDetails(id);

    console.log(`\n📺 Title: ${anime.title}`);
    console.log(`📝 Description: ${anime.description?.slice(0, 200) ?? "(No description)"}...`);
    console.log(`📅 Season: ${anime.season} ${anime.seasonYear}`);
    console.log(`🎭 Genres: ${anime.genres.join(", ")}`);
    console.log(`🏷 Tags: ${anime.tags.join(", ")}`);

    console.log(`\n🎨 Staff Summary:`);
    for (const category of ["creative", "visual", "audio", "theme-song", "other"] as const) {
      const entries = anime.groupedStaffByCategory[category];
      if (!entries || entries.length === 0) continue;

      console.log(`\n→ ${category.toUpperCase()}`);

      for (const person of entries) {
        console.log(`- ${person.name} (${person.roles.join(", ")})`);

        const formatted = person.notableWorks.map((w) => {
          const roleList = w.roles.join(", ");
          return `${w.title} (${roleList})`;
        });

        if (formatted.length > 0) {
          console.log(`  🌟 Notable: ${formatted.join(", ")}`);
        }
      }
    }

    console.log(`\n🤝 Shared Staff Works:`);
    for (const shared of anime.sharedStaffWorks.slice(0, 5)) {
      console.log(`- ${shared.title} (${shared.sharedStaff.length} people):`);
      for (const staff of shared.sharedStaff) {
        const roleList = [...new Set(staff.roles)].join(", ");
        console.log(`  • ${staff.name} — ${roleList}`);
      }
    }
  } catch (err) {
    console.error(`❌ Failed to load anime ID ${id}`);
    console.error(err);
  }
}

main();
