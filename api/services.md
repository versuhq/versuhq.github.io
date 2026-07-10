# Services

The `@versu/core` package exposes a set of services and interfaces that power the versioning pipeline. The main entry point is the [`VersuRunner`](#versurunner) class, which orchestrates the whole process. The remaining interfaces are the extension points implemented by adapter plugins.

## VersuRunner

Orchestrates a complete versioning cycle: loads configuration, resolves the adapter, discovers modules, analyzes commits, calculates and applies version bumps, generates changelogs and release notes, and commits, tags and pushes the results.

```typescript
import { VersuRunner } from "@versu/core";

const runner = new VersuRunner(options);
const result = await runner.run();
```

### RunnerOptions

| Option | Type | Description |
| ------ | ---- | ----------- |
| `repoRoot` | `string` | Path to the repository root (resolved to an absolute path). |
| `prereleaseMode` | `boolean` | Generate pre-release versions instead of final versions. |
| `prereleaseId` | `string` | Pre-release identifier (e.g., `alpha`, `beta`, `rc`). |
| `bumpUnchanged` | `boolean` | In pre-release mode, bump modules even when no changes are detected. |
| `addBuildMetadata` | `boolean` | Add build metadata with the short commit SHA to all versions. |
| `timestampVersions` | `boolean` | Use timestamp-based pre-release identifiers (requires `prereleaseMode`). |
| `appendSnapshot` | `boolean` | Add a `-SNAPSHOT` suffix to all versions, if supported by the adapter. |
| `createTags` | `boolean` | Create git tags for new versions. |
| `generateChangelog` | `boolean` | Generate or update changelog files for changed modules. |
| `generateReleaseNotes` | `boolean` | Generate release notes summarizing all changes. |
| `pushChanges` | `boolean` | Commit and push version changes and changelogs to the remote. |
| `dryRun` | `boolean` | Run without writing or pushing any changes. |
| `sequentialTagPush` | `boolean` | Push tags one by one instead of all at once. |
| `commitReleaseNotes` | `boolean` | Include release notes in the commit when pushing changes. |
| `stripModulePrefix` | `boolean` | Strip the module name from tags when the project has a single module. |
| `tagVersionPrefix` | `string` | Prefix to add to tag versions (e.g., `v`). |
| `adapter` | `string?` | Adapter to use (e.g., `gradle`). Auto-detected if not provided. |
| `changelogFilename` | `string?` | Filename for generated changelogs (default: `CHANGELOG.md`). |
| `releaseNotesFilename` | `string?` | Filename for generated release notes (default: `RELEASE.md`). |
| `fromRef` | `string?` | Git reference to compare from (e.g., a previous tag or commit SHA). |
| `provider` | `string?` | Version control provider (e.g., `github`, `gitlab`). Auto-detected if not provided. |

::: warning
Unless `dryRun` is enabled, the runner requires a clean git working directory and throws an error otherwise.
:::

### RunnerResult

`run()` resolves to a `RunnerResult`:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `bumped` | `boolean` | Whether any module version was updated. |
| `discoveredModules` | `Module[]` | All modules discovered in the repository. |
| `changedModules` | `ModuleChangeResult[]` | Modules whose version changed, with `id`, `from` and `to`. |
| `createdTags` | `CreatedTagResult[]` | Git tags created for the new versions. |
| `changelogPaths` | `ChangesRendererResult[]` | Paths of the generated changelog files. |
| `releaseNotesPaths` | `ChangesRendererResult[]` | Paths of the generated release notes files. |

See the [Core Package](/api/core) page for a complete usage example.

## ModuleRegistry

Read-only registry of the modules discovered in the repository, with O(1) lookup by module ID.

```typescript
interface ModuleRegistry {
  getModuleIds(): string[];
  getModule(moduleId: string): Module;
  hasModule(moduleId: string): boolean;
  getModules(): ReadonlyMap<string, Module>;
}
```

`getModule` throws an error if the module ID does not exist; use `hasModule` to check first. Module IDs follow Gradle-style notation (`:` for the root, `:core`, `:lib:utils`).

## Adapter Extension Points

The following interfaces are implemented by adapter plugins to teach Versu how to work with a specific build system. See [Custom Adapters](/guide/advanced/adapters) for a full walkthrough.

### AdapterIdentifier

Identifies whether an adapter can handle a project, typically by checking for build-system-specific files (e.g., `build.gradle`, `pom.xml`, `package.json`).

```typescript
interface AdapterIdentifier {
  /** Adapter metadata with ID and capabilities. */
  readonly metadata: AdapterMetadata;

  /** Returns true if this adapter can handle the project. */
  accept(projectRoot: string): Promise<boolean>;
}
```

`AdapterMetadata` carries the adapter `id` and its `capabilities` (currently `supportsSnapshots`, which controls whether `--append-snapshot` is honored).

### AdapterIdentifierFactory

Creates an `AdapterIdentifier` instance for a given adapter ID. Provided by plugins through their [adapter contract](/guide/advanced/plugins).

```typescript
interface AdapterIdentifierFactory {
  readonly id: string;

  create(): Promise<AdapterIdentifier>;
}
```

### ModuleSystemFactory

Abstract factory that creates the build-system-specific components. Each adapter provides its own implementation.

```typescript
interface ModuleSystemFactory {
  /** Creates a module detector for discovering modules. */
  createDetector(outputFile: string): Promise<ModuleDetector>;

  /** Creates a strategy for writing versions to build files. */
  createVersionUpdateStrategy(
    moduleRegistry: ModuleRegistry,
  ): Promise<VersionUpdateStrategy>;
}
```

### ModuleDetector

Detects all modules in a repository and returns a structured `ProjectInformation` object.

```typescript
interface ModuleDetector {
  /** Absolute path to the repository root. */
  readonly repoRoot: string;

  /** Detects all modules in the repository. */
  detect(): Promise<ProjectInformation>;
}
```

### VersionUpdateStrategy

Writes the calculated versions back to the build system's configuration files (e.g., `gradle.properties`, `pom.xml`, `package.json`).

```typescript
interface VersionUpdateStrategy {
  /** Writes version updates for multiple modules. */
  writeVersionUpdates(moduleVersions: Map<string, string>): Promise<void>;
}
```

## Project Information Helpers

Utilities for working with the `project-information.json` file that describes a project's module structure (used by the manual adapter and by adapters that generate it during detection):

```typescript
import {
  getProjectInformationPath,
  readRawProjectInformation,
  getProjectInformationFromRawData,
} from "@versu/core";
```

- `getProjectInformationPath(configDirectory)` - Resolves the path to `project-information.json` inside the `.versu` config directory.
- `readRawProjectInformation(configDirectory)` - Reads and parses the file into a `RawProjectInformation` object.
- `getProjectInformationFromRawData(raw)` - Converts raw data into a structured `ProjectInformation` (parses versions, builds the module map and finds the root module). Throws if no root module is present.

## Plugin Manager

The `pluginManager` export provides programmatic plugin management (the same operations exposed by [`versu plugin`](/tools/cli#plugin-management) CLI commands):

```typescript
import { pluginManager } from "@versu/core";

await pluginManager.list();
await pluginManager.install("@versu/plugin-gradle", true /* global */);
await pluginManager.uninstall("@versu/plugin-gradle", true /* global */);
```

## Next Steps

- [Types](/api/types) - Type definitions used by these services
- [Utilities](/api/utilities) - Git, semver and file helpers
- [Custom Adapters](/guide/advanced/adapters) - Implement these interfaces

---

Questions? Check the [GitHub Discussions](https://github.com/versuhq/versu/discussions).
