import React, { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { getSearchResults } from "../service/getSearchResults";
import { BasicAnimeCardData } from "../types";
import { useAsync, useDebouncedCallback } from "@react-hookz/web";

interface SearchBarProps {
  onSelect: (anime: BasicAnimeCardData) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const minSearchLength = 3;

  const [searchState, { execute }] = useAsync(
    async (term: string): Promise<BasicAnimeCardData[]> => {
      return await getSearchResults(term);
    },
    undefined
  );

  const debouncedSearch = useDebouncedCallback(
    (term: string) => {
      if (term.length >= minSearchLength) {
        execute(term);
      } else {
        setOpen(false); // Close popover if term is too short
      }
    },
    [execute],
    500
  );

  // When results change, open the results + refocus
  useEffect(() => {
    if (searchState.result) {
      setOpen(true);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [searchState.result]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  }

  function handleSelect(anime: BasicAnimeCardData) {
    onSelect(anime);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-full max-w-md">
          <input
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow text-sm"
            placeholder="Search for an anime..."
            value={searchTerm}
            onChange={handleChange}
            ref={inputRef}
          />
        </div>
      </PopoverTrigger>
      {searchState?.result && searchState?.result.length > 0 && (
        <PopoverContent className="w-[450px] max-h-96 overflow-y-auto p-0 z-50">
          <Command className="bg-white dark:bg-gray-900 border-none">
            <CommandList>
              {searchState.status === "loading" && (
                <div className="px-4 py-2 text-sm text-gray-500">
                  Loading...
                </div>
              )}
              <CommandEmpty>No results found.</CommandEmpty>
              {searchState.result.map((anime) => (
                <CommandItem
                  key={anime.id}
                  onSelect={() => handleSelect(anime)}
                  className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <img
                    src={anime.imageUrl}
                    alt={anime.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                  <div className="flex flex-col">
                    <p className="font-medium">{anime.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {anime.seasonYear}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
