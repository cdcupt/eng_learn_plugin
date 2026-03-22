import { useState, useEffect, useCallback } from "react";

export function useStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => Promise<void>, boolean] {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.storage.local.get(key).then((result) => {
      if (result[key] !== undefined) {
        setData(result[key] as T);
      }
      setLoading(false);
    });

    const listener = (changes: { [k: string]: chrome.storage.StorageChange }) => {
      if (changes[key]) {
        setData(changes[key].newValue as T);
      }
    };
    chrome.storage.local.onChanged.addListener(listener);
    return () => chrome.storage.local.onChanged.removeListener(listener);
  }, [key]);

  const save = useCallback(
    async (value: T) => {
      setData(value);
      await chrome.storage.local.set({ [key]: value });
    },
    [key]
  );

  return [data, save, loading];
}
