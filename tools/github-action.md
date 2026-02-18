# GitHub Action

Versu GitHub Action automates versioning in your CI/CD pipeline.

## Basic Usage

Add to your GitHub Actions workflow:

```yaml
- uses: versuhq/versu@latest
```

## Inputs

::: warning
This page is still under construction. Check back soon for the full example!
:::

## Outputs

::: warning
This page is still under construction. Check back soon for the full example!
:::

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
