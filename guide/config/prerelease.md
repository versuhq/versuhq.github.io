# Pre-release Versions

Learn how to generate pre-release versions with Versu.

## Pre-release what?

Pre-release versions indicate unstable releases for testing before the official version:

- `1.0.0-alpha` - Early development version
- `1.0.0-beta` - Feature-complete but untested version  
- `1.0.0-rc.1` - Release candidate, nearly ready
- `2.0.0-preview` - Custom pre-release tag

## Enabling Pre-release

Pre-release mode can be enabled via CLI:

```bash
versu run --prerelease-mode # default tag is 'alpha'
versu run --prerelease-mode --prerelease-id beta
versu run --prerelease-mode --prerelease-id rc
```

## Pre-release Tags

### Standard Tags

| Tag | Meaning | Use Case |
| ----- | --------- | ---------- |
| `alpha` | Early development | Internal testing |
| `beta` | Feature-complete | External testing |
| `rc` | Release candidate | Pre-release testing |
| `preview` | Preview release | Demo purposes |

### Custom Tags

You can provide any custom tag with `--prerelease-id`:

```bash
versu run --prerelease-mode --prerelease-id custom
```

## Pre-release Workflow

In pre-release mode, commit types map to pre-release bump types instead of stable ones. With the default configuration:

| Commit | Stable mode | Pre-release mode |
| ------ | ----------- | ---------------- |
| `feat: ...` | `1.2.3` → `1.3.0` | `1.2.3` → `1.3.0-alpha.0` |
| `fix: ...` | `1.2.3` → `1.2.4` | `1.2.3` → `1.2.4-alpha.0` |
| `feat!: ...` | `1.2.3` → `2.0.0` | `1.2.3` → `2.0.0-alpha.0` |

A typical cycle looks like this:

1. **Develop** - during development, run with `--prerelease-mode` (usually in CI on a development or feature branch) to publish testable versions like `1.3.0-alpha.0`. Add `--timestamp-versions` to make every build unique and sortable.
2. **Stabilize** - switch the identifier as quality increases: `--prerelease-id beta`, then `--prerelease-id rc`.
3. **Release** - run without `--prerelease-mode`. Versu calculates the final version from the commits since the last stable release (e.g., `1.3.0`), tags it and generates changelogs.

::: info
Pre-release versions are treated as **temporary versions**: Versu skips git tag creation for them, so the baseline for commit analysis remains the last *stable* tag. That's why each pre-release run recalculates from the full set of changes since the last release - and why promoting to stable "just works". Snapshot versions (`--append-snapshot`) behave the same way.
:::

Two flags are only meaningful in pre-release mode:

- `--bump-unchanged` - also bumps modules with no detected changes, so every module of a monorepo gets a pre-release version.
- `--timestamp-versions` - see [Timestamp Versions](#timestamp-versions) below.

## Configuration Options

Every mapping in the `versioning` section of the [configuration file](/guide/config/configuration-file) has a `prerelease` counterpart, controlling the bump used while in pre-release mode (`premajor`, `preminor`, `prepatch`, `prerelease` or `none`):

::: code-group

```javascript [versu.config.js]
export default {
  versioning: {
    breakingChange: {
      stable: "major",
      prerelease: "premajor",
    },
    unknownCommitType: {
      stable: "patch",
      prerelease: "prepatch",
    },
    commitTypes: {
      feat: {
        stable: "minor",
        prerelease: "preminor",
      },
      fix: {
        stable: "patch",
        prerelease: "prepatch",
      },
    },
    cascadeRules: {
      // How pre-release bumps cascade to dependent modules
      prerelease: {
        premajor: "premajor",
        preminor: "preminor",
        prepatch: "prepatch",
        prerelease: "prerelease",
      },
    },
  },
};
```

:::

The `prerelease` bump type increments only the pre-release counter (`1.3.0-alpha.0` → `1.3.0-alpha.1`), while `premajor`/`preminor`/`prepatch` first bump the core version.

### Metadata

You can add short SHA as build metadata to a version:

```bash
versu run --prerelease-mode --add-build-metadata
```

Result: `1.0.0-alpha.1+build.abc1234`

Build metadata (everything after `+`) does not affect version precedence - it's informational only, ideal for tracing a build back to its commit.

### Timestamp Versions

With `--timestamp-versions`, the pre-release identifier is extended with a UTC timestamp in the form `{id}.{YYYYMMDD}.{HHMM}`:

```bash
versu run --prerelease-mode --prerelease-id alpha --timestamp-versions
```

Result: `1.1.0-alpha.20260710.1430.0`

Timestamped identifiers are unique and sort chronologically, which makes them a good fit for continuous pre-release publishing (e.g., nightly or per-merge builds) where plain `alpha.0` counters would collide across runs.

::: warning
`--timestamp-versions` requires `--prerelease-mode` to be enabled.
:::

## Best Practices

### ✅ Do's

- Use alpha for development
- Use beta for feature-complete
- Use rc for pre-production
- Document what changed in pre-release
- Get feedback from pre-release testers

### ❌ Don'ts

- Skip testing pre-releases
- Leave pre-releases indefinitely
- Mix multiple pre-release tags in same release cycle
- Publish pre-release as stable

## Troubleshooting

### No tags were created for my pre-release

This is by design: pre-release (and snapshot) versions are temporary versions, so tag creation and push are skipped. The last stable tag stays the baseline for commit analysis.

### `--timestamp-versions` or `--bump-unchanged` seem to have no effect

Both options only apply in pre-release mode - combine them with `--prerelease-mode`.

### The version only went from `alpha.0` to `alpha.1`

That's a `prerelease` bump, which increments just the counter. If you expected the core version to move too, check the `prerelease` mapping of the relevant commit type in your `versioning` configuration (e.g., `preminor` for `feat`).

### `--append-snapshot` didn't add `-SNAPSHOT`

The snapshot suffix is only applied when the resolved adapter supports snapshots (e.g., Gradle and Maven do; Node does not).

## Next Steps

- [Configuration File](/guide/config/configuration-file) - Full configuration
- [Changelog](/guide/config/changelog) - Changelog generation
- [GitHub Action](/tools/github-action) - Automated CI/CD

---

Ready to automate everything? Check the [GitHub Action Documentation](/tools/github-action)!
