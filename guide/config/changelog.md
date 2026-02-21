# Changelog Generation

Learn how to customize Versu's changelog generation.

## Basic Configuration

Versu uses [conventional-changelog-writer] under the hood to generate changelogs based on your commit history. Changelog generation will pick up all commits since the last release and format them according to the rules defined in your configuration.

You can customize both the generation of the root changelog and the module changelogs (if you're using a monorepo setup) by providing specific configurations for each.

```javascript
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

<sup>1</sup> The `context` property allows you to provide additional information about the commits being processed. This can include details about the commit types, scopes, and any other relevant metadata that can be used to customize the changelog output.

<sup>2</sup> The `options` property allows you to specify various options for how the changelog is generated. This can include settings for how commit messages are formatted, how sections are organized, and any other customization options provided by the underlying changelog generation library.

## Grouping Commits

As an example lets imagine you want to group commits in your changelog by their type (e.g., features, bug fixes, etc.). You can achieve this by customizing the `context` and `options` properties in your `changelog` configuration.

```javascript
const commitGroupsSort = (a, b) => {
    const order = [
        "✨ Features",
        "🐛 Bug Fixes",
        "📝 Documentation",
        "⚡️ Performance",
        "♻️ Refactor",
        "🎨 Styling",
        "✅ Testing",
        "🤖 Build",
        "🔁 CI",
        "📦 Chores",
        "⏪ Revert",
        "❓ Other",
    ];
    return order.indexOf(a.title) - order.indexOf(b.title);
};

const transform = (commit, context) => {
    const typeMap = {
        feat: "✨ Features",
        fix: "🐛 Bug Fixes",
        doc: "📝 Documentation",
        perf: "⚡️ Performance",
        refactor: "♻️ Refactor",
        style: "🎨 Styling",
        test: "✅ Testing",
        build: "🤖 Build",
        ci: "🔁 CI",
        chore: "📦 Chores",
        revert: "⏪ Revert",
    };

    // 1. Create a shallow copy so we don't mutate the original
    const modifiedCommit = {...commit};

    // 2. Skip commits without a type
    if (!modifiedCommit.type) return null;

    // 3. Map the type
    modifiedCommit.type = typeMap[modifiedCommit.type] || "❓ Other";

    return modifiedCommit;
};

const options = {
    // How to group the commits (mapped in transform)
    groupBy: "type",
    // The order sections appear in the changelog
    commitGroupsSort,
    // Transform raw commit data into the new format
    transform,
};

export default {
  // Other configuration options
  changelog: {
    root: {
      options,
    },
    module: {
      options,
    },
  },
};
```

By default, Versu will generate a changelog that includes all commits since the last release.

::: warning
This page is still under construction. Check back soon for the full example!
:::

## Next Steps

- [Pre-release Versions](/guide/config/prerelease) - Pre-release setup
- [Configuration File](/guide/config/configuration-file) - Full config reference
- [Examples](/examples/basic-setup) - Real examples

---

Ready to set up pre-releases? Check out the [Pre-release Versions](/guide/config/prerelease) guide!

[conventional-changelog-writer]: https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer