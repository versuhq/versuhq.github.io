# Quick Reference

Quick lookup for common Versu commands and configurations.

## Installation

```bash
# npm
npm install -D @versu/cli

# Yarn
yarn add --dev @versu/cli

# PNPM
pnpm add -D @versu/cli

# Global
npm install -g @versu/cli
```

## Commands

```bash
# Run versioning
npx @versu/cli run

# Dry run (preview only)
npx @versu/cli run --dry-run

# Pre-release
npx @versu/cli run --prerelease-mode --prerelease-id alpha
npx @versu/cli run --prerelease-mode --prerelease-id beta
npx @versu/cli run --prerelease-mode --prerelease-id rc

# Verbose output
DEBUG=versu* npx @versu/cli run

# Help
npx @versu/cli --help

# Version
npx @versu/cli --version
```

## NPM Scripts

```json
{
  "scripts": {
    "release": "versu run",
    "release:dry": "versu run --dry-run",
    "release:alpha": "versu run --prerelease-mode --prerelease-id alpha",
    "release:local": "versu run --no-push-changes --no-create-tags"
  }
}
```

## Minimal Config

```javascript
export default {
  plugins: [
    // Add plugins here
  ]
}
```

## Changelog Config

```javascript
export default {
  changelog: {
    root: {
      // Root CHANGELOG.md
      context: {
        /* template variables */
      },
      options: {
        /* conventional-changelog-writer options */
      },
    },
    module: {
      // Per-module CHANGELOG.md (monorepos)
      context: {},
      options: {},
    },
  },
};
```

See [Changelog Generation](/guide/config/changelog) for a complete example.

## Conventional Commits

```text
feat: add new feature               # → Minor bump
fix: resolve bug                    # → Patch bump
feat!: breaking change              # → Major bump
docs: update documentation          # → Patch bump (default)
BREAKING CHANGE: description        # → Major bump
```

## Version Bumping

```text
From 1.0.0:
- feat + fix        → 1.1.0 (minor)
- fix + fix         → 1.0.1 (patch)
- feat! + anything  → 2.0.0 (major)
```

## Cascade Strategy

```javascript
export default {
  versioning: {
    // ...
    cascadeRules: {
      // Bump dependents with the same level
      stable: {
        major: "major",
        minor: "minor",
        patch: "patch",
      },
    },
  },
};
```

## GitHub Action

```yaml
- uses: versuhq/versu@v3
```

## File Locations

```text
versu.config.js       # Root directory
.github/workflows/    # GitHub Actions
package.json          # Dependencies
CHANGELOG.md          # Generated changelog
```

## Exit Codes

| Code | Meaning |
| ---- | ------- |
| `0` | Success - including runs where all versions were already up to date |
| `2` | Failure - versioning error (e.g., dirty working directory, plugin not found) or invalid command usage |

## Common Issues

### No version bumped?

- Check commits follow Conventional Commits
- Verify the commits touch files under the module's path
- Use `DEBUG=versu*` to debug

### Cascade not working?

- Verify dependencies between modules are detected (run with `--dry-run`)
- Check for circular dependencies
- Review the `cascadeRules` setting

### Changelog not generated?

- Changelogs are only written when at least one module was bumped
- Make sure `--no-generate-changelog` isn't set (generation is on by default)
- `--dry-run` calculates versions but never writes files
- Looking for a different filename? Set it with `--changelog-filename`

## Links

- **GitHub**: <https://github.com/versuhq/versu>
- **NPM**: <https://www.npmjs.com/package/@versu/core>
- **Docs**: <https://versuhq.github.io/>
- **Issues**: <https://github.com/versuhq/versu/issues>

## Resources

- [Full Guide](/guide/introduction) - Complete documentation
- [Configuration Reference](/guide/config/configuration-file) - All options
- [Examples](/examples/basic-setup) - Real examples
- [FAQ](/faq) - Common questions

---

Need more help? Check the [full documentation](/guide/introduction) or [open an issue](https://github.com/versuhq/versu/issues).
