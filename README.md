# KABU AI – የካቡ የመጫወቻ ዓለም

KABU AI is a Tigrinya-first, child-friendly browser companion for Google Chrome.

## AI conversation setup
- The app uses Google's Gemini API through the server. The API key is kept only in the Render environment and is never sent to the browser.
- Create a Gemini API key in Google AI Studio: https://aistudio.google.com/app/apikey
- Add it to the KABU Render service as the secret environment variable `GEMINI_API_KEY`.
- Optional: set `GEMINI_MODEL` to a model enabled for your Google AI Studio project. Default: `gemini-3.8-flash`.
- Google offers a free tier for eligible models, with quotas and availability that can change. Free-tier prompts may be used by Google to improve products. Do not send a child's personal or sensitive information.
- The server does not save chat transcripts. The browser keeps recent turns only in the open tab. The API endpoint has a lightweight per-instance request limit.
- If no API key is configured, AI chat returns a clear unavailable state; it does not pretend scripted answers are AI.

## Voice
- Microphone input uses the browser Web Speech Recognition API with a Tigrinya locale request (`ti-ER`). Actual support depends on Chrome, its speech service, device and language availability.
- Spoken replies use browser speech synthesis. A Tigrinya voice must be available for good pronunciation; otherwise text remains available.
- Audio is not uploaded to this app's server. Browser speech recognition may rely on the browser vendor's speech service, so this is not a guarantee of fully offline processing.

## Run locally
- Node.js 22+
- `npm install`
- Set `GEMINI_API_KEY` in the server environment
- `npm run dev`

## Deploy on Render
- Runtime: Node
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Required secret: `GEMINI_API_KEY`
- Optional: `GEMINI_MODEL`

## Privacy and child safety
- Microphone is activated only after a user presses the microphone button.
- Never ask the child for their full name, address, school, phone number, photos, exact location, passwords or other identifying details.
- If a child reports being hurt, scared, lost or in danger, direct them to a parent, guardian or trusted grown-up immediately.
- Kabu is an educational companion, not a substitute for adult supervision.

## Mascot
Kabu is rendered as a large, round, bright-red furry mascot with a prominent belly, two arms, two legs, waving/stepping motion, and a mouth animation while browser speech plays. The greeting text is “ሰላም ካቡየ፣ ደሓን ዲኻ?”

## Limitations
Gemini text models do not all list Tigrinya among their officially supported languages. Tigrinya output quality must be tested in the actual app and may vary. Browser Tigrinya speech recognition and synthesis are separate browser/device capabilities and are not guaranteed.
