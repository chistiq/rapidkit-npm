# Migrating from RapidKit npm to Workspai

This guide is for users who already run the legacy `rapidkit` npm CLI. New
projects should begin directly with [Workspai](https://github.com/chistiq/workspai).

## What changes

| RapidKit compatibility surface | Workspai canonical surface |
| --- | --- |
| Package and command: `rapidkit` | Package and command: `workspai` |
| Project/workspace metadata: `.rapidkit/**` | Canonical metadata: `.workspai/**` |
| Managed workspaces: `~/rapidkit/workspaces/**` | Managed workspaces: `~/.workspai/workspaces/**` |
| Legacy documentation in this repository | Current documentation at [workspai.dev](https://www.workspai.dev/) |

Your source repository does not need to move. Workspai can adopt it in place
and create the canonical metadata through supported commands.

## Before migration

1. Commit or back up the source project.
2. Record the RapidKit workspace and project paths used by CI or scripts.
3. Keep the existing `.rapidkit` metadata until the Workspai result has been
   verified.
4. Do not rename `.rapidkit` to `.workspai` manually.

## One existing project

Run from the project directory:

```bash
cd /path/to/your-project
npx workspai adopt . --json
```

The JSON response reports the selected workspace and the next `cd` command. If
no workspace is selected, Workspai creates or reuses:

```text
~/.workspai/workspaces/workspai
```

Move to that workspace and build current evidence:

```bash
cd ~/.workspai/workspaces/workspai
npx workspai workspace intelligence run \
  --for-agent generic \
  --strict \
  --json
```

The first run may report missing, stale, or blocking evidence. Follow the cited
producer or source fix; do not edit generated reports to manufacture readiness.

## Several projects in one system

Create a named workspace:

```bash
npx workspai create workspace my-workspace --profile minimal --yes
```

Adopt each existing project without copying it:

```bash
cd /path/to/frontend
npx workspai adopt . \
  --workspace "$HOME/.workspai/workspaces/my-workspace" \
  --name frontend

cd /path/to/api
npx workspai adopt . \
  --workspace "$HOME/.workspai/workspaces/my-workspace" \
  --name api
```

Then run the intelligence chain from
`~/.workspai/workspaces/my-workspace`.

## CI migration

Replace the package and command first; keep the decision boundary explicit:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20.20.0'
    cache: npm

- run: npm ci
- run: npx workspai workspace intelligence run --for-agent generic --strict --json
```

Archive the governed outputs your workflow consumes, especially:

```text
.workspai/workspace.contract.json
.workspai/reports/INDEX.json
.workspai/reports/workspace-intelligence-run-last-run.json
.workspai/reports/workspace-context-agent.json
```

Do not silently rewrite a CI consumer from `.rapidkit` to `.workspai`; update it
to the corresponding Workspai artifact contract and validate its schema.

## Agent and IDE migration

Run the canonical chain before asking an agent to reason across projects. The
generated `AGENTS.md`, grounding, report index, bounded graph queries, and MCP
surface give compatible agents a current evidence path without loading the
complete workspace into every prompt.

Use `--for-agent generic` for portable output. Select a specific target only
when the consumer needs its native integration surface.

## Verification checklist

- The source projects remain at their original paths.
- The Workspai workspace contract lists every intended project.
- `.workspai/reports/INDEX.json` points to current artifacts.
- The Workspace Model and Knowledge Graph come from the same current revision.
- CI reads `.workspai` artifacts rather than renamed `.rapidkit` files.
- Agent surfaces were regenerated from Workspai evidence.
- Existing RapidKit automation remains available until the replacement path is
  verified.

## Rollback

Adoption does not relocate source code. If migration validation fails, keep the
existing RapidKit automation active, preserve the Workspai reports for
diagnosis, and correct the Workspai workspace or CI configuration. Avoid
deleting either metadata tree until the migration is accepted.

## Current references

- [Workspai CLI repository](https://github.com/chistiq/workspai)
- [Workspai documentation](https://www.workspai.dev/)
- [Workspai product](https://www.workspai.com/)
- [RapidKit compatibility documentation](./README.md)
