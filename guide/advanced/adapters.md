# Custom Adapters

Adapters are how Versu understands a build system: they detect whether they apply to a repository, discover its modules and dependencies, and write calculated versions back to the right files. This page shows the two ways to add support for a build system Versu doesn't know about:

- The **manual adapter** - describe your project in a JSON file, no code required
- A **custom adapter implementation** - full programmatic control, shipped in a [plugin](/guide/advanced/plugins)

## The Manual Adapter

Core ships a built-in `manual` adapter that reads the project structure from a file instead of inspecting build files. It is the quickest way to version a project with an unsupported build system.

Create `project-information.json` inside your repository's `.versu` directory:

```json
{
  ":": {
    "name": "my-project",
    "path": ".",
    "version": "1.0.0",
    "type": "root",
    "declaredVersion": true,
    "affectedModules": []
  },
  ":core": {
    "name": "core",
    "path": "packages/core",
    "version": "2.1.0",
    "type": "module",
    "declaredVersion": true,
    "affectedModules": [":cli"]
  },
  ":cli": {
    "name": "cli",
    "path": "packages/cli",
    "version": "1.5.0",
    "type": "module",
    "declaredVersion": true,
    "affectedModules": []
  }
}
```

Each key is a module ID in Gradle-style notation (`:` for the root, `:core`, `:lib:utils`). Each entry supports:

| Field | Required | Description |
| ----- | -------- | ----------- |
| `name` | ✅ | Human-readable module name. |
| `path` | ✅ | Relative path from the repository root to the module directory. |
| `type` | ✅ | `root` for the top-level project, `module` for subprojects. Exactly one `root` is required. |
| `affectedModules` | ✅ | Module IDs bumped in cascade when this module changes. |
| `version` | | Current semantic version. Defaults to `0.0.0` when omitted. |
| `declaredVersion` | | Whether the version is explicitly declared in build configuration. |

The manual adapter has the lowest precedence: it only activates when the file exists and no other installed adapter accepts the repository. You can also force it with `--adapter manual`.

::: warning
The manual adapter identifies modules and calculates bumps, but it has no build files to update - version changes are tracked through git tags and changelogs rather than written back to build configuration.
:::

## Implementing an Adapter

For full control - including writing versions back to build files - implement the four adapter interfaces from `@versu/core` and expose them through a [plugin](/guide/advanced/plugins). The examples below sketch a Cargo (Rust) adapter; the official [Maven plugin](https://github.com/versuhq/plugin-maven) is a good real-world reference.

### 1. AdapterIdentifier

Decides whether this adapter applies to a repository, usually by checking for build-system-specific files. Its `metadata` declares the adapter ID and capabilities:

```typescript
import * as fs from "fs/promises";
import { type AdapterIdentifier, exists } from "@versu/core";

export class CargoAdapterIdentifier implements AdapterIdentifier {
  readonly metadata = {
    id: "cargo",
    capabilities: {
      // Whether --append-snapshot is supported for this build system
      supportsSnapshots: false,
    },
  };

  async accept(projectRoot: string): Promise<boolean> {
    if (!(await exists(projectRoot))) return false;

    const files = await fs.readdir(projectRoot);
    return files.includes("Cargo.toml");
  }
}
```

### 2. ModuleSystemFactory

The abstract factory tying everything together - it creates the detector and the version update strategy:

```typescript
import type {
  ModuleDetector,
  ModuleRegistry,
  ModuleSystemFactory,
  VersionUpdateStrategy,
} from "@versu/core";
import { CargoModuleDetector } from "./cargo-module-detector.js";
import { CargoVersionUpdateStrategy } from "./cargo-version-update-strategy.js";

export class CargoModuleSystemFactory implements ModuleSystemFactory {
  constructor(private readonly repoRoot: string) {}

  async createDetector(_outputFile: string): Promise<ModuleDetector> {
    return new CargoModuleDetector(this.repoRoot);
  }

  async createVersionUpdateStrategy(
    moduleRegistry: ModuleRegistry,
  ): Promise<VersionUpdateStrategy> {
    return new CargoVersionUpdateStrategy(this.repoRoot, moduleRegistry);
  }
}
```

`createDetector` receives the path where project information may be persisted (`.versu/project-information.json`); adapters that shell out to the build system (like Gradle's init script) use it, simpler adapters can ignore it.

### 3. ModuleDetector

Discovers modules and their dependency relationships. The usual pattern is to build a [`RawProjectInformation`](/api/types#rawmodule-and-rawprojectinformation) map and convert it with `getProjectInformationFromRawData`:

```typescript
import {
  getProjectInformationFromRawData,
  type ModuleDetector,
  type ProjectInformation,
  type RawProjectInformation,
} from "@versu/core";

export class CargoModuleDetector implements ModuleDetector {
  constructor(readonly repoRoot: string) {}

  async detect(): Promise<ProjectInformation> {
    // Inspect Cargo.toml / workspace members to build the raw structure
    const raw: RawProjectInformation = {
      ":": {
        name: "my-workspace",
        path: ".",
        type: "root",
        declaredVersion: false,
        affectedModules: [],
      },
      ":core": {
        name: "core",
        path: "crates/core",
        version: "1.2.0",
        type: "module",
        declaredVersion: true,
        // Crates that depend on core get cascaded bumps
        affectedModules: [":cli"],
      },
      ":cli": {
        name: "cli",
        path: "crates/cli",
        version: "0.9.1",
        type: "module",
        declaredVersion: true,
        affectedModules: [],
      },
    };

    return getProjectInformationFromRawData(raw);
  }
}
```

Key points:

- **Module IDs** are Gradle-style (`:` for root, `:crates:core` for nested paths).
- **`affectedModules` drives the [dependency cascade](/guide/concepts/dependency-cascade)** - list the modules that depend on this one.
- **`path` scopes commits to modules** - a commit touching files under a module's path counts as a change to that module.
- You may attach extra build-system-specific fields to each raw module (the Maven adapter stores `groupId`, `artifactId` and `pomPath` this way); they are preserved on the resulting [`Module`](/api/types#module) objects.

### 4. VersionUpdateStrategy

Writes the new versions back to build files. It receives a map of module IDs to new version strings:

```typescript
import type { ModuleRegistry, VersionUpdateStrategy } from "@versu/core";

export class CargoVersionUpdateStrategy implements VersionUpdateStrategy {
  constructor(
    private readonly repoRoot: string,
    private readonly moduleRegistry: ModuleRegistry,
  ) {}

  async writeVersionUpdates(
    moduleVersions: Map<string, string>,
  ): Promise<void> {
    for (const [moduleId, newVersion] of moduleVersions) {
      const module = this.moduleRegistry.getModule(moduleId);
      // Update the version field in <repoRoot>/<module.path>/Cargo.toml
      // ...and, if applicable, internal dependency ranges pointing at it
    }
  }
}
```

Besides the module's own version, consider updating references between modules (the Node adapter rewrites internal dependency ranges; the Maven adapter updates `<parent><version>` entries).

## Wiring It into a Plugin

Expose the adapter through the plugin's `adapters` array as shown in [Plugin Development](/guide/advanced/plugins#the-plugin-contract), then test with:

```bash
versu run --dry-run --adapter cargo
```

## Next Steps

- [Plugin Development](/guide/advanced/plugins) - Packaging and publishing the adapter
- [API Services](/api/services#adapter-extension-points) - Interface reference
- [Dependency Cascade](/guide/concepts/dependency-cascade) - How `affectedModules` is used

---

Questions? Check the [GitHub Discussions](https://github.com/versuhq/versu/discussions).
