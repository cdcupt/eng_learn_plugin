import { useState, useEffect, useCallback } from "react";
import type { DailyRecord } from "@/shared/types";
import {
  getOrCreateTodayRecord,
  saveDailyRecord,
  getStreak,
  saveStreak,
} from "@/shared/storage";
import { updateStreak } from "@/shared/utils/scoring";

export function useDailyTasks() {
  const [record, setRecord] = useState<DailyRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const r = await getOrCreateTodayRecord();
    setRecord(r);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback(
    async (updater: (r: DailyRecord) => DailyRecord) => {
      if (!record) return;
      const updated = updater(record);
      setRecord(updated);
      await saveDailyRecord(updated);

      const streak = await getStreak();
      const newStreak = updateStreak(streak, updated);
      if (newStreak !== streak) {
        await saveStreak(newStreak);
      }
    },
    [record]
  );

  return { record, loading, update, reload: load };
}
