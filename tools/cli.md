# CLI Tool

Versu CLI provides a command-line interface for versioning your projects and managing its plugins.

For general help and usage information, you can run:

```bash
versu --help
```

The CLI supports two main commands detailed in the sections below:

- `run` for running the versioning process
- `plugin` for managing plugins

## Basic Usage

```bash
versu run [path] [options]
```

- `path` (optional): The path to the project you want to version. If not specified, it defaults to the current working directory.

- `options`: Various command-line options to customize the versioning process (see below).

Running versioning for your project with the default settings is as simple as:

```bash
versu
```

This will:

- Analyze commits
- Calculate version bumps
- Update files
- Generate changelogs
- Create Git tags and push changes

### Run Options

#### `--help` (run)

Display help information about the run command and its options.

```bash
versu run --help
```

#### `--version`

Display the version of the CLI.

```bash
versu --version
```

#### `--adapter <adapter>`

Specify a custom adapter for versioning, disabling automatic adapter detection.

```bash
versu run --adapter custom-adapter
```

::: warning

Using a custom adapter will disable automatic detection of the appropriate adapter for your project. Make sure you have the correct adapter plugin installed and specified to avoid issues with versioning. Also, ensure that the custom adapter you specify is compatible with your project's structure and versioning requirements.

:::

#### `--add-build-metadata`

Add SHA build metadata to the generated version. This is useful for tracking the specific commit associated with a version, especially in CI/CD pipelines.

```bash
versu run --add-build-metadata
```

#### `--append-snapshot`

Append `-SNAPSHOT` to the generated version. This is commonly used to indicate that the version is a pre-release or in development.

```bash
versu run --append-snapshot
```

::: warning

This is only applicable is your project supports snapshot versions. Make sure to check your project's versioning scheme and compatibility with snapshot versions before using this option.

:::

#### `--bump-unchanged`

Bump the version even if there are no changes detected. This can be useful in scenarios where you want to force a version bump regardless of commit history.

```bash
versu run --bump-unchanged
```

#### `--changelog-filename <filename>`

Set the filename for generated changelogs (default: `CHANGELOG.md`).

```bash
versu run --changelog-filename HISTORY.md
```

#### `--commit-release-notes`

Include the generated release notes in the commit when pushing changes. By default release notes are generated but left out of the commit.

```bash
versu run --commit-release-notes
```

#### `--create-tags`

Automatically create Git tags for the new version. This is useful if you are releasing your project and want to have a tagged release in your Git history.

```bash
versu run --create-tags
```

You can disable tag creation by using the `--no-create-tags` option:

```bash
versu run --no-create-tags
```

#### `--dry-run`

Run the versioning process without making any changes to files or Git history. This allows you to see what changes would be made without actually applying them.

```bash
versu run --dry-run
```

#### `--from-ref <ref>`

Analyze commits starting from the given git reference (e.g., a tag or commit SHA) instead of each module's last release tag.

```bash
versu run --from-ref v1.0.0
```

#### `--generate-changelog`

Generate a changelog based on the commits since the last version. This is useful for keeping a record of changes in your project and communicating them to users.

```bash
versu run --generate-changelog
```

You can disable changelog generation by using the `--no-generate-changelog` option:

```bash
versu run --no-generate-changelog
```

#### `--generate-release-notes`

Generate release notes summarizing all changes (default: enabled, written to `RELEASE.md`).

```bash
versu run --generate-release-notes
```

You can disable release notes generation by using the `--no-generate-release-notes` option:

```bash
versu run --no-generate-release-notes
```

#### `--prerelease-mode`

Enable prerelease mode, which allows you to generate pre-release versions (e.g., `1.0.0-alpha.1`). This is useful for testing and development purposes before a stable release.

```bash
versu run --prerelease-mode
```

::: info

The default prerelease identifier is `alpha`, but you can customize it with the `--prerelease-id` option.

:::

#### `--prerelease-id <identifier>`

Specify a custom prerelease identifier to use when generating pre-release versions. This allows you to differentiate between different types of pre-releases (e.g., `alpha`, `beta`, `rc`).

```bash
versu run --prerelease-mode --prerelease-id beta
```

#### `--provider <provider>`

Set the version control provider (e.g., `github`, `gitlab`), used for provider-specific features like issue links in changelogs. Auto-detected from the remote URL if not provided.

```bash
versu run --provider github
```

#### `--push-changes`

Automatically push changes to the remote repository after versioning. This is useful in CI/CD pipelines where you want to automate the entire release process, including pushing changes to the remote repository.

```bash
versu run --push-changes
```

You can disable pushing changes by using the `--no-push-changes` option:

```bash
versu run --no-push-changes
```

#### `--release-notes-filename <filename>`

Set the filename for generated release notes (default: `RELEASE.md`).

```bash
versu run --release-notes-filename NOTES.md
```

#### `--sequential-tag-push`

Push tags one at a time instead of all at once. Useful for large repositories or CI environments where each tag push should trigger its own workflow.

```bash
versu run --sequential-tag-push
```

#### `--strip-module-prefix`

Strip the module name from tags when the project has a single module, producing tags like `1.2.3` (or `v1.2.3` with a prefix) instead of `mymodule@1.2.3`.

```bash
versu run --strip-module-prefix
```

#### `--tag-version-prefix <prefix>`

Add a prefix to the version part of tags (e.g., `v` produces `mymodule@v1.2.3`). Default: empty.

```bash
versu run --tag-version-prefix v
```

#### `--timestamp-versions`

Append a timestamp to the generated version. This can be useful for creating unique versions in scenarios where you want to avoid version conflicts or need to track when a version was generated.

This setting requires `--prerelease-mode` to be enabled, as it is typically used in conjunction with pre-release versions.

```bash
versu run --timestamp-versions
```

## Plugin Management

Versu CLI also provides commands for managing plugins, allowing you to extend the functionality of the versioning process with custom adapters.

```bash
versu plugin [command] [options]
```

### `--help` (plugin)

Display help information about the plugin command and its options.

```bash
versu plugin --help
```

### `list`

List all installed plugins.

```bash
versu plugin list
```

### `install`

```bash
versu plugin install [plugin-name] (-g | --global)
```

- `plugin-name`: The name of the plugin to install. This should be the package name of the plugin, which can be found on npm or in the plugin registry.
- `-g`, `--global`: (Optional) Install the plugin globally. If not specified, the plugin will be installed locally in the current project.

```bash
versu plugin install @versu/plugin-gradle # Install locally

versu plugin install @versu/plugin-gradle -g # Install globally
```

### `uninstall`

```bash
versu plugin uninstall [plugin-name] (-g | --global)
```

- `plugin-name`: The name of the plugin to uninstall. This should be the package name of the plugin, which can be found on npm or in the plugin registry.
- `-g`, `--global`: (Optional) Uninstall the plugin globally. If not specified, the plugin will be uninstalled locally in the current project.

```bash
versu plugin uninstall @versu/plugin-gradle # Uninstall locally

versu plugin uninstall @versu/plugin-gradle -g # Uninstall globally
```

## Next Steps

- [GitHub Action](/tools/github-action) - Automate in CI/CD
- [Configuration](/guide/config/configuration-file) - Custom setup
- [Quick Start](/guide/quick-start) - Get started quickly

---

Need help? Check the [FAQ](/examples/faq) or open an [issue](https://github.com/versuhq/versu/issues).
