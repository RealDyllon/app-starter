# Template Profiles

This starter has two practical profiles:

## Core

Use the checked-in `apps/web` app as the baseline profile. It keeps the runtime pieces that are already wired into the current checkout:

- TanStack Start, Router, Query, DB, and devtools
- TanStack Form, Table, Store, and fuzzy matching examples
- oRPC
- Better Auth
- Drizzle ORM with PostgreSQL
- Tailwind v4, Radix UI primitives, and shared UI helpers
- Paraglide i18n
- T3 Env for typed client environment parsing
- Storybook and local build tooling as development-only dependencies

This profile intentionally includes small, routed examples for form, table, and shared store patterns so new projects have concrete copy points for common app surfaces. It still avoids optional batteries that are not imported by the app today, such as AI client/provider packages and sample-data utilities.

For text-heavy products, consider adding `streamdown`, `highlight.js`, and `@tailwindcss/typography` together. `streamdown` gives you a React-friendly Markdown renderer, `highlight.js` covers code block highlighting, and Tailwind Typography provides a polished default prose treatment. They are especially useful for docs, changelogs, AI transcript views, knowledge bases, and rich help content, but they are left out of Core until the app actually renders Markdown or long-form prose.

## Everything

Use the root `create:app` script when you want the kitchen-sink template:

```sh
pnpm create:app
```

That generator currently enables these TanStack add-ons in one pass:

`drizzle,nitro,biome,tanstack-query,storybook,store,better-auth,table,t3env,shadcn,paraglide,oRPC,form,db,ai`

Choose this profile when you know the project will immediately need those batteries and you want the generated wiring up front. Otherwise, start from Core and add features deliberately as imports appear.
