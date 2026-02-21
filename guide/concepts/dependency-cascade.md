# Dependency Cascade

Dependency cascade is the automatic versioning of dependent modules when their dependencies are updated.

## The Problem

In multi-module projects, manually managing dependent versions is tedious and error-prone:

```text
When core is updated:
- Did you remember to update cli's dependency on core?
- What about plugin-gradle?
- What version bump should dependents get?
```

## The Solution

Versu automatically handles dependency cascades by analyzing module relationships and intelligently updating all dependents.

## How Cascade Works

### 1. Analyze Changes

Versu detects which modules changed:

```text
Modified files:
✓ packages/core/src/index.ts → core module affected
✓ packages/core/CHANGELOG.md → core module affected
✗ packages/cli/docs/README.md → cli module not affected
```

### 2. Calculate Version Bumps

Determine version change for each affected module:

```text
Module    | Type of Change | Bump Type
----------|----------------|----------
core      | feat           | MINOR (1.0.0 → 1.1.0)
cli       | (unchanged)    | Cascade
```

### 3. Apply Cascade Rules

For modules that depend on changed modules:

```javascript
// Cascade Rule: "patch"
If dependency was bumped → dependent gets PATCH bump (default)

Example:
core:    1.0.0 → 1.1.0  (MINOR bump)
cli:     1.2.0 → 1.2.1  (PATCH bump due to cascade)
```

### 4. Recursive Cascade

The cascade applies recursively through the dependency tree:

```text
    core (1.0.0 → 1.1.0)
      ↓
    cli (1.2.0 → 1.2.1)
      ↓
    web (0.5.0 → 0.5.1)
```

## Cascade Strategies

By default dependents always get a bump matching their dependency's bump type:

::: code-group

```javascript [versu.config.js]
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

:::

```text
core:    1.0.0 → 2.0.0  (BREAKING, MAJOR bump)
cli:     1.2.0 → 1.2.1  (PATCH bump due to cascade)
```

This is fully customizable and what bump to apply when a dependency is updated.

## Example Scenarios

### Scenario 1: Bug Fix Cascade

```text
Commit: packages/core/src/fix-bug.ts
Type: fix (patch bump)

Result:
core:              1.5.0 → 1.5.1 (patch)
cli:               2.0.0 → 2.0.1 (cascaded patch)
plugin-gradle:     0.8.0 → 0.8.1 (cascaded patch)
web:               3.1.0 → 3.1.1 (cascaded patch from cli)
```

### Scenario 2: Feature Cascade

```text
Commit: packages/core/src/new-feature.ts
Type: feat (minor bump)

core:              1.5.0 → 1.6.0 (minor)
cli:               2.0.0 → 2.1.0 (cascaded minor)
plugin-gradle:     0.8.0 → 0.9.0 (cascaded minor)
```

### Scenario 3: Breaking Change Cascade

```text
Commit: packages/core/src/api-redesign.ts
Type: feat! (major, breaking change)

core:              1.5.0 → 2.0.0 (major)
cli:               2.0.0 → 3.0.0 (cascaded major)
plugin-gradle:     0.8.0 → 1.0.0 (cascaded major)
```

## Cascade Order

Versu uses a fixed-point iteration approach to ensure correct cascade order, based on the original dependency graph discovered during analysis.

The algorithm stops when no new modules are affected by the cascade, ensuring all dependents are correctly updated. This ensures correct version calculations at each level.

## Best Practices

### ✅ Do's

- Test cascade behavior in dry-run mode
- Review version bumps before publishing

### ❌ Don'ts

- Create circular dependencies (cascade will fail)
- Publish incompatible versions due to cascade mismatch

## Troubleshooting

### Cascades Not Working?

1. Check module dependencies are correctly defined
2. Verify commit affects the expected modules
3. Use `--dry-run` to preview changes
4. Check configuration file syntax

### Unwanted Cascades?

1. Review your dependency tree for unnecessary links
2. Consider using different cascade strategy

## Next Steps

- [Multi-Module Projects](/guide/concepts/multi-module) - Module configuration
- [Configuration Guide](/guide/config/configuration-file) - Detailed settings
- [Examples](/examples/monorepo-setup) - Real-world examples

---

Ready to understand configuration? Check out the [Configuration Guide](/guide/config/configuration-file)!
