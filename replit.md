# Streaming Bag Control

A mobile console for operating a field streaming bag, including recording, camera, actuator, visibility LED, voice-command, OBS connection, activity history, and appearance controls.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/streaming-bag-control run dev` — run the Expo mobile preview
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- Mobile app: `artifacts/streaming-bag-control`
- Shared bag state and local persistence: `artifacts/streaming-bag-control/context/BagContext.tsx`
- Theme tokens and appearance persistence: `artifacts/streaming-bag-control/constants/colors.ts` and `hooks/useTheme.tsx`
- App routes: `artifacts/streaming-bag-control/app`

## Architecture decisions

- The first build is frontend-first with realistic mock device state and AsyncStorage persistence so hardware and OBS APIs can be connected later without changing the interaction model.
- Recording, camera, actuator, LED, and voice actions share one provider so the home dashboard, controls, and activity timeline stay synchronized.
- Voice control is represented as a press-to-listen flow with a simulated command completion until a platform-specific speech recognition service is selected.

## Product

Operators can start and stop recording, inspect live capture state, switch the camera view, enable or disable the camera and visibility LED, move the actuator arm, trigger a voice command, connect or disconnect OBS Studio, review recent activity, and choose system, light, or dark appearance.

## User preferences

- Keep the product touch-first and mobile-native.
- Prefer `npm run dev` as the Windows-facing command in project documentation; the managed workspace workflow currently runs the equivalent Expo command through pnpm.

## Gotchas

- Use the managed Expo workflow for previews rather than starting Expo directly.
- The API server is not required for the frontend visualization build; device state is intentionally local until live hardware and OBS endpoints are defined.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
