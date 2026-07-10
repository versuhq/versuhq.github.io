# Gradle Plugin

`@versu/plugin-gradle` provides first-class support for versioning Gradle projects (Groovy & Kotlin DSL) in monorepo environments, with automatic dependency detection and cascading version updates.

## Features

- **Multi-Module Support** - Automatic detection of Gradle multi-module projects
- **Dual DSL Support** - Works with both Groovy and Kotlin DSL
- **Centralized Versioning** - All versions managed through the root `gradle.properties`
- **Dependency Detection** - Automatic project dependency analysis
- **SNAPSHOT Support** - Optional `-SNAPSHOT` suffix for development builds
- **Auto-Detection** - Automatically detected when Gradle files are present

## Installation

::: code-group

```bash [With Core]
npm install @versu/core @versu/plugin-gradle
```

```bash [With CLI]
npm install -g @versu/cli @versu/plugin-gradle
```

:::

With the [GitHub Action](/tools/github-action), the plugin is already included - no separate installation needed.

## Usage

Once installed, the plugin is discovered automatically (or list it explicitly in your [configuration file](/guide/config/configuration-file#plugins-optional)):

```javascript
// versu.config.js
export default {
  plugins: ["@versu/plugin-gradle"],
};
```

Then run Versu as usual:

```bash
versu run                   # adapter auto-detected
versu run --adapter gradle  # or forced explicitly
```

## Auto-Detection

The adapter activates when any of these files is present in the repository root:

- `build.gradle`
- `build.gradle.kts`
- `settings.gradle`
- `settings.gradle.kts`

## Project Structure

### Required Files

- `settings.gradle` or `settings.gradle.kts` - Defines the multi-module structure
- `gradle.properties` (root) - Contains all module versions

### Version Management

All module versions must be declared in the **root** `gradle.properties` file:

```properties
# Root module version
version=1.0.0

# Submodule versions
core.version=2.1.0
api.version=1.5.0
utils.version=3.0.0
```

### Version Property Naming

- **Root module**: use the `version` property
- **Submodules**: use the `{moduleName}.version` pattern
  - The module name is derived from the `settings.gradle(.kts)` configuration
  - For module `:core`, use property `core.version`
  - For module `:lib:utils`, use property `lib-utils.version` (`:` replaced with `-`)

### Example Project

```text
myproject/
├── settings.gradle.kts
├── build.gradle.kts
├── gradle.properties          # All versions here
├── core/
│   └── build.gradle.kts
├── api/
│   └── build.gradle.kts
└── lib/
    └── utils/
        └── build.gradle.kts
```

**settings.gradle.kts:**

```kotlin
rootProject.name = "myproject"

include(":core")
include(":api")
include(":lib:utils")
```

**gradle.properties:**

```properties
version=1.0.0
core.version=2.1.0
api.version=1.5.0
lib-utils.version=3.0.0
```

## Dependency Detection

The plugin detects project dependencies using a custom Gradle init script. Dependencies are analyzed to determine version cascading when modules are updated.

Standard Gradle dependency configurations are supported, including `implementation`, `api`, `compileOnly` and `runtimeOnly`.

For example, if `:api` depends on `:core` and `:core` gets a version bump, Versu automatically cascades the change to `:api` according to your [cascade rules](/guide/concepts/dependency-cascade).

## SNAPSHOT Versions

The Gradle adapter supports snapshot versions. With the `--append-snapshot` CLI flag (or the `appendSnapshot` runner option), all generated versions get a `-SNAPSHOT` suffix (e.g., `1.2.3-SNAPSHOT`) - useful for development builds published to snapshot repositories.

## Limitations

- **Version source**: only the root `gradle.properties` is supported for version management
- **Module location**: all modules must be declared in `settings.gradle(.kts)`
- **Version format**: versions must follow semantic versioning (e.g., `1.2.3`)

## Requirements

- **Node.js**: >= 24
- **Gradle**: >= 6.0 (tested with Gradle 6.x - 8.x)
- **Java**: required for running Gradle

## Next Steps

- [Plugins Overview](/tools/plugins) - All official plugins and how discovery works
- [Dependency Cascade](/guide/concepts/dependency-cascade) - Cascading version bumps
- [Configuration File](/guide/config/configuration-file) - Versioning rules

---

Need help? Check the [FAQ](/examples/faq) or open an [issue](https://github.com/versuhq/plugin-gradle/issues).
