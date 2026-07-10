# Types

Type definitions exported by `@versu/core`. They fall into four groups: versions, project structure, configuration and plugins.

```typescript
import type {
  Version,
  Module,
  ProjectInformation,
  VersuConfig,
  PluginContract,
} from "@versu/core";
```

## Version Types

### Version

Structured representation of a semantic version:

```typescript
type Version = {
  major: number;
  minor: number;
  patch: number;
  prerelease: ReadonlyArray<string | number>;
  build: ReadonlyArray<string>;
  raw: string; // Full version string with all metadata
  version: string; // Core version string (major.minor.patch-prerelease)
};
```

### Bump Types

```typescript
type StableBumpType = "major" | "minor" | "patch";

type PrereleaseBumpType =
  | "prerelease"
  | "premajor"
  | "preminor"
  | "prepatch";
```

Most APIs additionally accept `"none"` to indicate that no bump should be applied.

## Project Structure Types

### Module

A module within a project, as discovered by an adapter:

```typescript
type Module = {
  /** Unique identifier within the project (e.g., ':', ':app', ':lib:core'). */
  readonly id: string;

  /** Human-readable name of the module. */
  readonly name: string;

  /** Relative path from the repository root to the module directory. */
  readonly path: string;

  /** 'root' for the top-level project, 'module' for subprojects. */
  readonly type: "module" | "root";

  /** Module IDs that are affected when this module changes. */
  readonly affectedModules: Set<string>;

  /** Current semantic version of the module. */
  readonly version: Version;

  /** Whether the version is explicitly declared in build configuration. */
  readonly declaredVersion: boolean;
} & Record<string, unknown>;
```

Adapters may attach additional build-system-specific properties - that is what the `Record<string, unknown>` intersection allows.

### ProjectInformation

The processed project structure, offering O(1) module lookup:

```typescript
type ProjectInformation = {
  /** All module identifiers in the project. */
  readonly moduleIds: string[];

  /** Map of module IDs to their complete module information. */
  readonly modules: ReadonlyMap<string, Module>;

  /** The module ID of the root project (typically ':'). */
  readonly rootModule: string;
};
```

### RawModule and RawProjectInformation

The raw shape produced by module detection, before processing - arrays instead of `Set`s and the version as an optional string:

```typescript
type RawModule = {
  readonly name: string;
  readonly path: string;
  readonly affectedModules: string[];
  readonly version?: string;
  readonly type: "module" | "root";
  readonly declaredVersion: boolean;
} & Record<string, unknown>;

type RawProjectInformation = {
  readonly [id: string]: RawModule;
};
```

This is also the schema of the `project-information.json` file used by the [manual adapter](/guide/advanced/adapters#the-manual-adapter). Convert raw data into `ProjectInformation` with `getProjectInformationFromRawData` (see [Services](/api/services#project-information-helpers)).

## Configuration Types

### VersuConfig

The shape of the [configuration file](/guide/config/configuration-file):

```typescript
type VersuConfig = {
  readonly plugins?: string[];
  readonly versioning?: {
    readonly unknownCommitType?: CommitTypeConfig;
    readonly breakingChange?: CommitTypeConfig;
    readonly commitTypes?: Record<string, CommitTypeConfig>;
    readonly cascadeRules?: {
      readonly stable?:
        | "match"
        | Record<StableBumpType, StableBumpType | "none">;
      readonly prerelease?:
        | "match"
        | Record<PrereleaseBumpType, PrereleaseBumpType | "none">;
    };
  };
  readonly changelog?: ChangesConfig;
  readonly release?: ChangesConfig;
};
```

### CommitTypeConfig

Maps a commit type to the bump it triggers in stable and pre-release mode:

```typescript
type CommitTypeConfig = {
  readonly stable: StableBumpType | "none";
  readonly prerelease: PrereleaseBumpType | "none";
};
```

### ChangesConfig

Configuration for changelog and release notes rendering, based on [conventional-changelog-writer](https://www.npmjs.com/package/conventional-changelog-writer):

```typescript
type ModuleChangesConfig = {
  readonly context?: Context<Commit> & { prependPlaceholder: string };
  readonly options?: Options<Commit>;
};

type ChangesConfig = {
  readonly root?: ModuleChangesConfig;
  readonly module?: ModuleChangesConfig;
};
```

See [Changelog Generation](/guide/config/changelog) for usage examples.

## Plugin Types

### PluginContract

The object a plugin must default-export. See [Plugin Development](/guide/advanced/plugins) for a complete guide.

```typescript
type PluginContract = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly authors: string[];
  readonly adapters: AdapterPluginContract[];
};
```

### AdapterPluginContract

Each adapter a plugin contributes provides factories for its identifier and module system:

```typescript
type AdapterPluginContract = {
  readonly id: string;
  adapterIdentifierFactory: (
    configDirectory: string,
  ) => Promise<AdapterIdentifierFactory>;
  moduleSystemFactory: (
    repoRoot: string,
    configDirectory: string,
  ) => Promise<ModuleSystemFactory>;
};
```

### AdapterMetadata

```typescript
type AdapterMetadata = {
  /** Unique identifier (e.g., 'gradle', 'maven', 'node'). */
  readonly id: string;

  /** Features supported by this adapter. */
  readonly capabilities: {
    /** Whether the adapter supports snapshot versions (e.g., '1.0.0-SNAPSHOT'). */
    readonly supportsSnapshots: boolean;
  };
};
```

## Git Types

### GitTag

A parsed git tag with extracted module and version metadata:

```typescript
type GitTag = {
  /** The full tag name (e.g., 'core@1.0.0', 'v2.0.0'). */
  readonly name: string;

  /** The full SHA-1 commit hash the tag points to. */
  readonly hash: string;

  /** Module name extracted from the tag (e.g., 'core' from 'core@1.0.0'). */
  readonly module?: string;

  /** Semantic version extracted from the tag. */
  readonly version?: string;
};
```

### GitOptions

Options accepted by all [git utilities](/api/utilities#git-utilities):

```typescript
type GitOptions = {
  /** Working directory for git commands. Defaults to process.cwd(). */
  readonly cwd?: string;
};
```

## Next Steps

- [Services](/api/services) - The services using these types
- [Utilities](/api/utilities) - Helper functions
- [Plugin Development](/guide/advanced/plugins) - Build your own plugin

---

Questions? Check the [GitHub Discussions](https://github.com/versuhq/versu/discussions).
