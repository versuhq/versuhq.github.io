# Plugins

Versu's build-system support is delivered through adapter plugins. The core engine knows how to analyze commits and calculate versions; plugins teach it how to discover modules and write versions for a specific build system.

## Official Plugins

| Plugin | Adapter ID | Build System | Auto-detected when |
| ------ | ---------- | ------------ | ------------------ |
| [@versu/plugin-gradle](/tools/gradle-plugin) | `gradle` | Gradle (Groovy & Kotlin DSL) | Gradle build/settings files in the repository root |
| [@versu/plugin-maven](/tools/maven-plugin) | `maven` | Maven | `pom.xml` in the repository root |
| [@versu/plugin-node](/tools/node-plugin) | `node` | Node.js (npm, yarn, pnpm workspaces) | `package.json` in the repository root |

In addition, core ships a built-in **manual adapter** that requires no plugin - you describe your project structure yourself in a `project-information.json` file. See [Custom Adapters](/guide/advanced/adapters#the-manual-adapter).

## Installing Plugins

Plugins are regular npm packages. Install them next to whichever Versu interface you use:

::: code-group

```bash [With Core]
npm install @versu/core @versu/plugin-node
```

```bash [With CLI]
npm install -g @versu/cli @versu/plugin-node
```

:::

The CLI also provides [plugin management commands](/tools/cli#plugin-management):

```bash
versu plugin install @versu/plugin-node    # local
versu plugin install @versu/plugin-node -g # global
versu plugin list
versu plugin uninstall @versu/plugin-node
```

The [GitHub Action](/tools/github-action) ships only the core engine, so plugins need to be installed in the job before the action runs (e.g., `npm i -g @versu/plugin-gradle` as a workflow step) - locally in the checked-out workspace or globally, both are discovered.

## How Plugins Are Discovered

When Versu runs, plugins are loaded in one of two ways:

1. **Explicit list** - if your [configuration file](/guide/config/configuration-file#plugins-optional) declares a `plugins` array, only those packages are loaded:

   ```javascript
   export default {
     plugins: ["@versu/plugin-node"],
   };
   ```

2. **Auto-detection** - with no `plugins` configuration, Versu scans `node_modules` (local and global) for packages matching these name patterns:

   - `versu-plugin-*`
   - `@*/versu-plugin-*`
   - `@versu/plugin-*`

::: tip
Explicitly listing plugins is recommended for performance and reliability - it avoids scanning and guarantees the right plugins are loaded.
:::

## How the Adapter Is Chosen

Each plugin contributes one or more adapters. At startup, Versu asks each adapter whether it can handle the repository (each adapter checks for its build-system-specific files):

- If you pass `--adapter <id>` (or the `adapter` runner option), auto-detection is skipped and that adapter is used directly.
- Otherwise the first adapter that accepts the project wins. The manual adapter has the lowest precedence, so it only applies when a `project-information.json` file exists and no other adapter matched.

## Writing Your Own Plugin

Any npm package following the naming patterns above and default-exporting a `PluginContract` works as a Versu plugin. See:

- [Plugin Development](/guide/advanced/plugins) - Package structure, contract and publishing
- [Custom Adapters](/guide/advanced/adapters) - Implementing the adapter interfaces

## Next Steps

- [Gradle Plugin](/tools/gradle-plugin) - Detailed Gradle adapter documentation
- [CLI](/tools/cli) - Plugin management commands
- [Configuration File](/guide/config/configuration-file) - The `plugins` option

---

Need help? Check the [FAQ](/examples/faq) or open an [issue](https://github.com/versuhq/versu/issues).
