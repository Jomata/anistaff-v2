# AniStaff v2

AniStaff v2 is an anime staff analyzer and season preview tool powered by the [AniList GraphQL API](https://docs.anilist.co).  
It helps you discover the creative teams behind your favorite anime — including directors, composers, writers, and more — and highlights other works they’ve contributed to.

## ✨ Features

- 🗓 **Seasonal Anime Preview**: Browse current and upcoming anime by season.
- 🔍 **Search**: Find anime by title and explore its staff details.
- 👥 **Staff Breakdown**: Grouped by category (Creative, Visual, Audio, etc.), with notable past works for each staff member.
- 🤝 **Shared Staff Analyzer**: See what other anime share creators with your selected show.
- 🔗 **Shareable URLs**: Link directly to a specific anime via hash-based routing.

## 🚀 Try it out

Deployed to GitHub Pages at:  
[https://jomata.github.io/anistaff-v2](https://jomata.github.io/anistaff-v2)

## 🛠 Tech Stack

- ⚡️ [Vite](https://vitejs.dev/) + [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- 💅 [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- 📦 State: Custom React hooks + react-hookz
- 🚀 API: [AniList GraphQL API](https://docs.anilist.co)
- ⛔️ Rate-limiting: [Bottleneck](https://www.npmjs.com/package/bottleneck) + local caching with TTL

## 🧪 Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📡 Deployment

This app is deployed using GitHub Pages. After running `npm run build`, the `dist/` directory is published using the `vite-plugin-gh-pages` plugin.

## 🙏 Acknowledgments

Anime data and staff info provided by AniList

Built with ❤️ by [@Jomata](https://github.com/Jomata)

## 📄 License

This project is licensed under the GNU GPL v3. See the LICENSE file for details.

## 🧠 Future Ideas

- Staff customization options (i.e. only track whatever you care about)
- Filters and sort options for seasonal view
- Optimize GraphQL querying
