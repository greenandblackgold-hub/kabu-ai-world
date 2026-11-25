# KABU AI – የካቡ የመጫወቻ ዓለም

A Windows desktop companion for a two-year-old child. Kabu is a large, bright-red balloon character. The intended interaction language is Tigrinya only.

## Project status

This repository contains the initial Electron desktop shell and a Windows packaging workflow. This is NOT yet the finished AI companion. Reliable Tigrinya speech recognition, natural Tigrinya conversation, child-safe response logic, and long-term learning are not implemented or validated yet.

## Development

- Node.js 22+
- npm install
- npm run dev

## Build a Windows installer

- npm run dist:win
- GitHub Actions also builds a Windows installer on pushes to main and stores it as a workflow artifact.

## Safety and privacy

The app is designed for a very young child. Microphone use must be explicit and visible. Do not collect or upload a child's voice or personal data without a parent-controlled, clearly disclosed consent flow. No speech is transmitted by this starter shell.

## Scope boundary

This repository is dedicated only to KABU AI. Do not connect it to or modify any Black Gold gaming project or infrastructure.
