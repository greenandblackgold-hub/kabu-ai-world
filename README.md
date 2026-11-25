# KABU AI – የካቡ የመጫወቻ ዓለም

KABU AI is a Tigrinya-first, child-friendly browser companion for Google Chrome.

## Free browser mode
- No API key, paid speech provider, payment card, or server-side audio processing is required.
- Conversation responses are a small local set of child-friendly Tigrinya prompts and learning activities. This is not a general-purpose generative AI model.
- Microphone input uses the browser Web Speech Recognition API with the Tigrinya locale request (`ti-ER`). Actual recognition support depends on Chrome, its speech service, device, and language availability. If it is unavailable, use the text box.
- Spoken replies use the browser's built-in speech synthesis. A Tigrinya voice must be installed/available in the browser or operating system for correct Tigrinya pronunciation. Otherwise, the reply remains visible as text and audio may be unavailable or incorrectly pronounced.
- Audio and text are processed by browser features; this app does not upload the child's microphone recording to its server.
- The conversation is held only in the open browser tab.

## Run locally
- Node.js 22+
- `npm install`
- `npm run dev`

## Deploy on Render
- Runtime: Node
- Build command: `npm install && npm run build`
- Start command: `npm start`
- No secret environment variables are required.

## Privacy and child safety
- Microphone is activated only after a user presses the microphone button.
- No audio recording is sent to the app server.
- Never ask the child for their full name, address, school, phone number, photos, or other identifying details.
- If a child reports being hurt, scared, lost, or in danger, direct them to a parent or trusted grown-up.
- Kabu is a simple educational companion, not a substitute for adult supervision.

## Mascot
Kabu is rendered as a large, round, bright-red furry mascot with a prominent belly, two arms, two legs, waving/stepping motion, and a mouth animation while browser speech plays. The greeting text is “ሰላም ካቡየ፣ ደሓን ዲኻ?”

## Limitations
This free version avoids paid AI APIs. It is a local scripted conversational helper, not an unrestricted LLM. Tigrinya speech recognition and speech synthesis are dependent on browser/device language support and cannot be guaranteed on every Chrome installation.
