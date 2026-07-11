# Utilities

`@versu/core` re-exports the utility functions it uses internally so plugins and integrations can build on the same primitives. They are grouped below by domain.

```typescript
import {
  parseSemVer, 
  getAllTags, 
  parseProperties, 
  logger 
} from "@versu/core";
```

## Semver Utilities

Helpers built on top of the [semver](https://www.npmjs.com/package/semver) package, working with the [`Version`](/api/types#version) type.

| Function | Description |
| -------- | ----------- |
| `parseSemVer(versionString)` | Parses a version string into a `Version` object. |
| `formatSemVer(version)` | Formats a `Version` back into a string. |
| `compareSemVer(a, b)` | Compares two versions (`-1`, `0` or `1`), suitable for sorting. |
| `bumpSemVer(version, bumpType, prereleaseId?)` | Increments a version with the given bump type (`major`, `minor`, `patch`, `premajor`, `preminor`, `prepatch`, `prerelease` or `none`). |
| `maxBumpType(bumpTypes)` | Returns the highest-priority bump type from an array (major > minor > patch > premajor > preminor > prepatch > prerelease > none). |
| `calculateBumpFromCommits(commits, config, prerelease)` | Calculates the overall bump type from a set of parsed commits using the configured commit-type mappings. |
| `isValidVersionString(versionString)` | Returns `true` if the string is a valid semantic version. |
| `isReleaseVersion(version)` | Returns `true` if the version has no pre-release identifiers. |
| `createInitialVersion()` | Returns a `Version` representing `0.0.0`, used for modules without a declared version. |
| `addBuildMetadata(version, buildMetadata)` | Appends `+<metadata>` build metadata to a version. |
| `generateTimestampPrereleaseId(baseId, timestamp?)` | Generates a sortable UTC timestamp-based pre-release identifier, e.g. `alpha.20260710.1430`. |

```typescript
import { parseSemVer, bumpSemVer, formatSemVer } from "@versu/core";

const version = parseSemVer("1.2.3");
const next = bumpSemVer(version, "minor");

console.log(formatSemVer(next)); // 1.3.0
```

## Git Utilities

Wrappers around git commands. All functions accept an optional `GitOptions` object (`{ cwd?: string }`) to set the working directory.

### Commits and History

| Function | Description |
| -------- | ----------- |
| `getCommitsSinceLastTag(...)` | Returns parsed commits since the last matching tag. |
| `getCommitsInRange(...)` | Returns parsed commits in a given ref range. |
| `isBreakingCommit(commit)` | Returns `true` if a parsed commit represents a breaking change (`!` marker or `BREAKING CHANGE` footer). |
| `isCommitBefore(...)` | Checks whether one commit is an ancestor of another. |
| `getCurrentBranch(options?)` | Returns the current branch name. |
| `getCurrentCommitShortSha(options?)` | Returns the short SHA of `HEAD` (used for build metadata). |

### Tags

| Function | Description |
| -------- | ----------- |
| `getAllTags(options?)` | Returns all tags as parsed [`GitTag`](/api/types#gittag) objects. |
| `getLastTagForModule(...)` | Returns the most recent tag for a specific module. |
| `getModuleTagName(moduleName, version, tagVersionPrefix, stripModulePrefix)` | Builds the tag name for a module version (e.g., `core@1.0.0` or `v1.0.0`). |
| `getModuleTagRegex(...)` | Builds a regex matching a module's tags. |
| `parseTagName(...)` | Extracts module and version information from a tag name. |
| `createTag(...)` | Creates a git tag. |
| `pushTag(...)` / `pushTags(options?)` | Pushes a single tag / all tags to the remote. |

### Working Tree and Remote

| Function | Description |
| -------- | ----------- |
| `isWorkingDirectoryClean(options?)` | Returns `true` if there are no uncommitted changes. |
| `hasChangesToCommit(options?)` | Returns `true` if there are staged or unstaged changes. |
| `addChangedFiles(...)` | Stages changed files. |
| `commitChanges(...)` | Creates a commit. |
| `pushCommits(options?)` | Pushes commits to the remote. |

### Repository Metadata

| Function | Description |
| -------- | ----------- |
| `getCurrentRepoUrl(options?)` | Returns the `origin` remote URL. |
| `getRepoUrlAsHttps(options?)` | Returns the remote URL normalized to HTTPS form. |
| `parseRepoUrl(repoUrl)` | Parses a repository URL into host, owner and name. |
| `getRepoHost(options?)` / `getRepoOwner(options?)` / `getRepoName(options?)` | Return individual parts of the repository URL. |
| `getProviderName(options?)` | Detects the version control provider (e.g., `github`, `gitlab`) from the remote URL. |

## File Utilities

| Function | Description |
| -------- | ----------- |
| `exists(path)` | Returns `true` if a file or directory exists and is accessible. |
| `getFriendlyPath(from, to)` | Returns a relative path when `to` is inside `from`, otherwise the absolute path (`.` for the same path). |
| `isChildPath(childPath, parentPath)` | Returns `true` if `childPath` is a subdirectory of `parentPath`. |

## Properties Utilities

Helpers for Java-style `.properties` files (used by the Gradle adapter for `gradle.properties`):

| Function | Description |
| -------- | ----------- |
| `parseProperties(propertiesPath)` | Parses a properties file into a `Map<string, string>`. Supports `=` and `:` delimiters and skips comments (`#`, `!`). |
| `upsertProperty(propertiesPath, key, value)` | Updates or inserts a single property, creating the file if needed. |
| `upsertProperties(propertiesPath, properties)` | Updates or inserts multiple properties in one pass. Existing properties are updated in place; new ones are appended. |

## Versioning Utilities

| Function | Description |
| -------- | ----------- |
| `applySnapshotSuffix(version)` | Appends `-SNAPSHOT` to a version string. Idempotent - never produces a double suffix. |
| `isSnapshotVersion(version)` | Returns `true` if the version string ends with `-SNAPSHOT`. |

## Logger

Core performs no logging by default. Consumers (like the CLI and the GitHub Action) provide a `Logger` implementation through `initLogger`; all internal call sites use the `logger` proxy, which delegates to the current implementation.

```typescript
import { initLogger, logger, type Logger } from "@versu/core";

const myLogger: Logger = {
  debug: (message, context) => console.debug(message, context),
  info: (message, context) => console.info(message, context),
  warning: (message, context) => console.warn(message, context),
  error: (message, context) => console.error(message, context),
  child: (context) => myLogger,
  group: async (name, fn) => await fn(),
  startGroup: (name) => console.group(name),
  endGroup: () => console.groupEnd(),
};

initLogger(myLogger);

logger.info("Hello from Versu");
```

::: tip
If you embed `VersuRunner` in your own tool and see no output, call `initLogger` first - the default logger is a no-op.
:::

## Next Steps

- [Types](/api/types) - Type definitions used by these functions
- [Services](/api/services) - The versioning pipeline services
- [Core Package](/api/core) - Package overview and usage

---

Questions? Check the [GitHub Discussions](https://github.com/versuhq/versu/discussions).
