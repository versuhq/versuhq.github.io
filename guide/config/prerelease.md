# Pre-release Versions

Learn how to generate pre-release versions with Versu.

## What are Pre-release Versions?

Pre-release versions indicate unstable releases for testing before the official version:

- `1.0.0-alpha` - Early development version
- `1.0.0-beta` - Feature-complete but untested version  
- `1.0.0-rc.1` - Release candidate, nearly ready
- `2.0.0-preview` - Custom pre-release tag

## Enabling Pre-release

Pre-release mode can be enabled via CLI:

```bash
npx @versu/cli --prerelease-mode # default tag is 'alpha'
npx @versu/cli --prerelease-mode --prerelease-id beta
npx @versu/cli --prerelease-mode --prerelease-id rc
```

## Pre-release Tags

### Standard Tags

| Tag | Meaning | Use Case |
| ----- | --------- | ---------- |
| `alpha` | Early development | Internal testing |
| `beta` | Feature-complete | External testing |
| `rc` | Release candidate | Pre-release testing |
| `preview` | Preview release | Demo purposes |

### Custom Tags

You can provide any custom tag with `--prerelease-id`:

```bash
npx @versu/cli --prerelease-mode --prerelease-id custom
```

## Pre-release Workflow

::: warning
This page is still under construction. Check back soon for the full example!
:::

## Configuration Options

::: warning
This page is still under construction. Check back soon for the full example!
:::

### Metadata

You can add short SHA as build metadata to a version:

```bash
npx @versu/cli --prerelease-mode --add-build-metadata
```

Result: `1.0.0-alpha.1+build.abc1234`

::: warning
This page is still under construction. Check back soon for the full example!
:::

## Best Practices

### ✅ Do's

- Use alpha for development
- Use beta for feature-complete
- Use rc for pre-production
- Document what changed in pre-release
- Get feedback from pre-release testers

### ❌ Don'ts

- Skip testing pre-releases
- Leave pre-releases indefinitely
- Mix multiple pre-release tags in same release cycle
- Publish pre-release as stable

## Troubleshooting

::: warning
This page is still under construction. Check back soon for the full example!
:::

## Next Steps

- [Configuration File](/guide/config/configuration-file) - Full configuration
- [Changelog](/guide/config/changelog) - Changelog generation
- [GitHub Action](/tools/github-action) - Automated CI/CD

---

Ready to automate everything? Check the [GitHub Action Documentation](/tools/github-action)!
