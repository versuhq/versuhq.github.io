# Installation

Get Versu set up in your project with one of the following methods.

## NPM Installation

The easiest way to install Versu is via npm:

```bash
npm install -D @versu/cli
```

Or if you want to use it globally:

```bash
npm install -g @versu/cli
```

## Yarn Installation

If you're using Yarn, install with:

```bash
yarn add --dev @versu/cli
```

Or globally:

```bash
yarn global add @versu/cli
```

## PNPM Installation

For PNPM users:

```bash
pnpm add -D @versu/cli
```

Or globally:

```bash
pnpm add -g @versu/cli
```

## Via GitHub Action

If you want to use Versu in your CI/CD pipeline, add this to your GitHub Actions workflow:

```yaml
- uses: versuhq/versu@latest
  with:
    # Your configuration here
```

See the [GitHub Action](/tools/github-action) documentation for more details.

## Verify Installation

After installation, verify Versu is working:

```bash
# If installed locally
npx @versu/cli --version

# If installed globally
versu --version
```

You should see the version number displayed.

## System Requirements

- **Node.js**: 20 or higher
- **Git**: 2.0.0 or higher (for commit analysis)

## Next Steps

Now that Versu is installed, check out:

- [Quick Start](/guide/quick-start) - Run your first versioning cycle
- [Configuration](/guide/config/configuration-file) - Set up Versu for your project

## Troubleshooting

### Installation Fails

If you encounter issues during installation:

1. Clear your npm cache: `npm cache clean --force`
2. Delete `node_modules` and lock files
3. Reinstall: `npm install`

### Version Command Not Found

If `versu --version` doesn't work:

1. Ensure Node.js is installed: `node --version`
2. Try using `npx`: `npx @versu/cli --version`
3. For global install, check your npm path: `npm config get prefix`

## Getting Help

If you need help:

- Check the [FAQ](/examples/faq)
- Open an [issue on GitHub](https://github.com/versuhq/versu/issues)
- Read the [API documentation](/api/core)
