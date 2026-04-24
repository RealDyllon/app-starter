# Template Profiles

This starter has two practical profiles:

## Core

Use the checked-in `apps/web` app as the baseline profile. It keeps the runtime pieces that are already wired into the current checkout:

- TanStack Start, Router, Query, DB, and devtools
- oRPC
- Better Auth
- Drizzle ORM with PostgreSQL
- Tailwind v4, Radix UI primitives, and shared UI helpers
- Paraglide i18n
- Storybook and local build tooling as development-only dependencies

This profile intentionally does not include optional batteries that are not imported by the app today, such as AI client/provider packages, markdown/highlighting helpers, table/form/store helpers, or sample-data utilities.

## Everything

Use the root `create:app` script when you want the kitchen-sink template:

```sh
pnpm create:app
```

That generator currently enables these TanStack add-ons in one pass:

`drizzle,nitro,biome,tanstack-query,storybook,store,better-auth,table,t3env,shadcn,paraglide,oRPC,form,db,ai`

Choose this profile when you know the project will immediately need those batteries and you want the generated wiring up front. Otherwise, start from Core and add features deliberately as imports appear.
