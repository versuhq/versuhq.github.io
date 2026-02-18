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
npx @versu/cli

# Dry run (preview only)
npx @versu/cli --dry-run

# Pre-release
npx @versu/cli --prerelease-mode --prerelease-id alpha
npx @versu/cli --prerelease-mode --prerelease-id beta
npx @versu/cli --prerelease-mode --prerelease-id rc

# Verbose output
DEBUG=versu* npx @versu/cli

# Help
npx @versu/cli --help

# Version
npx @versu/cli --version
```

## NPM Scripts

::: warning
This page is still under construction. Check back soon for the full example!
:::

## Minimal Config

```javascript
export default {
  plugins: [
    // Add plugins here
  ]
}
```

## Changelog Config

::: warning
This page is still under construction. Check back soon for the full example!
:::

## Conventional Commits

```text
feat: add new feature               # → Minor bump
fix: resolve bug                    # → Patch bump
feat!: breaking change              # → Major bump
docs: update documentation          # → No bump
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
  versionRules: {
    // ...
    dependencyBumps: {
      // Bump dependents with the same level
      major: 'major',
      minor: 'minor',
      patch: 'patch'
    }
  }
}
```

## GitHub Action

```yaml
- uses: versuhq/versu@latest
```

## File Locations

```text
versu.config.js       # Root directory
.github/workflows/    # GitHub Actions
package.json          # Dependencies
CHANGELOG.md          # Generated changelog
```

## Exit Codes

::: warning
This page is still under construction. Check back soon for the full example!
:::

## Common Issues

### No version bumped?

- Check commits follow Conventional Commits
- Verify module path in config
- Use `DEBUG=versu*` to debug

### Cascade not working?

- Verify dependency list in config
- Check for circular dependencies
- Review dependencyBumps setting

### Changelog not generated?

::: warning
This page is still under construction. Check back soon for the full example!
:::

## Links

- **GitHub**: <https://github.com/versuhq/versu>
- **NPM**: <https://www.npmjs.com/package/@versu/core>
- **Docs**: <https://vitepress.dev/>
- **Issues**: <https://github.com/versuhq/versu/issues>

## Resources

- [Full Guide](/guide/introduction) - Complete documentation
- [Configuration Reference](/guide/config/configuration-file) - All options
- [Examples](/examples/basic-setup) - Real examples
- [FAQ](/examples/faq) - Common questions

---

Need more help? Check the [full documentation](/guide/introduction) or [open an issue](https://github.com/versuhq/versu/issues).
