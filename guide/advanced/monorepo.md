# Monorepo Setup

Practical guidance for running Versu on a monorepo: how modules are tagged, how tag options interact, and how to tune changelogs and CI for many modules. For the underlying concepts, see [Multi-Module Projects](/guide/concepts/multi-module) and [Dependency Cascade](/guide/concepts/dependency-cascade); for a step-by-step walkthrough, see the [Monorepo Setup Example](/examples/monorepo-setup).

## Module Discovery

The adapter plugin discovers the module structure for you:

- **Node** (`@versu/plugin-node`) - workspace members from the root `package.json` `workspaces` field (npm/yarn) or `pnpm-workspace.yaml`; internal dependencies between workspace packages build the cascade graph.
- **Gradle** (`@versu/plugin-gradle`) - modules from `settings.gradle(.kts)`, versions centralized in the root `gradle.properties`, dependencies analyzed via an init script.
- **Maven** (`@versu/plugin-maven`) - modules and parent/child relationships from `pom.xml` files.
- **Manual** - you declare modules and their relationships in `.versu/project-information.json` (see [Custom Adapters](/guide/advanced/adapters#the-manual-adapter)).

Whatever the adapter, module IDs use Gradle-style notation: `:` is the root, `:packages:core` is a nested module.

## Per-Module Tags

In a multi-module repository each changed module gets its own tag in the form `{moduleName}@{prefix}{version}`:

```text
core@1.4.0
cli@2.0.1
lib-utils@0.3.0
```

The last tag for each module is also what Versu uses as the baseline when analyzing commits - only commits after `core@1.4.0` that touch the `core` module's path count towards its next bump.

### Tag Options

| Option | Effect |
| ------ | ------ |
| `--tag-version-prefix <prefix>` | Adds a prefix to the version part, e.g. `v` produces `core@v1.4.0` (and `v1.4.0` for single-module repos). |
| `--strip-module-prefix` | Single-module repositories only: drops the module name, producing plain `v1.4.0`-style tags. |
| `--sequential-tag-push` | Pushes tags one at a time instead of all at once. Useful when each tag push triggers its own CI pipeline (e.g., a per-module release workflow), or when the remote rejects large atomic pushes. |
| `--from-ref <ref>` | Overrides the per-module tag baseline and analyzes commits from the given ref instead. |

::: warning
Pick a tag scheme before your first release and stick with it. Changing `--tag-version-prefix` or `--strip-module-prefix` later means the previous tags no longer match, and modules would be re-analyzed from the whole history (or need `--from-ref` as a manual cutoff).
:::

## Changelogs and Release Notes

In a multi-module run Versu generates:

- One `CHANGELOG.md` per changed module, inside the module's directory
- A root `CHANGELOG.md` aggregating the release
- Optionally `RELEASE.md` release notes (root and per module) with `--generate-release-notes`

Root and module documents are configured independently through the `changelog.root` / `changelog.module` (and `release.root` / `release.module`) sections of the [configuration file](/guide/config/changelog). This lets you, for instance, keep detailed per-module changelogs but a compact root summary.

## Tuning the Cascade

By default a dependency bump cascades with the same level (`major` → `major`, etc.). In large monorepos you may prefer downstream modules to only take a patch bump when a dependency changes:

::: code-group

```javascript [versu.config.js]
export default {
  versioning: {
    cascadeRules: {
      stable: {
        major: "major", // breaking change in a dependency still breaks dependents
        minor: "patch", // new features downstream are just a patch
        patch: "patch",
      },
      prerelease: "match", // shorthand: cascade with the same level
    },
  },
};
```

:::

Set a level to `"none"` to stop the cascade entirely for that bump type. See [Dependency Cascade](/guide/concepts/dependency-cascade) for the full semantics.

## CI Recipe

A typical release job for a monorepo on GitHub Actions:

```yaml
name: Release

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0 # Full history - required for commit analysis

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 24

      # Install the adapter plugin for your build system
      - name: Install Versu Node Plugin
        run: npm i -g @versu/plugin-node

      - name: Version modules
        uses: versuhq/versu@v3
```

Key points for monorepos:

- **`fetch-depth: 0` is required** - Versu needs the full history and tags to find each module's baseline.
- **Install the adapter plugin in the job first** - the GitHub Action ships only the core engine (with its built-in [manual adapter](/guide/advanced/adapters#the-manual-adapter)); adapter plugins are discovered in the workspace or global `node_modules`, with the Action and the CLI alike.
- **One run handles all modules** - discovery, bumps, cascade, changelogs, tags and pushes happen in a single `versu run`.
- For pre-release pipelines (e.g., on feature branches), combine `--prerelease-mode` with `--timestamp-versions` to get unique, sortable versions without tag collisions - see [Pre-release Versions](/guide/config/prerelease).

## Keeping Modules Independent

A few practices that keep multi-module versioning predictable:

- **Scope commits to one module** when possible - a commit touching several module paths bumps all of them.
- **Keep the dependency graph acyclic** - cascade resolution assumes no cycles.
- **Don't hand-edit versions** between runs; Versu owns the version fields it manages (e.g., `package.json` versions, `gradle.properties`).
- **Use `--dry-run` after structural changes** (adding/moving modules) to verify discovery and cascade before releasing.

## Next Steps

- [Monorepo Setup Example](/examples/monorepo-setup) - Step-by-step walkthrough
- [Dependency Cascade](/guide/concepts/dependency-cascade) - Cascade semantics
- [GitHub Action](/tools/github-action) - Full CI/CD automation

---

Need help? Check the [FAQ](/faq) or open an [issue](https://github.com/versuhq/versu/issues).
