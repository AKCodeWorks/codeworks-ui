# Codeworks UI

A shadcn-svelte registry of Svelte 5 components built with [Bits UI](https://bits-ui.com/) and styled exclusively with Tailwind CSS utilities.

## Commands

```sh
bun run dev             # local documentation site
bun run registry:build  # generate static/r/*.json
bun run check           # Svelte and TypeScript diagnostics
bun run lint            # Prettier and ESLint
bun run build            # registry payloads + production site
```

The native `shadcn-svelte registry build` command validates `registry.json`, rewrites aliases for consuming projects, resolves local registry dependencies, and generates installable payloads in `static/r`.

## Structure

```text
registry.json                         Registry metadata and documentation fields
src/lib/components/ui/<name>/         Canonical component source
src/lib/docs/demos/<name>.svelte      Interactive documentation preview and usage source
src/lib/docs/catalog.ts               Auto-discovers registry items, demos, and source files
src/routes/docs/components/           Shared and generated component documentation UI
static/r/                              Generated registry payloads (do not hand-edit)
```

## Add a component

1. Add the component source and barrel export under `src/lib/components/ui/<name>/`.
2. Add one `registry:ui` item to `registry.json`, including its files, npm dependencies, and optional `meta.docs` API rows.
3. Add `src/lib/docs/demos/<name>.svelte`.
4. Run `bun run build`.

The catalog, sidebar, component route, live preview, usage example, API table, raw source panels, and install command are generated from those files—no new documentation route is needed.

All visual styling belongs in Tailwind utility classes. `src/routes/layout.css` is limited to Tailwind's import and Tailwind theme/keyframe declarations.
