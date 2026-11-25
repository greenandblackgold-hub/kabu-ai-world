# KABU AI – የካቡ የመጫወቻ ዓለም

KABU AI is a Tigrinya-first voice companion that runs in Google Chrome.

## How it works
1. A parent opens the HTTPS website and grants microphone permission.
2. The child presses the microphone button to speak (up to 20 seconds per turn), then presses it again to finish.
3. The server transcribes Tigrinya with Addis Scribe, asks the language model for a short child-safe Tigrinya reply, and generates spoken Tigrinya audio with Addis Voices 2.
4. The browser plays the reply and keeps a short conversation history in memory for follow-up turns.

## Required configuration
Set `ADDIS_API_KEY` as a secret environment variable on the Render service. Never put it in browser code or GitHub. The API key is not included in this repository. Without this key, the website shell loads but voice turns return a clear setup message.

## Run locally
- Node.js 22+
- `npm install`
- Set `ADDIS_API_KEY` in the shell environment
- `npm run dev`

## Deploy on Render
- Runtime: Node
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variable: `ADDIS_API_KEY` (secret)
- The app serves the Chrome page and the private API from the same HTTPS service.

## Privacy and child safety
- Microphone is activated only after a user presses the button.
- Audio is sent to the configured speech service for transcription and is not stored by this app.
- Conversation history is held only in the open browser tab and cleared by “ዕላል ኣሕድስ” or closing the tab.
- Kabu is instructed to use short, gentle, age-appropriate Tigrinya, avoid collecting personal information, and direct a child to a parent for unsafe or distressing situations.
- This application is not a substitute for adult supervision.

## Status
The Chrome app now renders Kabu as a large, round, bright-red furry mascot with a prominent belly, two arms, two legs, waving/stepping motion, and an animated mouth while speech plays. The opening greeting is “ሰላም ካቡየ፣ ደሓን ዲኻ?” in Tigrinya. Chrome may block sound autoplay until the user interacts with the page; clicking Kabu plays the greeting.

The microphone recording, server-side Tigrinya transcription, child-safe conversational response, and spoken Tigrinya reply flow are implemented. Addis Scribe documents Tigrinya STT (`language=ti`), and Addis Voices 2 documents seven Tigrinya voices. The live service must have the owner's `ADDIS_API_KEY` configured in Render for voice features. A production smoke-test workflow can verify the live greeting, transcription, chat response, and reply audio when explicitly triggered with a `[verify-kabu-voice]` commit message. Native-speaker review is still recommended for Tigrinya wording and pronunciation before production use.

## Project isolation
This repository is dedicated only to KABU AI. It must not connect to or modify any Black Gold gaming project or infrastructure.
