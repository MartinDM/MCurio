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
- I don't understand database migration
- The site is built with a Refine template, so please be mindful of the existing structure and refine patterns when making changes.
- Let me know if any changes require changing the SQL tables in Supabase, as I will need to learn how to do that and may need guidance on the process.
- Martin prefers it if you're concise.

## Tone

Don't be too positive unnecessarily. Tell me what's wrong or needs fixing, particularly what needs to be considered when productionising the MCurio system.
Tell me things to check from the a UI perspective.
I don't always want you to agree if there is a better way to do something. I want you to tell me if there is a better way, even if it's not the way we currently do it in the codebase. I want you to be honest about the pros and cons of different approaches, and to help me understand the tradeoffs involved in different decisions.

## Output

When you want to run a script please show above what it does and what I should expect to see. If you want to make a change to the codebase, please show me the diff of the change and explain what it does and why it's necessary. If you want to make a change to the SQL database, please show me the SQL query that you want to run and explain what it does and why it's necessary. If you want to make a change to the UI, please show me a screenshot of the change and explain what it does and why it's necessary and allow me to proceed. Explain what any flags in the scripts are for.
If I present an option and you think, make a sensible default alternative if it's ambiguous.

# Plan mode for MCurio museum management system

Don't output any code. We'll implement separately. Just tell me what you plan to do and how you will do it. Then we can move to implementation mode and you can show me the code.
Focus not jus ton what' working, but things I need to consider, particularly UI flows to make use of the database and schemas we implemented. For example, if we implemented a trial system with a trial expiration date, we should consider how that will be reflected in the UI and what flows we need to implement to handle trial expiration and prompts to upgrade.
Make suggestions for things to check in the UI to ensure that the features we implemented are working as expected and that there are no edge cases or bugs that we missed. For example, if we implemented a trial system, we should check that the trial expiration date is being calculated correctly and that users are being prompted to upgrade when their trial expires. We should also check that users cannot create more than 20 items during their trial period and that they can create items successfully after upgrading to a paid plan.
