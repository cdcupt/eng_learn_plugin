import type { DailyRecord } from "@/shared/types";
import { CheckInButton } from "../components/CheckInButton";

interface Props {
  record: DailyRecord;
  onUpdate: (updater: (r: DailyRecord) => DailyRecord) => Promise<void>;
}

export function Speaking({ record, onUpdate }: Props) {
  async function handleCheckIn() {
    await onUpdate((r) => ({
      ...r,
      speaking: {
        completed: true,
        checkedInAt: new Date().toISOString(),
      },
    }));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Speaking Practice
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <p className="text-gray-600 text-center mb-6">
          Complete your speaking practice on your phone, then check in here to
          track your progress.
        </p>
        <CheckInButton
          completed={record.speaking.completed}
          onCheckIn={handleCheckIn}
          label="Speaking"
        />
      </div>
    </div>
  );
}
