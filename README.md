# GPT-5.6 Next.js Chatbot

A simple Next.js 16 chatbot using the official OpenAI JavaScript/TypeScript SDK and the OpenAI **Responses API**.

## Included GPT models

- `gpt-5.6-sol` — highest-quality general GPT-5.6 model for difficult reasoning and coding
- `gpt-5.6-terra` — balanced intelligence and cost
- `gpt-5.6-luna` — fast, cost-efficient model for high-volume use

The UI also lets you select the supported reasoning effort.

## Requirements

- Node.js 22+
- An OpenAI API key

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment example:

   **Windows PowerShell**

   ```powershell
   Copy-Item .env.example .env.local
   ```

   **macOS/Linux**

   ```bash
   cp .env.example .env.local
   ```

3. Open `.env.local` and replace the placeholder with your real API key:

   ```env
   OPENAI_API_KEY=sk-your-real-key
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`.

## Important security note

The API key is used only in `app/api/chat/route.ts`, which runs on the server. Do not place your secret key in `app/page.tsx`, browser JavaScript, or any variable prefixed with `NEXT_PUBLIC_`.

## Main files

- `app/page.tsx` — chat UI and model/reasoning selectors
- `app/api/chat/route.ts` — server-side OpenAI Responses API call
- `app/globals.css` — styling
- `app/layout.tsx` — root layout and metadata
- `.env.example` — environment variable template

## Notes

The available model list can change over time or differ by OpenAI account/API access. If a model returns an access error, choose another model that is enabled for your API project.
