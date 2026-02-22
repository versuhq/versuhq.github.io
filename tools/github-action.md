# GitHub Action

Versu GitHub Action automates versioning in your CI/CD pipeline.

## Basic Usage

Add to your GitHub Actions workflow:

```yaml
- uses: versuhq/versu@latest
```

## Inputs

| Input | Description | Required | Default |
| ------- | ------------- | ---------- | --------- |
| `prerelease-mode` | Enable prerelease mode for generating pre-release versions. | No | `false` |
| `prerelease-id` | Custom identifier for pre-release versions (e.g., `alpha`, `beta`). | No | `alpha` |
| `bump-unchanged` | Bump version even if there are no changes since the last release. | No | `false` |
| `add-build-metadata` | Add build metadata to the version (e.g., `1.0.0+build.123`). | No | `false` |
| `timestamp-versions` | Append a timestamp to the version (e.g., `1.0.0-20240101.123456`). | No | `false` |
| `append-snapshot` | Append `-SNAPSHOT` to the version (e.g., `1.0.0-SNAPSHOT`). | No | `false` |
| `create-tags` | Automatically create Git tags for the new version. | No | `true` |
| `generate-changelog` | Generate a changelog based on commits since the last version. | No | `true` |
| `push-changes` | Push version changes and tags to the remote repository. | No | `true` |
| `dry-run` | Run the action without making any changes (for testing). | No | `false` |
| `adapter` | Specify a custom adapter for versioning. | No | (none) |

## Outputs

| Output | Description |
| -------- | ------------- |
| `bumped` | Indicates whether a version bump was performed (`true` or `false`). |
| `changed-modules` | A JSON array of modules that were changed and had their versions bumped. |
| `created-tags` | A JSON array of Git tags that were created during the versioning process. |
| `changelog-paths` | A JSON array of file paths where changelogs were generated or updated. |

## Examples

::: warning
This page is still under construction. Check back soon for the full example!
:::

## Troubleshooting

### Action Not Found

Make sure you're using the correct action name:

```yaml
uses: versuhq/versu@latest  # Correct
uses: versu@latest           # Wrong
```

### No Fetch Depth

Always include full history:

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # Important!
```

### Permission Issues

Ensure workflow has necessary permissions:

```yaml
permissions:
  contents: write
```

::: warning
This page is still under construction. Check back soon for the full example!
:::

## Next Steps

- [CLI Tool](/tools/cli) - Local versioning
- [Configuration](/guide/config/configuration-file) - Customize behavior

---

Questions? Check [GitHub Discussions](https://github.com/versuhq/versu/discussions) or open an [issue](https://github.com/versuhq/versu/issues).
