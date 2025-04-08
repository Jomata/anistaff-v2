import React, { useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { getSearchResults } from "../service/getSearchResults";
import { CleanAnime } from "../types";

interface SearchBarProps {
  onSelect: (anime: CleanAnime) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<CleanAnime[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(term: string) {
    setSearchTerm(term);
    if (term.length < 3) return;
    setLoading(true);
    try {
      const res = await getSearchResults(term);
      setResults(res);
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <Command className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow">
        <CommandInput
          placeholder="Search for any anime..."
          value={searchTerm}
          onValueChange={handleSearch}
        />
        <CommandList>
          {loading && (
            <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
          )}
          <CommandEmpty>No results found.</CommandEmpty>
          {results.map((anime) => (
            <CommandItem
              key={anime.id}
              value={anime.title}
              onSelect={() => onSelect(anime)}
              className="flex gap-2 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2"
            >
              <img
                src={anime.coverImageUrl ?? anime.coverImageUrlXL}
                alt={anime.title}
                className="w-10 h-14 object-cover rounded"
              />
              <div>
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {anime.title}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {anime.season} {anime.seasonYear}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </div>
  );
}
