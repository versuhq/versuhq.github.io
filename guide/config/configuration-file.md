# Configuration File

Learn how to configure Versu for your project.

## Basic Structure

Versu uses cosmiconfig to load configuration from various file formats. It supports several file types, including Typescript and JavaScript files. The configuration file should export an object with the following structure:

::: code-group

```typescript [versu.config.ts]
import type { VersuConfig } from "@versu/core";

const config: VersuConfig = {
  // Your configuration options here
};

export default config;
```

:::

## Configuration Options

### `plugins` (optional)

An array of plugins to use. Each plugin can be specified as a string (the package name).

Versu can work with zero configuration by automatically searching for installed plugins.

However, for performance and reliability reasons, it's recommended to explicitly specify the plugins you want to use in your configuration file. This helps avoid issues with plugin discovery and ensures that Versu loads the correct plugins for your project.

::: code-group

```javascript [versu.config.js]
export default {
  plugins: [
    "@versu/plugin-gradle",
    //... other plugins
  ],
  // Other configuration options
};
```

:::

### `versionRules` (optional)

Defines how version bumps are determined based on commit types and dependency updates. This configuration allows you to specify the default bump level for commits and customize it for specific commit types and dependency updates.

::: code-group

```javascript [versu.config.js]
export default {
  // Other configuration options
  versionRules: {
    defaultBump: "patch", // major, minor, patch, or none
    commitTypeBumps: {
      feat: "minor", // major, minor, patch, or ignore
      fix: "patch",
      perf: "patch",
      refactor: "patch",
      docs: "ignore",
      test: "ignore",
      chore: "ignore",
      style: "ignore",
      ci: "ignore",
      build: "ignore",
      //... other custom commit types
    },
    dependencyBumps: {
      major: "major", // major, minor, patch or none
      minor: "minor",
      patch: "patch",
    },
  },
};
```

:::

### `changelog` (optional)

The `changelog` configuration allows you to customize how changelogs are generated. You can specify different configurations for the root project and for individual modules if you're working in a monorepo setup.

Versu uses [conventional-changelog-writer] under the hood, so the options you provide here will be passed to the underlying changelog generation process. This allows you to customize the output of your changelogs based on your specific needs.

::: code-group

```javascript [versu.config.js]
export default {
  // Other configuration options
  changelog: {
    // Changelog configuration options
    root: {
      // Root changelog configuration (optional)
      context: { /* */ }, // Context<Commit> (1)
      options: { /* */ }, // Options<Commit> (2)
    },
    module: {
      // Module changelog configuration (optional)
      context: { /* */ }, // Context<Commit> (1)
      options: { /* */ }, // Options<Commit> (2)
    },
  },
};
```

:::

<sup>1</sup> The `context` property allows you to provide additional information about the commits being processed. This can include details about the commit types, scopes, and any other relevant metadata that can be used to customize the changelog output.

<sup>2</sup> The `options` property allows you to specify various options for how the changelog is generated. This can include settings for how commit messages are formatted, how sections are organized, and any other customization options provided by the underlying changelog generation library.

For more details on chengelog configuration check out the [changelog configuration guide](/guide/config/changelog) and the [conventional-changelog-writer documentation][conventional-changelog-writer].

## Alternative Formats

### ES Module

::: code-group

```javascript [versu.config.js]
export default {
  plugins: [ /* ... */ ],
  versionRules: { /* ... */ },
  changelog: { /* ... */ },
};
```

:::

### CommonJS

::: code-group

```javascript [versu.config.cjs]
module.exports = {
  plugins: [ /* ... */ ],
  versionRules: { /* ... */ },
  changelog: { /* ... */ },
};
```

:::

### TypeScript (with type checking)

::: code-group

```typescript [versu.config.ts]
import type { VersuConfig } from "@versu/core";

export default {
  plugins: [ /* ... */ ],
  versionRules: { /* ... */ },
  changelog: { /* ... */ },
} satisfies VersuConfig;
```

:::

## Next Steps

- [Changelog Generation](/guide/config/changelog) - Customize changelogs
- [Pre-release Versions](/guide/config/prerelease) - Pre-release setup
- [Examples](/examples/basic-setup) - Real configuration examples

---

Ready to customize your changelog? Check out the [Changelog Generation Guide](/guide/config/changelog)!

[conventional-changelog-writer]: https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer
