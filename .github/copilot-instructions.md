# Copilot Instructions for MCurio

## Project context

- Tech stack: React + TypeScript + Vite + Ant Design + Refine + Supabase.
- Routing is configured in `src/App.tsx` with `react-router` and Refine `Authenticated` wrappers.
- Data access uses Refine providers in `src/providers/` and Supabase client in `src/lib/supabase.ts`.

## Coding conventions

- Keep changes minimal and scoped to the requested task.
- Prefer existing patterns over introducing new abstractions.
- Use named exports for pages/components where the codebase already does so.
- Preserve current file/folder naming style and import alias usage (`@/...`).
- Do not add one-letter variable names.
- Avoid inline code comments unless explicitly requested.

## UI and component rules

- Use existing Ant Design + Refine components already used in the codebase.
- Reuse existing layout and page structure patterns.
- Do not introduce new design systems, colors, or visual frameworks.

## Routing/auth rules

- Keep authenticated routes under the existing `Authenticated` + `Layout` structure.
- Login behavior should continue to use Supabase Auth (`signInWithPassword`).
- If adjusting redirects, keep `/login` for unauthenticated users and `/` as home.

## Data and Supabase rules

- Use the shared Supabase client from `src/lib/supabase.ts`.
- Prefer updating GraphQL queries/types in existing query files per route/module.
- Never hardcode secrets or service-role keys in source files.
- For local/dev auth users, prefer seed/setup scripts instead of manual ad-hoc code.
- Add any key info or changes to scripts into the README for future reference.

## Quality checks

- After meaningful code changes, run targeted checks first, then broader checks:
  - `npm run build`
- Do not fix unrelated failures outside the requested scope.

## What to avoid

- Do not refactor large areas unless explicitly asked.
- Do not rename routes/resources/components without clear requirement.
- Do not change public behavior beyond the requested fix/feature.
- If in Plan mode Do not suggest code; I will shortly move to Implementation. Just tell me what you plan to do.

## Author

- I'm Martin
- When I come back to a session, please help me regain context where I am and what we were doing. Ressure me with an emoji.
- Martin is quite new to SQL, so please be patient and provide clear explanations if you need to make changes in that area/SQL.
- I don't really understand database migration
- The site is built with a Refine template, so please be mindful of the existing structure and patterns when making changes.s
- Let me know if any changes require changing the SQL tables in Supabase, as I will need to learn how to do that and may need guidance on the process.sw
- Martin prefers it if you're concise.
