# Plugin Development

Learn how to build and publish your own Versu plugin. A plugin is a regular npm package that default-exports a `PluginContract` - Versu discovers it, loads it and uses the adapters it contributes.

If you only need to support a build system Versu doesn't know about in a single repository, consider the built-in [manual adapter](/guide/advanced/adapters#the-manual-adapter) first - no plugin required.

## Anatomy of a Plugin

A plugin package has three responsibilities:

1. Follow one of the recognized **name patterns** so it can be discovered
2. Default-export a **`PluginContract`** object
3. Provide one or more **adapters** implementing the [adapter interfaces](/guide/advanced/adapters)

### Name Patterns

Versu auto-discovers plugins in `node_modules` (local and global) by package name:

- `versu-plugin-*` (e.g., `versu-plugin-cargo`)
- `@*/versu-plugin-*` (e.g., `@acme/versu-plugin-cargo`)
- `@versu/plugin-*` (reserved for official plugins)

Packages with other names can still be loaded, but only when listed explicitly in the [`plugins` configuration](/guide/config/configuration-file#plugins-optional).

### Package Structure

The plugin loader imports `dist/index.js` when it exists, falling back to the package's main entry point. A typical layout (mirroring the official plugins):

```text
versu-plugin-cargo/
├── src/
│   ├── index.ts                      # Default-exports the PluginContract
│   ├── constants.ts
│   └── services/
│       ├── cargo-adapter-identifier.ts
│       ├── cargo-module-detector.ts
│       ├── cargo-module-system-factory.ts
│       └── cargo-version-update-strategy.ts
├── dist/                             # Compiled output
├── package.json
└── tsconfig.json
```

Declare `@versu/core` as a dependency (or peer dependency) to get the contract types and helper utilities.

## The Plugin Contract

The package must default-export an object satisfying `PluginContract`:

```typescript
// src/index.ts
import type { PluginContract } from "@versu/core";
import { CargoAdapterIdentifier } from "./services/cargo-adapter-identifier.js";
import { CargoModuleSystemFactory } from "./services/cargo-module-system-factory.js";

const cargoPlugin: PluginContract = {
  id: "cargo",
  name: "Cargo",
  description: "Adapter plugin for the Rust Cargo build system.",
  version: "1.0.0",
  authors: ["Your Name"],
  adapters: [
    {
      id: "cargo",
      adapterIdentifierFactory: async (_configDirectory: string) => ({
        id: "cargo",
        create: async () => new CargoAdapterIdentifier(),
      }),
      moduleSystemFactory: async (repoRoot: string, _configDirectory: string) =>
        new CargoModuleSystemFactory(repoRoot),
    },
  ],
};

export default cargoPlugin;
```

| Field | Description |
| ----- | ----------- |
| `id` | Unique plugin identifier. Loading a second plugin with the same `id` is skipped with a warning. |
| `name` / `description` / `authors` | Metadata shown in logs and plugin listings. |
| `version` | Plugin version. Keep it in sync with `package.json` (the official plugins generate it at build time). |
| `adapters` | One or more `AdapterPluginContract` entries - a plugin may contribute several adapters. |

Each adapter entry provides two async factories:

- `adapterIdentifierFactory(configDirectory)` - returns an `AdapterIdentifierFactory`, which in turn creates the [`AdapterIdentifier`](/guide/advanced/adapters#_1-adapteridentifier) used for auto-detection.
- `moduleSystemFactory(repoRoot, configDirectory)` - returns the [`ModuleSystemFactory`](/guide/advanced/adapters#_2-modulesystemfactory) that creates the detector and version update strategy.

The `configDirectory` argument points to the repository's `.versu` directory, in case your adapter needs to read or write auxiliary files there.

## Loading and Precedence

At startup Versu loads plugins either from the `plugins` list in the configuration file or by scanning `node_modules` (see [How Plugins Are Discovered](/tools/plugins#how-plugins-are-discovered)). Every exported contract is validated against a schema - invalid plugins are rejected with an error in the logs.

External plugins get the highest precedence; the built-in manual adapter always comes last. When no `--adapter` is forced, the first adapter whose identifier `accept()`s the repository wins.

## Logging

Use the `logger` from `@versu/core` inside your plugin - it delegates to whatever logger the host (CLI, GitHub Action or your own code) configured:

```typescript
import { logger } from "@versu/core";

logger.info("Detecting Cargo workspace", { repoRoot });
```

## Testing Your Plugin

The easiest way to test end-to-end is a dry run against a fixture repository, loading the plugin explicitly:

```javascript
// fixture-repo/versu.config.js
export default {
  plugins: ["versu-plugin-cargo"],
};
```

```bash
cd fixture-repo
npm install /path/to/versu-plugin-cargo
versu run --dry-run
```

`--dry-run` exercises detection, commit analysis and bump calculation without writing files or touching git history.

## Publishing

Publish like any npm package:

```bash
npm publish --access public
```

Once published, users install it with:

```bash
versu plugin install versu-plugin-cargo
```

## Next Steps

- [Custom Adapters](/guide/advanced/adapters) - Implement the adapter interfaces
- [Plugins Overview](/tools/plugins) - Discovery and installation from the user's perspective
- [API Types](/api/types#plugin-types) - `PluginContract` reference

---

Questions? Check the [GitHub Discussions](https://github.com/versuhq/versu/discussions).
