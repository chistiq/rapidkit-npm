# RapidKit v0.42.1

Released: July 9, 2026

## Workspai Migration Notice

This patch release keeps the legacy `rapidkit` npm package available while
making the migration path to Workspai explicit for new users.

## What's New

- Added a top-level README migration notice that points new installs to the
  `workspai` npm package.
- Added the new repository link:
  <https://github.com/chistiq/workspai>
- Marked the `rapidkit` npm package as a compatibility package that is planned
  for deprecation in a future release.
- Added the same migration notice to `npx rapidkit --help` so CLI-first users see
  the new Workspai path without needing to read the README.
- Aligned the extension compatibility contract with `workspai@0.43.1`.
- Updated shared runtime/create-planner wording to use Workspai for the npm CLI
  ownership surface.

## Breaking Changes

None.

## Verification

- `npm run validate:contracts`
- `npm run build`
- `npm run test -- src/__tests__/index.test.ts`
- `node dist/index.js --help`

## Upgrade

```bash
npm install -g rapidkit@0.42.1
```
