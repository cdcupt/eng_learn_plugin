import type { Page } from "@/shared/types";

const NAV_ITEMS: { page: Page; label: string; icon: string }[] = [
  { page: "dashboard", label: "Dashboard", icon: "📊" },
  { page: "reading", label: "Reading", icon: "📰" },
  { page: "writing", label: "Writing", icon: "✍️" },
  { page: "vocabulary", label: "Vocabulary", icon: "📚" },
  { page: "speaking", label: "Speaking", icon: "🎙️" },
  { page: "summary", label: "Weekly Summary", icon: "📈" },
  { page: "settings", label: "Settings", icon: "⚙️" },
];

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Navigation({ currentPage, onNavigate }: Props) {
  return (
    <nav className="w-56 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">
          English Tracker
        </h1>
      </div>
      <ul className="flex-1 py-2">
        {NAV_ITEMS.map(({ page, label, icon }) => (
          <li key={page}>
            <button
              onClick={() => onNavigate(page)}
              className={`w-full text-left px-5 py-3 flex items-center gap-3 text-sm transition-colors ${
                currentPage === page
                  ? "bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
