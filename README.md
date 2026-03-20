# Splitwise AI Prototype

An AI-powered expense splitting feature for Splitwise. Describe how to split a bill in plain English, attach a receipt photo, or both — and the app figures out who owes what.

---

## Demo

The app is split into two screens:

**Add Expense** — enter the total amount and a description.

**Split** — view group members, choose a split type, and use the AI prompt box at the bottom to describe how the bill should be divided. The AI sets the split type and per-person values instantly. Everything is still editable manually after.

---

## Features

- **Natural language splitting** — "John only had the salad, split the rest equally" or "Sarah and Mike are paying together"
- **Receipt image parsing** — attach a photo of a receipt; the AI extracts line items and the total, then uses that as context for the split
- **Multi-turn corrections** — follow up with adjustments ("actually exclude Alice") without starting over
- **Four split modes** — equal shares, weighted shares, percentages, or fixed dollar amounts
- **Calculator tool** — the AI verifies its own arithmetic using a server-side calculator, catching rounding errors and proportional tax/tip splits

---

## How It Works

```
User types instruction (+ optional receipt image)
        │
        ▼
[Image Parser API]  ←── only if image attached
  Vision model extracts line items + total
  Retries once if items don't sum to total
        │
        ▼
[Split API]
  Reasoning model + calculator tool
  Structured output: { splitType, memberValues }
        │
        ▼
UI updates split type and per-person amounts
```

The two AI steps are intentionally separate — vision models read receipts better, reasoning models handle math and instructions better. Each does one thing.

---

## Getting Started

### Prerequisites

- Node.js 18+
- An OpenAI API key (or swap models in `src/lib/model-registry.ts`)

### Install

```bash
cd app
npm install
```

### Environment variables

Create `app/.env.local`:

```env
OPENAI_API_KEY=your_key_here
AUTH_USERNAME=your_username
AUTH_PASSWORD=your_password
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Log in with the credentials from your `.env.local`.

---

## Project Structure

```
app/
├── src/
│   ├── app/
│   │   ├── add-expense/        # Add expense page
│   │   ├── split/              # Split page + layout
│   │   ├── api/
│   │   │   ├── split/          # Streaming split API (streamText + tool)
│   │   │   └── parse-image/    # Receipt parsing API (generateText + retry)
│   │   └── login/              # Auth page
│   ├── components/             # UI components (MemberAvatar, AiPromptBox, icons)
│   ├── lib/                    # Contexts, schemas, model registry
│   └── prompts/                # System prompts
└── sst.config.ts               # AWS deployment config
```

---

## Deployment

The app is deployed to AWS Lambda via [SST](https://sst.dev).

```bash
npx sst deploy
```

Auth credentials and API keys are managed as SST Secrets.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| AI SDK | Vercel AI SDK (`streamText`, `generateText`, `useObject`) |
| Models | OpenAI (configurable via model registry) |
| Validation | Zod (with mathematical correctness constraints) |
| Calculator | mathjs |
| Deployment | SST on AWS Lambda |
