interface Props {
  completed: boolean;
  onCheckIn: () => void;
  label: string;
}

export function CheckInButton({ completed, onCheckIn, label }: Props) {
  if (completed) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-green-700">Done for today!</h2>
        <p className="text-gray-500 mt-2">{label} practice checked in</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <p className="text-gray-600 mb-6">
        Did you complete your {label.toLowerCase()} practice today?
      </p>
      <button
        onClick={onCheckIn}
        className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors"
      >
        Check In
      </button>
    </div>
  );
}
