# FAQ

Frequently asked questions about Versu.

## General Questions

### What is Versu?

Versu is an intelligent versioning automation tool that analyzes Conventional Commits and automatically handles semantic versioning, dependency cascades, and changelog generation.

### Do I need to learn new skills?

Not really! If you're already using Conventional Commits, Versu works automatically. Otherwise, it's just adding a simple prefix to your commit messages.

### Can Versu work with my existing project?

Yes! Versu is not tied to any specific project structure or language. As long as there is a plugin for your project type (e.g., Gradle, npm, etc.), Versu can analyze your commits and manage versions.

### Is Versu free?

Yes, Versu is open source and free to use. Check out the [GitHub repository](https://github.com/versuhq/versu).

## Installation & Setup

### Which Node.js version do I need?

Versu requires Node.js 20 or higher. Check your version with `node --version`.

### Can I install Versu globally?

Yes! Run `npm install -g @versu/cli` and use the `versu` command directly.

### Can I run Versu in CI/CD?

Absolutely! Use the GitHub Action or run it in any CI/CD pipeline:

```bash
npx @versu/cli
```

## Usage Questions

### How do I know what version I'll get?

Run `versu --dry-run` to preview changes without applying them!

### What if I want to skip versioning?

Don't commit any changes that require versioning, or use `--dry-run` instead of actually running it.

### How do I rollback a version?

Since versions are committed to Git, you can:

```bash
git revert <commit-hash>
```

Or manually edit version files and commit.

## Conventional Commits

### What's a Conventional Commit?

A commit message format that follows this pattern:

```text
type(scope): description
```

Examples: `feat(auth): add login`, `fix(api): resolve bug`

### Does every commit need a type?

No. Commits without types will be ignored for versioning.

### Can I use custom types?

Yes! Configure custom types in `versu.config.js`:

```javascript
export default {
  // Other configuration options
  versionRules: {
    //... other version rules
    commitTypeBumps: {
      feat: "minor", // major, minor, patch, or ignore
      fix: "patch",
      //...
      //... other custom commit types
    },
    //... other version rules
  },
};
```

Check out the [configuration guide](/guide/config/configuration-file) for more details.

### What's a breaking change?

A change that requires users to update their code. Indicate with:

- `feat!: breaking change` or
- `feat: description\n\nBREAKING CHANGE: details`

## Multi-Module Projects

### How does cascade work?

When a dependency changes, all modules that depend on it automatically get versioned too.

```text
Module A (1.0.0 → 1.1.0)
    ↓
Module B (1.0.0 → 1.0.1)  ← Cascaded patch bump
```

### Can I disable cascade for specific modules?

No. Cascade is an integral part of how Versu ensures consistency across modules. If you have a use case that requires more granular control, please [open an discussion](https://github.com/versuhq/versu/discussions).

### What if I have circular dependencies?

Don't! Circular dependencies are architectural issues. Versu will fail. Refactor your code.

### How do I handle pre-releases in monorepos?

```bash
# Pre-release specific modules
npx @versu/cli --prerelease-mode
```

## Changelog

### Where is the changelog generated?

By default, in `CHANGELOG.md` in each module's directory and at the root for the overall project.

### Can I customize the changelog format?

Yes! Use the `changelog` property in your configuration file. Check out the [changelog configuration guide](/guide/config/changelog) for details.

### Can I generate changelogs only?

No. Changelog generation is part of the versioning process when enabled and for now cannot be run independently. If you need this feature, please [open a discussion](https://github.com/versuhq/versu/discussions).

## Pre-releases

### What are pre-release versions?

Versions like `1.0.0-alpha.1` for testing before official release.

### When should I use pre-releases?

Use them for:

- Development testing (alpha)
- Feature-complete testing (beta)
- Final verification (rc)

### How do I transition from beta to release?

Run `versu` without `--prerelease-mode` flag to create the official release.

## GitHub Actions

### How do I automate versioning?

Use the GitHub Action:

```yaml
- uses: versuhq/versu@v0
```

### Do I need to set up any secrets?

Versu doesn't require secrets by default, but if you want to push changes or create tags, make sure your GitHub token has the necessary permissions.

Also check that the plugins you use don't require additional secrets.

### Can I run Versu only on certain branches?

Yes! Use `on` conditions:

```yaml
on:
  push:
    branches:
      - main
```

### What if the action fails?

Check the logs. Common issues:

- No commits since last version
- Configuration errors
- Git errors

## Troubleshooting

### "No changes detected"

This is normal! It means either:

- No commits follow Conventional Commits
- Affected commits are configured to be ignored

### "Configuration error"

Check your `versu.config.js`:

- Valid JavaScript syntax
- Correct module paths
- No circular dependencies

### "Git error"

Versu needs:

- A Git repository (`.git` folder)
- Commit history available
- Proper Git configuration

Try: `git log --oneline`

### Versions not cascading

Check:

1. Dependencies are correctly detected
2. Commits affect the right files
3. Use `DEBUG=versu*` flag to debug

### Changelog not generated

Ensure:

1. `changelog` configuration is correct
2. Module has commits with types
3. File path is writable

## Performance

### Is Versu slow for large projects?

No! Versu is optimized and typically completes in seconds.

### Does it need full Git history?

Versu only needs history since last release, but `--fetch-depth: 0` is recommended in CI for safety.

## Compatibility

### Does Versu work with monorepos?

Yes! That's its primary use case.

### Does Versu work with non-monorepo projects?

Yes! Versu can be used in single-module projects as well.

### Can I use Versu with Lerna/Yarn Workspaces?

Yes! Versu works independently of workspace tools.

### Does Versu work with other tools?

Yes! Versu is tool-agnostic and works alongside build tools, test frameworks, etc.

### What package managers does Versu support?

Versu works with npm, Yarn, and PNPM equally well.

## Getting Help

### Where do I report bugs?

Open an issue on [GitHub](https://github.com/versuhq/versu/issues).

### How do I request features?

Create a feature request on [GitHub Discussions](https://github.com/versuhq/versu/discussions).

### Where can I ask questions?

Post in [GitHub Discussions](https://github.com/versuhq/versu/discussions) - the maintainers are active there!

### Is there a community?

Yes! Join discussions, check examples, and contribute back!

---

Still have questions? [Open a discussion](https://github.com/versuhq/versu/discussions) or [create an issue](https://github.com/versuhq/versu/issues)!
