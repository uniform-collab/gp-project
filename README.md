# GP Example Project

Next.js (Pages Router) + [Uniform](https://uniform.app).

## Run locally

Requires Node.js 22 or 24 (see `.nvmrc`).

1. Install packages:
   ```bash
   npm install
   ```
2. Create `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in `.env` (see Environment).
4. Start the site:
   ```bash
   npm run dev
   ```

Open http://localhost:3000.

## Environment

| Variable | Value |
| --- | --- |
| `UNIFORM_PROJECT_ID` | Project ID (in the project's URL on uniform.app) |
| `UNIFORM_API_KEY` | Key of a [service account](https://docs.uniform.app/docs/guides/api-access/service-accounts) with the Developer role on this project (team page → Security → Service Accounts) |
| `UNIFORM_PREVIEW_SECRET` | The `secret=` value from the project's Preview URL (Uniform → Settings → Preview) |

## Uniform Canvas

Canvas loads the site from the Preview URL (Uniform → Settings → Preview):

```
http://localhost:3000/api/preview?secret=<UNIFORM_PREVIEW_SECRET>
```

Keep `npm run dev` running while editing in Canvas.

## Structure

| Path | Contents |
| --- | --- |
| `src/pages/[[...path]].tsx` | All pages |
| `src/pages/api/preview.ts` | Canvas preview |
| `src/pages/404.tsx` | Not found page, from the composition at `/404` |
| `src/pages/500.tsx` | Server error page, without Uniform |
| `src/pages/playground.tsx` | Canvas component and pattern preview |
| `src/components/` | React components |
| `src/components/index.ts` | Uniform component type → React component |
| `src/uniform/` | Uniform helpers |
| `uniform-data/` | Uniform model and content (YAML) |

## Add a component

1. Create the component in Uniform and allow it in a slot.
2. Run `npm run uniform:pull`, so `uniform-data/` has it.
3. Add a React component in `src/components/`.
4. Register it in `src/components/index.ts`.

## Sync

```bash
npm run uniform:pull   # uniform sync pull: Uniform → uniform-data/
npm run uniform:push   # uniform sync push: uniform-data/ → Uniform
```

Both mirror: a push makes the project match `uniform-data/`, removing anything
that is not in it, and a pull makes `uniform-data/` match the project. A push
also publishes compositions, entries and patterns. Commit before you sync so you
can always go back.

More options: [Uniform CLI sync commands](https://docs.uniform.app/docs/guides/cli/commands/sync).

## Scripts

| Command | |
| --- | --- |
| `npm run dev` | Dev server, draft content |
| `npm run build` / `npm start` | Production build, published content |
| `npm run lint` / `npm run typecheck` | Checks |
| `npm run format` | Format with Prettier |
| `npm run uniform:pull` / `uniform:push` | Sync `uniform-data/` |
| `npm run uniform:manifest` | Download the published Context manifest (run by `dev` and `build`) |
| `npm run uniform:publish` | Publish the Context manifest after changing personalization or tests |
