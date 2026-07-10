# Node Plugin

`@versu/plugin-node` provides support for detecting and updating versions in Node.js projects, including npm, yarn and pnpm workspace monorepos.

## Features

- **Workspace Support** - npm/yarn `workspaces` and `pnpm-workspace.yaml` monorepos
- **Single-Package Projects** - projects without workspaces are handled as a single root module
- **Dependency Detection** - cascade graph built from dependencies between workspace packages
- **Range-Preserving Updates** - internal dependency ranges are renumbered while keeping the range operator and `workspace:` protocol
- **Auto-Detection** - automatically detected when `package.json` is present

## Installation

::: code-group

```bash [With Core]
npm install @versu/core @versu/plugin-node
```

```bash [With CLI]
npm install -g @versu/cli @versu/plugin-node
```

:::

With the [GitHub Action](/tools/github-action), the plugin is already included - no separate installation needed.

## Usage

Once installed, the plugin is discovered automatically (or list it explicitly in your [configuration file](/guide/config/configuration-file#plugins-optional)):

```javascript
// versu.config.js
export default {
  plugins: ["@versu/plugin-node"],
};
```

Then run Versu as usual:

```bash
versu run                 # adapter auto-detected
versu run --adapter node  # or forced explicitly
```

## Auto-Detection

The adapter activates when a `package.json` file is present in the repository root.

## Module Discovery

Workspace members are discovered from:

- the `workspaces` field of the root `package.json` (npm / yarn, array or `{ "packages": [] }` form), or
- `pnpm-workspace.yaml` (`packages` globs) when the root `package.json` declares no workspaces

Module IDs are derived from each package's path in Gradle-style notation:

```text
my-monorepo/             → :          (root)
├── package.json
└── packages/
    ├── core/            → :packages:core
    │   └── package.json
    └── cli/             → :packages:cli
        └── package.json
```

Projects without workspaces are handled as a single root module.

## Dependency Cascade

Dependencies between workspace packages - across `dependencies`, `devDependencies`, `peerDependencies` and `optionalDependencies` - build the cascade graph: bumping a package also affects the packages that depend on it, at the level defined by your [cascade rules](/guide/concepts/dependency-cascade).

## Version Updates

When writing new versions, the plugin updates:

- the `version` field of a module's `package.json` when the module declares a version
- internal dependency ranges pointing at renumbered workspace packages, preserving the range operator and the `workspace:` protocol:

| Before | After (dependency bumped to `2.0.0`) |
| ------ | ------------------------------------ |
| `^1.2.3` | `^2.0.0` |
| `~1.2.3` | `~2.0.0` |
| `workspace:~1.2.3` | `workspace:~2.0.0` |

Specs without a concrete version are left untouched: `*`, `workspace:*`, `workspace:^`, `workspace:~`, `file:`, `link:`, git/url specs and compound ranges.

## Limitations

- **Version format**: versions must follow semantic versioning (e.g., `1.2.3`)
- **No snapshot support**: `--append-snapshot` has no effect - the `-SNAPSHOT` convention doesn't exist in the npm ecosystem (use [pre-release versions](/guide/config/prerelease) instead)
- **Publishing is out of scope**: the plugin renumbers packages; publishing to a registry stays in your pipeline

## Next Steps

- [Plugins Overview](/tools/plugins) - All official plugins and how discovery works
- [Monorepo Setup Example](/examples/monorepo-setup) - Complete workspace walkthrough
- [Pre-release Versions](/guide/config/prerelease) - alpha/beta/rc flows

---

Need help? Check the [FAQ](/examples/faq) or open an [issue](https://github.com/versuhq/plugin-node/issues).
