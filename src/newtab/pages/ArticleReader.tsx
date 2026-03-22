import { useState, useCallback } from "react";
import type { Article } from "@/shared/types";
import { getSettings, addVocabularyEntry } from "@/shared/storage";
import { explainWord } from "@/shared/api/claude";
import { v4 as uuid } from "uuid";
import { getTodayKey } from "@/shared/utils/date";

interface Props {
  article: Article;
  onBack: () => void;
  onMarkRead: () => void;
  isRead: boolean;
}

interface Popover {
  text: string;
  x: number;
  y: number;
  explanation: string | null;
  loading: boolean;
  saved: boolean;
}

export function ArticleReader({ article, onBack, onMarkRead, isRead }: Props) {
  const [popover, setPopover] = useState<Popover | null>(null);

  const handleTextSelect = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setPopover(null);
      return;
    }

    const text = selection.toString().trim();
    if (!text || text.length > 200) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setPopover({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      explanation: null,
      loading: false,
      saved: false,
    });
  }, []);

  async function handleExplain() {
    if (!popover) return;

    setPopover({ ...popover, loading: true });

    try {
      const settings = await getSettings();
      if (!settings?.claudeApiKey) {
        setPopover({
          ...popover,
          loading: false,
          explanation: "Please set your Claude API key in Settings.",
        });
        return;
      }

      const context = `${article.headline}. ${article.abstract}. ${article.body}`;
      const explanation = await explainWord(
        settings.claudeApiKey,
        popover.text,
        context
      );
      setPopover({ ...popover, loading: false, explanation });
    } catch (e) {
      setPopover({
        ...popover,
        loading: false,
        explanation: `Error: ${e instanceof Error ? e.message : "Failed to explain"}`,
      });
    }
  }

  async function handleSaveVocab() {
    if (!popover || !popover.explanation) return;

    await addVocabularyEntry({
      id: uuid(),
      word: popover.text,
      sentence: article.body.slice(0, 200),
      explanation: popover.explanation,
      articleId: article.id,
      addedDate: getTodayKey(),
      reviewCount: 0,
      lastReviewed: null,
      mastered: false,
    });

    setPopover({ ...popover, saved: true });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="text-blue-600 hover:text-blue-800 text-sm mb-6 inline-flex items-center gap-1"
      >
        ← Back to articles
      </button>

      <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
        {article.section}
      </span>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-4">
        {article.headline}
      </h1>

      <div
        className="prose prose-gray max-w-none text-gray-800 leading-relaxed"
        onMouseUp={handleTextSelect}
      >
        <p className="text-lg text-gray-700 font-medium mb-4">
          {article.abstract}
        </p>
        <p>{article.body}</p>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Read full article on NYT →
        </a>
        {!isRead && (
          <button
            onClick={onMarkRead}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Mark as Read
          </button>
        )}
        {isRead && (
          <span className="text-green-600 font-medium">✓ Read</span>
        )}
      </div>

      {popover && (
        <div
          className="fixed z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-4 max-w-sm"
          style={{
            left: Math.min(popover.x, window.innerWidth - 400),
            top: Math.max(popover.y - 200, 10),
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900">
              "{popover.text}"
            </span>
            <button
              onClick={() => setPopover(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {popover.explanation ? (
            <>
              <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">
                {popover.explanation}
              </p>
              {popover.saved ? (
                <span className="text-green-600 text-sm">
                  ✓ Saved to vocabulary
                </span>
              ) : (
                <button
                  onClick={handleSaveVocab}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save to Vocabulary
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleExplain}
              disabled={popover.loading}
              className="text-sm px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {popover.loading ? "Explaining..." : "Explain"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
