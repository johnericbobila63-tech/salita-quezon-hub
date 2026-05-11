import { useEffect, useState, useCallback } from "react";

const KEY = "boses-saved-words";

const read = (): string[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (ids: string[]) => {
  localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("saved-words-changed"));
};

export const useSavedWords = () => {
  const [ids, setIds] = useState<string[]>(() => read());

  useEffect(() => {
    const refresh = () => setIds(read());
    window.addEventListener("saved-words-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("saved-words-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const isSaved = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback((id: string) => {
    const current = read();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    write(next);
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((x) => x !== id));
  }, []);

  return { ids, isSaved, toggle, remove };
};
