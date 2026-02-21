# Semantic Versioning

Semantic Versioning (SemVer) is a versioning scheme that uses a three-part version number: MAJOR.MINOR.PATCH.

## Version Format

```text
MAJOR.MINOR.PATCH[-prerelease][+build-metadata]
```

Examples:

- `1.0.0` - Initial release
- `1.2.3` - Stable version
- `2.0.0-alpha.1` - Pre-release version
- `1.5.0+build.123` - With build metadata

## When to Bump Versions

### MAJOR Version (X.0.0)

Bump the major version when you make **incompatible API changes**.

Examples:

- Remove or rename a function
- Change function signatures
- Restructure data formats
- Remove dependencies that were part of the public API

### MINOR Version (0.Y.0)

Bump the minor version when you add **new functionality in a backwards-compatible manner**.

Examples:

- Add new features
- Add new methods to classes
- Improve existing features
- Add deprecation warnings

### PATCH Version (0.0.Z)

Bump the patch version when you make **backwards-compatible bug fixes**.

Examples:

- Fix bugs
- Fix performance issues
- Update dependencies for security fixes
- Fix documentation

## Pre-release Versions

Pre-release versions are indicated by appending a hyphen and a series of dot-separated identifiers:

```text
1.0.0-alpha
1.0.0-alpha.1
1.0.0-beta
1.0.0-beta.2
1.0.0-rc.1
2.0.0-preview
```

Pre-release versions:

- Indicate unstable versions
- Take precedence below the associated normal version
- Are useful for testing before official release

**Examples of precedence:**

```text
1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta
< 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11
< 1.0.0-rc.1 < 1.0.0
```

## Build Metadata

Build metadata is indicated by appending a plus sign and a series of dot-separated identifiers:

```text
1.0.0+20130313144700
1.0.0+build.1
1.0.0+exp.sha.5114f85
```

Build metadata:

- Should be ignored when determining version precedence
- Useful for tracking build information

## Versu and Semantic Versioning

Versu automatically handles semantic versioning by:

1. **Analyzing commits** using Conventional Commits
2. **Determining the highest version bump needed**
   - If any breaking change → MAJOR bump
   - Else if any feature → MINOR bump
   - Else if any fix → PATCH bump
3. **Applying that bump** to the current version
4. **Optionally creating pre-release versions**

### Example Workflow

Starting with version `1.0.0`:

```text
Commits:
- feat: add new feature    → Would bump to 1.1.0
- fix: resolve bug         → Would bump to 1.0.1
Result: 1.1.0 (minor takes precedence)

Next cycle with version 1.1.0:
- feat(api)!: redesign API → Would bump to 2.0.0
- feat: add utility        → Would bump to 1.2.0
Result: 2.0.0 (breaking change takes precedence)
```

## Configuration in Versu

Configure how Versu handles versioning:

```bash
# Enable pre-release versioning
versu --prerelease-mode --prerelease-id alpha

# Add build metadata with short git hash
versu --add-build-metadata

# Use timestamps prerelease identifiers
versu --prerelease-mode --timestamp-versions

# Add SNAPSHOT suffix for development versions
# if supported by your plugins
versu --append-snapshot
```

In addition, you can customize versioning rules and their effect on version bumps in your `versu.config.js`:

::: code-group

```javascript [versu.config.js]
export default {
  versionRules: {
    defaultBump: 'patch',
    commitTypeBumps: {
      feat: 'minor',
      fix: 'patch',
      perf: 'patch',
      refactor: 'patch',
      docs: 'none',
      style: 'none',
      test: 'none',
      chore: 'none',
      ci: 'none',
      build: 'none'
    },
    dependencyBumps: {
      major: 'major',
      minor: 'minor',
      patch: 'patch'
    }
  }
}
```

:::

## Best Practices

### ✅ Do's

- Use semantic versioning for public APIs
- Increment MAJOR for breaking changes
- Use pre-releases for testing
- Document breaking changes clearly
- Keep versions consistent across related packages

### ❌ Don'ts

- Skip version numbers
- Use 0.0.x indefinitely (stabilize to 1.0.0)
- Break API without incrementing MAJOR
- Commit breaking changes without pre-release testing

## Relationship with Conventional Commits

Semantic Versioning defines **what** to increment, while Conventional Commits specifies **how** to determine what to increment:

- `feat:` commits → MINOR version bump
- `fix:` commits → PATCH version bump
- `BREAKING CHANGE:` commits → MAJOR version bump

## Further Reading

- [Official Semantic Versioning Spec](https://semver.org/)
- [Conventional Commits](/guide/concepts/conventional-commits)
- [Pre-release Configuration](/guide/config/prerelease)

---

Ready to understand more? Check out [Multi-Module Projects](/guide/concepts/multi-module)!
