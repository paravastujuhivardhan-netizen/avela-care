# AVELA verification notes

This package combines the revised patient and clinician prototype with a bounded Groq integration and browser voice playback. It is a fictional demonstration, not a validated medical service.

Automated checks: `npm run build`, `npm test`, and `npm run lint`. Tests cover 18 example scenarios, emergency and negation variants, record citation integrity, dose-change boundaries, coverage settings, state persistence, request routing, API input validation, emergency bypass, rejection of uncontrolled Groq output, and provider fallback. Lint retains a development-only Fast Refresh warning for the shared context module.

Groq is called only for eligible routine demo instructions, to select one of several exact excerpts. The complete instruction is still shown. Emergency examples do not wait for Groq. Speech output and microphone behavior depend on browser permissions and playback policies.

The current in-memory rate limiter is per-instance unless a distributed KV service is configured. Public deployments need proper abuse controls, authentication, and spending limits before any real use. No real patient data or notifications are supported.
