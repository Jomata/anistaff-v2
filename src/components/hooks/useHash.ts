import { useCallback, useEffect, useState } from "react";

export function useHash(
  key: string,
  defaultValue: string | null = null
): [string | null, (v: string) => void, () => void] {
  const getValue = useCallback((): string | null => {
    if (typeof window === "undefined") return defaultValue;
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    return hashParams.get(key) ?? defaultValue;
  }, [key, defaultValue]);

  const [value, setValue] = useState<string | null>(() => getValue());

  useEffect(() => {
    const onHashChange = () => {
      setValue(getValue());
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [getValue]);

  const set = useCallback(
    (newValue: string) => {
      if (typeof window === "undefined") return;
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      hashParams.set(key, newValue);
      window.history.replaceState(null, "", `#${hashParams.toString()}`);
      setValue(newValue);
    },
    [key]
  );

  const clear = useCallback(() => {
    if (typeof window === "undefined") return;
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    hashParams.delete(key);
    const newHash = hashParams.toString();
    window.history.replaceState(
      null,
      "",
      newHash ? `#${newHash}` : window.location.pathname
    );
    setValue(null);
  }, [key]);

  return [value, set, clear];
}
