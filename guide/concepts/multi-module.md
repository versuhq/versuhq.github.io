# Multi-Module Projects

Versu is built for monorepos and multi-module projects where each module can be versioned independently.

## Understanding Multi-Module Structure

A typical multi-module project looks like:

```text
my-monorepo/
├── packages/
│   ├── core/
│   │   ├── src/
│   │   ├── package.json
│   │   └── CHANGELOG.md
│   ├── cli/
│   │   ├── src/
│   │   ├── package.json
│   │   └── CHANGELOG.md
│   └── plugin-gradle/
│       ├── src/
│       ├── build.gradle
│       └── CHANGELOG.md
├── versu.config.js
├── CHANGELOG.md
└── package.json
```

## Identifying Modules

Plugins are responsible for identifying all modules in a multi-module project. Each plugin needs to follow a contract to provide module information to Versu.

The expected output is a JSON object with the following example structure:

```json
{
  "core": {
    "name": "core",
    "path": "packages/core",
    "version": "1.2.3",
    "affectedModules": ["cli", "plugin-gradle"],
    "type": "module"
  },
  "cli": {
    "name": "cli",
    "path": "packages/cli",
    "version": "0.5.0",
    "affectedModules": [],
    "type": "module"
  },
  "plugin-gradle": {
    "name": "plugin-gradle",
    "path": "packages/plugin-gradle",
    "version": "0.4.0",
    "affectedModules": [],
    "type": "module"
  }
}
```

In this example, we have three modules: `core`, `cli`, and `plugin-gradle`. The `core` module is a dependency for both `cli` and `plugin-gradle`, so it lists them in its `affectedModules` array.

### Module Properties

| Property | Type | Description | Required |
| ---------- | ------ | ------------- | --------- |
| `name` | string | Name of the module | Yes |
| `path` | string | Relative path to module root | Yes |
| `version` | string | Current version of the module (semver) | No<sup>1</sup> |
| `affectedModules` | array | Array of module identifiers this module affects | Yes |
| `type` | string | Type of module (`root` or `module`) | Yes |

<sup>1</sup> The `version` property is optional in the output from plugins and depends on the plugin's implementation.

Additionally to these properties, plugins can include any other relevant information about the module as needed.

## Independent Versioning

Each module has its own version:

- **core**: 2.3.1
- **cli**: 1.5.2
- **plugin-gradle**: 0.4.0

When you run Versu:

1. It analyzes commits affecting each module
2. Each module gets its own version bump
3. Each module has its own `CHANGELOG.md`
4. A root `CHANGELOG.md` is generated

## Commit Scoping

Versu uses Git to determine which commits affect which modules:

```text
# Commit affecting core module
packages/core/src/index.ts changed
feat: add new export

# Commit affecting cli module
packages/cli/src/index.ts changed
feat: add new command

# Commit affecting both
packages/core/src/index.ts changed
packages/cli/src/index.ts changed
feat!: redesign API (breaking change)
```

## Dependency Cascade

When a module changes, its dependents are automatically versioned:

```text
Module Dependency Graph:
    core (v1.0.0)
    /    \
   /      \
 cli      plugin-gradle
(v1.0.0)  (v1.0.0)
```

<!-- markdownlint-disable-next-line MD036 -->
**Scenario: core is updated**

- core 1.0.0 → 1.1.0 (new feature)
- cli 1.0.0 → 1.0.1 (dependency updated, patch bump)
- plugin-gradle 1.0.0 → 1.0.1 (dependency updated, patch bump)

<!-- markdownlint-disable-next-line MD036 -->
**Scenario: cli is updated**

- cli 1.0.0 → 1.1.0 (new feature)
- core and plugin-gradle: no change

## Real-World Example

```json
{
  "common": {
    "name": "common",
    "path": "packages/common",
    "version": "1.0.0",
    "affectedModules": ["auth", "api", "web", "mobile"],
    "type": "module"
  },
  "auth": {
    "name": "auth",
    "path": "packages/auth",
    "version": "1.0.0",
    "affectedModules": ["api", "web", "mobile"],
    "type": "module"
  },
  "api": {
    "name": "api",
    "path": "packages/api",
    "version": "1.0.0",
    "affectedModules": ["web", "mobile"],
    "type": "module"
  },
  "web": {
    "name": "web",
    "path": "packages/web",
    "version": "1.0.0",
    "affectedModules": [],
    "type": "module"
  },
  "mobile": {
    "name": "mobile",
    "path": "packages/mobile",
    "version": "1.0.0",
    "affectedModules": [],
    "type": "module"
  }
}
```

When `common` is updated, the cascade looks like:

```text
common (update)
  ↓
auth → api ↘
  ↓         → web
  ↓       ↙
auth → mobile
```

All downstream modules get a patch version bump automatically.

## Best Practices

### ✅ Do's

- Keep module dependencies acyclic
- Document dependencies clearly
- Use descriptive module names
- Update all dependents when making breaking changes
- Version frequently to catch issues early

### ❌ Don'ts

- Create circular dependencies
- Leave undefined dependencies
- Manually manage dependency versions

## Versioning Strategy

Versu supports different strategies for cascading version bumps to dependent modules:

```javascript
export default {
  versionRules: {
    // ...
    dependencyBumps: {
      major: 'major',
      minor: 'minor',
      patch: 'patch'
    }
  }
}
```

On the example above a major bump in a module will trigger a major bump in its dependents, a minor bump will trigger a minor bump and so on. You can customize this behavior as needed.

## Next Steps

- [Dependency Cascade](/guide/concepts/dependency-cascade) - Deep dive
- [Configuration](/guide/config/configuration-file) - Full configuration guide
- [Examples](/examples/monorepo-setup) - Real-world examples

---

Ready to set up your multi-module project? Check out the [Configuration Guide](/guide/config/configuration-file)!
