# Maven Plugin

`@versu/plugin-maven` provides support for detecting and updating versions in Maven multi-module projects.

## Features

- **Multi-Module Support** - Recursive discovery of the `<modules>` hierarchy
- **Pure XML Parsing** - Reads and updates `pom.xml` files directly; no Maven or Java required to run
- **Dependency Detection** - Cascade graph built from `<dependencies>` between internal modules
- **Parent Awareness** - Child modules cascade when their parent bumps, and inherited `<parent><version>` entries are kept in sync
- **SNAPSHOT Support** - Optional `-SNAPSHOT` suffix for development builds
- **Auto-Detection** - Automatically detected when `pom.xml` is present

## Installation

::: code-group

```bash [With Core]
npm install @versu/core @versu/plugin-maven
```

```bash [With CLI]
npm install -g @versu/cli @versu/plugin-maven
```

:::

With the [GitHub Action](/tools/github-action), the plugin is already included - no separate installation needed.

## Usage

Once installed, the plugin is discovered automatically (or list it explicitly in your [configuration file](/guide/config/configuration-file#plugins-optional)):

```javascript
// versu.config.js
export default {
  plugins: ["@versu/plugin-maven"],
};
```

Then run Versu as usual:

```bash
versu run                  # adapter auto-detected
versu run --adapter maven  # or forced explicitly
```

## Auto-Detection

The adapter activates when a `pom.xml` file is present in the repository root.

## Module Discovery

Discovery starts at the root `pom.xml` and follows `<modules>` entries recursively. Module IDs are derived from each module's path in Gradle-style notation:

```text
myproject/               → :          (root)
├── pom.xml
├── core/                → :core
│   └── pom.xml
└── libs/
    └── utils/           → :libs:utils
        └── pom.xml
```

For each module the plugin reads:

- `groupId` / `artifactId` (the `groupId` may be inherited from the parent)
- `version` - taken from `<project><version>`, or inherited from `<parent><version>` when not declared
- `<dependencies>` - to detect references to other modules in the project
- `<modules>` - to recurse into children

## Dependency Cascade

A module's bump cascades to:

- **All descendant modules** in the `<modules>` hierarchy - children inherit from their parent, so a parent bump affects them
- **Every module that declares a `<dependency>`** on it (matched by `groupId:artifactId`)

The bump level applied to affected modules follows your [cascade rules](/guide/concepts/dependency-cascade).

## Version Updates

When writing new versions, the plugin updates in each affected `pom.xml`:

- `<project><version>` - when the module declares its own version
- `<parent><version>` - when the module's parent was renumbered

Modules that inherit their version (no `<project><version>` element) are not given one; they keep following their parent.

## SNAPSHOT Versions

The Maven adapter supports snapshot versions. With the `--append-snapshot` CLI flag (or the `appendSnapshot` runner option), all generated versions get a `-SNAPSHOT` suffix (e.g., `1.2.3-SNAPSHOT`) - matching Maven's convention for development builds.

## Limitations

- **Version format**: versions must follow semantic versioning (e.g., `1.2.3`)
- **Internal dependencies** are matched by exact `groupId:artifactId` coordinates; dependencies resolved through properties or BOM imports are not followed

## Next Steps

- [Plugins Overview](/tools/plugins) - All official plugins and how discovery works
- [Dependency Cascade](/guide/concepts/dependency-cascade) - Cascading version bumps
- [Configuration File](/guide/config/configuration-file) - Versioning rules

---

Need help? Check the [FAQ](/examples/faq) or open an [issue](https://github.com/versuhq/plugin-maven/issues).
