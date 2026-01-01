# TENXTEN

The Proving Ground for 10x10 Architects.

---

## THE PROBLEM

AI has democratized code generation. Anyone with a keyboard can now produce syntax. Cursor, Copilot, Claude—they write code for you. Congratulations. You and everyone else.

But here's what the "prompt and pray" crowd doesn't understand: **generating code is not engineering.**

Copying a snippet that compiles is not architecture. Watching an AI hallucinate a solution and then pasting it anyway is not debugging. Typing "fix this" into a chat window until something works is not problem-solving.

It's gambling with extra steps.

---

## THE DEFINITION

**10x10** is the multiplier effect:

```
10x BEFORE AI × 10x WITH AI = 100x
```

A 10x developer before AI understood systems, memory, state, failure modes, and the cost of bad abstractions. They spent years in the trenches.

A 10x developer *with* AI uses that foundation to leverage these tools at a velocity that prompt kiddies cannot comprehend. They don't ask the AI to think for them—they use it to execute faster what they already know needs to be built.

If you were a 1x developer before AI, you are now a 1x developer with a very expensive autocomplete.

---

## THE FILTER

This repository exists to separate signal from noise.

We are not interested in:
- Developers who give up when the AI hallucinates
- "Vibe coders" who ship broken abstractions
- Anyone who thinks copy-pasting is a skill
- The "it works on my machine" crowd who never learned why

We are looking for:
- Engineers who spend 15-16 hours in trial-and-error loops to make the impossible work
- Architects who debug the AI's output instead of trusting it blindly
- Builders who understand that **Grit** is the only currency that matters

If you bounce from this page, you weren't meant to be here.

---

## INITIALIZATION

If you cannot execute these commands, you do not belong here.

```sh
git clone https://github.com/your-org/tenxten.git
cd tenxten
bun install
bun run dev
```

Requirements:
- `node >= 18`
- `bun >= 1.3` — **This is a bun-only monorepo. No npm. No pnpm. Bun.**
- The ability to read error messages

---

## DEVELOPER ONBOARDING

### Package Manager: Bun

This monorepo uses **bun** exclusively. Do not use `npm` or `pnpm`.

```sh
# Install dependencies (run from root)
bun install

# Add a dependency to a workspace
bun add <package> --filter <workspace>

# Run any script
bun run <script>
```

### Monorepo Commands

All commands are orchestrated via **Turborepo** from the root:

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps in development mode |
| `bun run build` | Build all packages and apps |
| `bun run lint` | Lint all workspaces |
| `bun run check-types` | TypeScript type checking |
| `bun run format` | Format code with Prettier |

### Workspace-Specific Commands

Run commands in specific workspaces using `--filter`:

```sh
# Start the web app only
bun run dev --filter web

# Start Storybook (UI package)
bun run storybook --filter ui

# Build Storybook
bun run build-storybook --filter ui
```

Or navigate directly into the workspace:

```sh
cd apps/web && bun run dev
cd packages/ui && bun run storybook
```

---

## STRUCTURE

```
tenxten/
├── apps/
│   └── web/                 # Next.js 15 Landing Page (Cloudflare deployment)
├── packages/
│   ├── ui/                  # Component Library + Storybook (Vite + Base UI)
│   └── tailwind-config/     # Shared Design Tokens (Tailwind v4)
├── turbo.json               # Turborepo task configuration
├── package.json             # Root workspace config (bun workspaces)
└── bun.lock                 # Bun lockfile (do not delete)
```

### Workspaces

- **`apps/web`** — Next.js 15 with Turbopack. Deploys to Cloudflare via OpenNext.
- **`packages/ui`** — Vite-based component library. Storybook is the first-class citizen for component development.
- **`packages/tailwind-config`** — Shared Tailwind v4 config with design tokens. Consumed by all workspaces.

---

## PROVE YOUR MULTIPLIER

This is not a tutorial. This is not a course. This is not a "learn to code" platform.

This is a **Proof of Work** mechanism.

Build something. Ship something. Break something and fix it.

Or close this tab and go back to asking ChatGPT to write your resume.
