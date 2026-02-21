# Quick Start

Get Versu running in your project in 5 minutes.

## Prerequisites

Before starting, make sure you have:

- ✅ Node.js 20+ installed
- ✅ A Git repository initialized
- ✅ Your project follows [Conventional Commits](https://conventionalcommits.org/)

## Step 1: Install Versu

In case you want to use Versu as a local dev dependency:

```bash
npm install -D @versu/cli
```

Or install it globally to use it across multiple projects or system-wide:

```bash
npm install -g @versu/cli
```

## Step 2: Install Plugins

Versu uses plugins to detect your project type and manage versioning. Install the appropriate plugins for your project. For example, if you're using Gradle:

```bash
npm install -g @versu/plugin-gradle
```

## Step 3: Create Configuration File (advisable)

Versu can work with zero configuration by automatically searching for installed plugins.

However, for performance and reliability reasons, as well as to enable advanced features, it's recommended to create a `versu.config.js` file in your project with at least the `plugins` array to explicitly specify which plugins to use.

::: code-group

```javascript [versu.config.js]
export default {
  plugins: [
    // Add plugins here (e.g., npm, gradle, etc.)
    "@versu/plugin-gradle",
  ],
};
```

:::

## Step 4: Run Versu

If you installed Versu globally you can run:

```bash
versu
```

You can also run it using npx:

```bash
npx @versu/cli
```

::: info
If you have a local or global installion in your system, `npx` will search for the local version first and fallback to the global one if not found.
:::

Versu will:

1. Analyze your commit history
2. Determine version bumps
3. Update version files
4. Generate changelogs
5. Display results

## Step 5: Results

Versu will create or update:

- Version related files based on your plugins

  (e.g. `package.json`, `gradle.properties`, etc.)

- `CHANGELOG.md` files per module and a root one if you have multiple modules
- Commit messages and tags for your new versions

::: tip
You can execute with `--dry-run` flag to see what changes would be made without actually modifying any files. This is a great way to preview the results before applying them.
:::

## Common Commands

```bash
# Check what will be versioned
versu --dry-run

# Generate specific pre-release
versu --prerelease-mode --prerelease-id alpha
```

## Next Steps

- [Configuration Guide](/guide/config/configuration-file) - Customize Versu behavior
- [Concepts](/guide/concepts/conventional-commits) - Understand Conventional Commits
- [GitHub Action](/tools/github-action) - Automate versioning in CI/CD

## Troubleshooting

### No versions bumped?

Check that your commits follow [Conventional Commits](https://conventionalcommits.org/). Example:

```text
feat: add new feature    # ✓ Triggers minor bump
fix: resolve bug         # ✓ Triggers patch bump
docs: update README      # ✗ No version bump (unless configured otherwise)
```

### Dependencies not updated?

Plugins are responsible for identifying project structure and its dependencies. If you have a multi-module project, make sure your plugins are correctly configured to recognize the relationships between modules.

You can enable debug logging to see how Versu is analyzing your project:

```bash
DEBUG=versu* versu #...
```

### Still stuck?

- Check [Examples](/examples/basic-setup)
- Read [API Documentation](/api/core)
- Open an [issue on GitHub](https://github.com/versuhq/versu/issues)
