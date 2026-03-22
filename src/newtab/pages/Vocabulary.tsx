import { useState, useEffect } from "react";
import type { DailyRecord, VocabularyEntry } from "@/shared/types";
import { getVocabulary, saveVocabulary } from "@/shared/storage";
import { CheckInButton } from "../components/CheckInButton";

interface Props {
  record: DailyRecord;
  onUpdate: (updater: (r: DailyRecord) => DailyRecord) => Promise<void>;
}

type Tab = "words" | "quiz" | "checkin";

export function Vocabulary({ record, onUpdate }: Props) {
  const [tab, setTab] = useState<Tab>("words");
  const [vocab, setVocab] = useState<VocabularyEntry[]>([]);
  const [search, setSearch] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    getVocabulary().then(setVocab);
  }, []);

  const filtered = vocab.filter(
    (v) =>
      v.word.toLowerCase().includes(search.toLowerCase()) ||
      v.explanation.toLowerCase().includes(search.toLowerCase())
  );

  const quizWords = vocab.filter((v) => !v.mastered);

  async function handleCheckIn() {
    await onUpdate((r) => ({
      ...r,
      vocabulary: {
        completed: true,
        checkedInAt: new Date().toISOString(),
      },
    }));
  }

  async function markMastered(id: string) {
    const updated = vocab.map((v) =>
      v.id === id ? { ...v, mastered: true } : v
    );
    setVocab(updated);
    await saveVocabulary(updated);
  }

  function nextQuiz() {
    setShowAnswer(false);
    setQuizIndex((i) => (i + 1) % Math.max(1, quizWords.length));
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "words", label: `Word List (${vocab.length})` },
    { key: "quiz", label: "Quiz" },
    { key: "checkin", label: "Check In" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Vocabulary</h1>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "words" && (
        <>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search words..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {vocab.length === 0
                ? "No words saved yet. Highlight words while reading to add them!"
                : "No matches found."}
            </p>
          ) : (
            <div className="space-y-3">
              {filtered.map((entry) => (
                <div
                  key={entry.id}
                  className={`bg-white rounded-xl border border-gray-200 p-4 ${
                    entry.mastered ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      {entry.word}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {entry.addedDate}
                      </span>
                      {entry.mastered ? (
                        <span className="text-xs text-green-600 font-medium">
                          Mastered
                        </span>
                      ) : (
                        <button
                          onClick={() => markMastered(entry.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark mastered
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {entry.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "quiz" && (
        <div className="text-center">
          {quizWords.length === 0 ? (
            <p className="text-gray-500 py-8">
              No words to quiz. Add some words while reading!
            </p>
          ) : (
            <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
              <p className="text-sm text-gray-500 mb-4">
                {quizIndex + 1} / {quizWords.length}
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {quizWords[quizIndex]?.word}
              </h2>

              {showAnswer ? (
                <>
                  <p className="text-gray-700 whitespace-pre-wrap mb-6 text-left">
                    {quizWords[quizIndex]?.explanation}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() =>
                        markMastered(quizWords[quizIndex]?.id).then(nextQuiz)
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      I know this
                    </button>
                    <button
                      onClick={nextQuiz}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Show Answer
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {tab === "checkin" && (
        <CheckInButton
          completed={record.vocabulary.completed}
          onCheckIn={handleCheckIn}
          label="Vocabulary"
        />
      )}
    </div>
  );
}
