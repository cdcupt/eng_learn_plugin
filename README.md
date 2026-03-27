# English Learning Tracker

A Chrome extension for building daily English learning habits with 5 practice tasks: Reading, Writing, Vocabulary, Speaking, and Listening.

## Features

- **Reading** — Read NYT articles and take AI-generated comprehension quizzes
- **Writing** — Practice writing on random topics with AI feedback (grammar, style, score 0-100)
- **Vocabulary** — Build a word list from any webpage via right-click; review with flashcard quizzes
- **Speaking** — AI-generated sentences with connected speech annotations (linking, elision, assimilation, reduction, contraction, intrusion), reference audio, record yourself speaking, pronunciation evaluated via ByteDance ASR + AI scoring (accuracy & fluency)
- **Listening** — IELTS-style listening practice with HD audio (OpenAI TTS or ByteDance OpenSpeech) and 5-question quizzes
- **Streak Tracking** — Complete all 5 tasks for a perfect day; track streaks and weekly stats
- **Side Panel** — Quick task overview and check-in without leaving your current tab
- **Context Menu** — Select any word on a webpage → right-click → get an AI-powered explanation

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS v4
- Vite + CRXJS (Chrome extension bundling)
- Chrome Storage API
- Multi-provider AI (Kimi, OpenAI, Claude, DeepSeek, Gemini)
- OpenAI TTS or ByteDance OpenSpeech (Volcengine) for listening/speaking audio
- ByteDance ASR (OpenSpeech) for speaking practice pronunciation verification

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist/` folder
5. Open a new tab to see the dashboard, then go to **Settings** to configure:
   - **NYT API Key** — for reading articles ([developer.nytimes.com](https://developer.nytimes.com))
   - **AI Provider & Key** — for content generation, writing review, and word explanations
   - **TTS Provider** (optional) — Choose OpenAI TTS or ByteDance OpenSpeech for HD listening audio; falls back to browser speech if not set
     - *OpenAI:* API key + voice selection (alloy, echo, fable, onyx, nova, shimmer)
     - *ByteDance:* App ID, access token, and cluster from [Volcengine console](https://console.volcengine.com/speech/app) + voice selection (Jackson, Ariana, etc.)

## Development

```bash
npm run dev      # Dev server with HMR
npm run build    # Production build to dist/
```

## License

MIT
