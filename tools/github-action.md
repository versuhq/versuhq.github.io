# GitHub Action

Versu GitHub Action automates versioning in your CI/CD pipeline.

## Basic Usage

Add to your GitHub Actions workflow:

```yaml
- uses: versuhq/versu@v0
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

### Basic Release Workflow

```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v6
        with:
          fetch-depth: 0  # Full history for commit analysis

      #### Setup Project Requiremnts ########

      # Add any additional setup steps here
      # such as installing dependencies or
      # configuring the environment.

      #######################################
      
      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 20

      # Install Plugin for your project type (e.g., Gradle, etc.)
      - name: Install Versu Gradle Plugin
        run: npm i -g @versu/plugin-gradle

      - name: Run Versu
        uses: versuhq/versu@v0

      # Note: The above step will automatically
      # create tags and push changes by default.

      # This will trigger create tags events on
      # GitHub, which can be used to trigger
      # additional workflows such as publishing
      # to a package registry, etc.
```

### Development Workflow

```yaml
name: Development

on:
  pull_request:
    branches:
      - develop

jobs:
  development:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v6
        with:
          # Full history for commit analysis
          fetch-depth: 0

      #### Setup Project Requiremnts ########

      # Add any additional setup steps here
      # such as installing dependencies or
      # configuring the environment.

      #######################################
      
      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 20

      # Install Plugin for your project type (e.g., Gradle, etc.)
      - name: Install Versu Gradle Plugin
        run: npm i -g @versu/plugin-gradle

      - name: Run Versu in Development Mode
        uses: versuhq/versu@v0
        with:
          bump-unchanged: true
          append-snapshot: true
          push-tags: false
          push-changes: false
          generate-changelog: false

      # Add any additional steps here, such as
      # building the project, running tests, etc.
```

## Troubleshooting

### Action Not Found

Make sure you're using the correct action name:

```yaml
uses: versuhq/versu@v0  # Correct
uses: versu@v0           # Wrong
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

## Next Steps

- [CLI Tool](/tools/cli) - Local versioning
- [Configuration](/guide/config/configuration-file) - Customize behavior

---

Questions? Check [GitHub Discussions](https://github.com/versuhq/versu/discussions) or open an [issue](https://github.com/versuhq/versu/issues).
