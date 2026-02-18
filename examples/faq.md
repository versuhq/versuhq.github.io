# FAQ

Frequently asked questions about Versu.

## General Questions

### What is Versu?

Versu is an intelligent versioning automation tool that analyzes Conventional Commits and automatically handles semantic versioning, dependency cascades, and changelog generation.

### Do I need to learn new skills?

Not really! If you're already using Conventional Commits, Versu works automatically. Otherwise, it's just adding a simple prefix to your commit messages.

### Can Versu work with my existing project?

Yes! Versu works with any project structure. Just define your modules in `versu.config.js` and run it.

### Is Versu free?

Yes, Versu is open source and free to use. Check out the [GitHub repository](https://github.com/versuhq/versu).

## Installation & Setup

### Which Node.js version do I need?

Versu requires Node.js 20 or higher. Check your version with `node --version`.

### Can I install Versu globally?

Yes! Run `npm install -g versu` and use the `versu` command directly.

### Should I commit `package.json` changes after running Versu?

Yes! Versu updates your version files, and those changes should be committed to your repository.

### Can I run Versu in CI/CD?

Absolutely! Use the GitHub Action or run it in any CI/CD pipeline:

```bash
npx versu
```

## Usage Questions

### How do I know what version I'll get?

Run `versu --dry-run` to preview changes without applying them!

### Can I version only specific modules?

Yes! Use the `--modules` flag:

```bash
npx versu --modules core,cli
```

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

No. Commits without types (like `docs:` or `chore:`) don't affect versioning.

### Can I use custom types?

Yes! Configure custom types in `versu.config.js`:

```javascript
changelog: {
  sections: [
    { title: 'Features', types: ['feat', 'feature'] },
    { title: 'Fixes', types: ['fix', 'bugfix'] }
  ]
}
```

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

Yes! Configure it:

```javascript
{
  name: 'cli',
  dependencies: [
    {
      name: 'core',
      cascade: false
    }
  ]
}
```

### What if I have circular dependencies?

Don't! Circular dependencies are architectural issues. Versu will fail. Refactor your code.

### How do I handle pre-releases in monorepos?

```bash
# Pre-release specific modules
npx versu --prerelease alpha --modules core,cli
```

## Changelog

### Where is the changelog generated?

By default, in `CHANGELOG.md` in each module's directory.

### Can I customize the changelog format?

Yes! Use the `changelog.sections` configuration to organize commits by type.

### How do I preserve existing changelog?

Set `changelog.keep: true`:

```javascript
changelog: {
  enabled: true,
  keep: true  // Prepend new entries
}
```

### Can I generate changelogs only?

You can implement custom logic with the API, or manually organize changelog entries.

## Pre-releases

### What are pre-release versions?

Versions like `1.0.0-alpha.1` for testing before official release.

### When should I use pre-releases?

Use them for:

- Development testing (alpha)
- Feature-complete testing (beta)
- Final verification (rc)

### Can I publish pre-releases to npm?

Yes! Use npm's `--tag` flag:

```bash
npm publish --tag alpha
```

### How do I transition from beta to release?

Run `versu` without `--prerelease` flag to create the official release.

## GitHub Actions

### How do I automate versioning?

Use the GitHub Action:

```yaml
- uses: versuhq/versu@latest
```

### Do I need to set up any secrets?

For publishing to npm, you'll need `NPM_TOKEN`. GitHub token is automatic.

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
- All commits are `docs`, `chore`, etc.

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

1. Dependencies listed in config
2. Commits affect the right files
3. Use `--verbose` flag to debug

### Changelog not generated

Ensure:

1. `changelog.enabled: true` in config
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

### Can I use Versu with Lerna/Yarn Workspaces?

Yes! Versu works independently of workspace tools.

### Does Versu work with other tools?

Yes! Versu is tool-agnostic and works alongside build tools, test frameworks, etc.

### What package managers does Versu support?

Versu works with npm, Yarn, and PNPM equally well.

## Migration

### Can I migrate from other tools to Versu?

Yes! Versu reads from your existing version files and continues from there.

### What if I used semantic-release before?

Versu is a complete alternative. You can migrate your configuration.

### Will Versu break my existing workflow?

No! Use `--dry-run` to test first. Versu only changes what you tell it to.

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
