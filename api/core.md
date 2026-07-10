# Core API Reference

The core Versu package provides the programmatic API for versioning operations. It contains the full versioning engine used by the [CLI](/tools/cli) and the [GitHub Action](/tools/github-action), so anything they do can also be done from your own code.

## Installation

```bash
npm install @versu/core
```

Install the adapter plugins for your build systems alongside it, e.g.:

```bash
npm install @versu/plugin-node
```

Plugins are discovered automatically from `node_modules`, or you can list them explicitly in your [configuration file](/guide/config/configuration-file#plugins-optional).

## Usage

The main entry point is the `VersuRunner` class. It runs the complete pipeline: configuration loading, adapter resolution, module discovery, commit analysis, version bumping, changelog/release notes generation and git operations.

```typescript
import { VersuRunner, initLogger } from "@versu/core";

// Core logs nothing by default - provide a Logger to see output (optional)
initLogger(myLogger);

const runner = new VersuRunner({
  repoRoot: "/path/to/repository",
  prereleaseMode: false,
  prereleaseId: "alpha",
  bumpUnchanged: false,
  addBuildMetadata: false,
  timestampVersions: false,
  appendSnapshot: false,
  createTags: true,
  generateChangelog: true,
  generateReleaseNotes: true,
  pushChanges: false,
  dryRun: true,
  sequentialTagPush: false,
  commitReleaseNotes: false,
  stripModulePrefix: false,
  tagVersionPrefix: "",
  // adapter: "node", // Optional - auto-detected
});

const result = await runner.run();

if (result.bumped) {
  for (const module of result.changedModules) {
    console.log(`${module.id}: ${module.from} -> ${module.to}`);
  }
} else {
  console.log("All versions up to date");
}
```

See [Services](/api/services#versurunner) for the full description of every option and of the returned `RunnerResult`.

::: warning
Unless `dryRun` is enabled, the runner requires a clean git working directory.
:::

## Package Contents

Besides `VersuRunner`, the package exports:

- **[Services](/api/services)** - The pipeline services and the adapter extension-point interfaces (`AdapterIdentifier`, `ModuleDetector`, `VersionUpdateStrategy`, `ModuleSystemFactory`) plus the `pluginManager`.
- **[Types](/api/types)** - `Version`, `Module`, `ProjectInformation`, `VersuConfig`, `PluginContract` and friends.
- **[Utilities](/api/utilities)** - Semver, git, file and properties helpers, and the pluggable `logger`.

---

Questions? Check the [GitHub Discussions](https://github.com/versuhq/versu/discussions).
