# RapidKit v0.42.3

Released: July 25, 2026

## Secure Compatibility and Workspai Migration

This patch maintains the legacy `rapidkit` npm compatibility package while
directing new projects and integrations to Workspai. Runtime command behavior
is unchanged.

## Security

- Updated `brace-expansion` from `5.0.7` to `5.0.8` to resolve the
  high-severity unbounded-expansion denial-of-service advisory.
- Updated `postcss` from `8.5.15` to `8.5.23` to resolve the high-severity
  previous source-map path traversal advisory.
- Updated PostCSS's compatible `nanoid` dependency from `3.3.12` to `3.3.16`.
- Confirmed zero vulnerabilities with `npm audit --audit-level=high`.

## Migration and Documentation

- Replaced the 661-line feature-heavy README with a concise compatibility and
  migration entry point for existing RapidKit users.
- Added `docs/MIGRATING_TO_WORKSPAI.md` with source-preserving paths for a
  single project, named multi-project workspaces, CI, agents/IDEs,
  verification, and rollback.
- Added visible migration notices to user-facing legacy documentation.
- Updated package metadata to describe the package as a legacy compatibility
  bridge rather than the starting point for new Workspace Intelligence work.
- Strengthened the docs drift guard against legacy-first onboarding.

## Contract Fixes

- Updated the npm publish contract to validate the new package positioning,
  canonical Workspai links, and inclusion of the migration guide in the npm
  package.
- Preserved validation for any npm-safe raw GitHub images that may be added to
  the README in future releases without requiring a decorative image today.

## Breaking Changes

None.

## Verification

- `npm audit --audit-level=high`
- `npm run check:brand`
- `npm run check:markdown-links`
- `npm run check:docs-drift`
- `npm run validate:docs-examples`
- `npm run smoke:readme`
- `npm test`
- `npm run build`

## Upgrade

Existing compatibility users:

```bash
npm install -g rapidkit@0.42.3
```

New projects:

```bash
npm install -g workspai
```

Migration guide:
[docs/MIGRATING_TO_WORKSPAI.md](../docs/MIGRATING_TO_WORKSPAI.md)
