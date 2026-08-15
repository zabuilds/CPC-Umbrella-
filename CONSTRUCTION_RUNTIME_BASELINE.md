# CPC Construction Runtime Baseline

Status: established from the existing construction scaffold.

- Runtime: Node.js 20 in the existing construction validation workflow.
- Package manager: npm, established by the workflow's npm cache and `npm install` command.
- Validation commands: `npm run typecheck`, `npm run lint`, and `npm run build`.
- Dependency versions remain deferred because `package.json` currently uses `latest` declarations and no lockfile exists.

Safety decision: do not introduce a guessed lockfile or arbitrary dependency versions. Use the established npm/Node 20 validation path first, then pin dependencies only after the authoritative application baseline is confirmed.
