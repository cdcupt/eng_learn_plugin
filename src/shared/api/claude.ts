interface ClaudeResponse {
  content: { type: string; text: string }[];
}

async function callClaude(
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error: ${res.status} - ${err}`);
  }

  const data: ClaudeResponse = await res.json();
  return data.content[0]?.text ?? "";
}

export async function explainWord(
  apiKey: string,
  word: string,
  context: string
): Promise<string> {
  const system = `You are an English tutor helping a learner understand unfamiliar words and phrases.
Give clear, simple explanations. Include:
1. The meaning in context
2. A simple definition
3. 2 example sentences using the word/phrase
Keep it concise — under 150 words.`;

  return callClaude(
    apiKey,
    system,
    `I'm reading an article and found this word/phrase I don't understand: "${word}"\n\nContext: "${context}"`
  );
}

export interface WritingReviewResult {
  score: number;
  grammarIssues: { original: string; correction: string; explanation: string }[];
  styleNotes: { original: string; correction: string; explanation: string }[];
  suggestions: string[];
  overallComment: string;
}

export async function reviewWriting(
  apiKey: string,
  topic: string,
  content: string
): Promise<WritingReviewResult> {
  const system = `You are an English writing tutor. Review the student's essay and provide detailed feedback.
You MUST respond with valid JSON only, no markdown fences, in this exact format:
{
  "score": <number 0-100>,
  "grammarIssues": [{"original": "...", "correction": "...", "explanation": "..."}],
  "styleNotes": [{"original": "...", "correction": "...", "explanation": "..."}],
  "suggestions": ["..."],
  "overallComment": "..."
}`;

  const text = await callClaude(
    apiKey,
    system,
    `Topic: "${topic}"\n\nEssay:\n${content}`
  );

  try {
    return JSON.parse(text);
  } catch {
    return {
      score: 0,
      grammarIssues: [],
      styleNotes: [],
      suggestions: [],
      overallComment: text,
    };
  }
}
