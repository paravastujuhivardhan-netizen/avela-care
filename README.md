# AVELA Care — interactive prototype

A light-theme, responsive patient companion and clinician handoff demonstration. All patients, records, conversations and delivery states are fictional. This is **not a validated medical triage service**, a prescribing system, or a monitored clinical inbox.

## Run

Requires Node 24 or newer.

    npm ci
    npm run dev

    npm test
    npm run lint
    npm run build
    npm run preview

The test command builds an isolated runner through Vite and checks routing, exact source passages, dose-change boundaries, negation, updated records, quiet-hour delivery, request deduplication, persistence, reset isolation and multi-day clock behavior. Build output is in dist/.

## Explore

- / — public introduction and interactive preview.
- /patient/home, /patient/chat, /patient/careplan, /patient/records, /patient/careteam, /patient/timeline — dedicated patient views.
- /clinician — responsive clinician inbox, acknowledgment, reply, coverage settings and care-plan version editor.
- **Demo mode** — 18 sample scenarios, patient selection, interface language, large text, clock, onboarding, tour and reset.
- /responsive-check.html — fixed-width 375/768/1440 CSS viewport harness for browser verification. This is not device emulation.

The landing preview uses the local engine. Chat computes its response and emergency pathway locally first. For eligible routine questions, the server asks Groq to select one of a small list of exact fictional source excerpts; only a validated excerpt is displayed, followed by the complete local instruction. The model cannot add medical advice. When Groq is unavailable, the local demo still responds. Some submitted questions and sample instructions are sent to Groq: do not enter actual health information. A scenario switches to its intended patient atomically. Emergency examples render before any network request. Urgent requests use the simulated on-call route outside quiet hours; routine review drafts require confirmation. Direct care-team messages create entries in the local demonstration inbox. No phone call, email, SMS or real notification is sent by the app. The emergency tel:112 link is a real dial link labeled for India.

## Groq and voice

Set `GROQ_API_KEY` (or the existing `GROQ_API_KEY_1`) as a **server-side** production environment variable in Vercel and redeploy after changes. Never put it in client code or a `VITE_` variable. `GROQ_MODEL` is optional. The Vercel `/api/chat` function calls Groq; plain `npm run dev` serves the frontend only, so its local fallback is expected. Use a Vercel development environment when testing the function. The supplied key is never included in this source package. API rate limiting uses a per-instance memory fallback unless an external KV connection is configured; it is not sufficient protection for a public production service.

Spoken responses use browser speech synthesis and attempt automatic playback by default. Users can turn voice off, pause, stop or replay a reply. Autoplay and voice support depend on browser/device settings. Voice input uses the browser’s speech recognition and requires microphone permission; review the transcript before submitting.

## State and records

All demo business state and preferences persist in this browser under avela_prototype_state_v2, including conversations, requests, replies, records, instruction versions, clock, quiet hours and check-ins. A storage-event listener updates business state across same-origin tabs; this is not a multi-user database and simultaneous cross-tab writes can still conflict. Quota/unavailable-storage errors are surfaced. Reset affects only fictional demo state.

Citations store patient-specific snapshots and original versions; publishing a new instruction changes future answers and leaves prior citations intact. Imported sample text stays unverified and is excluded from instruction authorization. A citation must quote a passage actually present in its source.

Only navigation labels are partly localized to Hindi/Telugu. Clinical records and most replies remain in English, with a visible fallback notice. Voice entry depends on browser speech-recognition support and microphone permission; review the transcription before sending.

## Repair notes

- Pinned conversation composer, independent chat scroller, latest-message positioning and a manual jump control.
- Visible emergency demo on the landing and patient chat, independent emergency access and honest delivery language.
- Dedicated, URL-addressable care plan, records, timeline and direct-care-team views.
- Mobile list/detail inbox navigation, larger input controls, collapsible activity ledger and compact demo settings.
- Direct message → request → acknowledgment/reply → patient conversation.
- Configurable quiet-hour boundaries and explicit unavailable on-call coverage.
- User-entered check-in values, atomic scenario patient selection, persistence and exact citation snapshots.
- Keyboard Escape, focus trapping/restoration and background inertness for dialogs; reduced-motion support.
- Removed unsupported “zero hallucinations,” fabricated performance claims and ambiguous international emergency labels.

## Scope before clinical use

A real deployment for patients needs clinical validation, broader language/negation coverage, authenticated patient/clinician roles, server persistence, verified record ingestion, consent and access controls, a real notification/delivery service, jurisdiction-specific emergency configuration and operational monitoring. Role selection and the care-plan editor here are demonstration controls. Do not enter actual health information.

Framework: React 19, TypeScript 7, Vite 8, Tailwind 4, Lucide.
