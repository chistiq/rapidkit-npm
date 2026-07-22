# RapidKit v0.42.2

Released: July 22, 2026

## Dependency Security Maintenance

This patch release updates the dependency lockfile for the legacy `rapidkit`
compatibility package. Runtime behavior and the migration path to Workspai are
unchanged.

## Security Fixes

- Resolved the high-severity `brace-expansion` denial-of-service advisory.
- Resolved the high-severity `fast-uri` host-confusion advisories.
- Resolved the high-severity `js-yaml` quadratic CPU-consumption advisory.

## Breaking Changes

None.

## Verification

- `npm audit --audit-level=high`
- `npm run validate`
- `npm run build`

## Upgrade

```bash
npm install -g rapidkit@0.42.2
```
