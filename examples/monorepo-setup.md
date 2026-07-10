# Monorepo Setup Example

A complete example of setting up Versu for a monorepo with multiple interdependent modules.

## Project Structure

```text
my-monorepo/
├── packages/
│   ├── common/
│   │   ├── src/
│   │   ├── package.json
│   │   └── CHANGELOG.md
│   ├── core/
│   │   ├── src/
│   │   ├── package.json
│   │   └── CHANGELOG.md
│   ├── cli/
│   │   ├── src/
│   │   ├── package.json
│   │   └── CHANGELOG.md
│   ├── auth/
│   │   ├── src/
│   │   ├── package.json
│   │   └── CHANGELOG.md
│   └── web/
│       ├── src/
│       ├── package.json
│       └── CHANGELOG.md
├── versu.config.js
├── package.json
└── README.md
```

## Dependency Graph

```text
    common
    /    \
   /      \
 core    auth
  |    /   |
  |   /    |
  |  /     |
 cli      web
```

## Configuration

Declare the workspace members in the root `package.json` - the Node adapter derives the modules and the dependency graph from it:

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["packages/*"]
}
```

The dependency graph shown above comes from regular dependency declarations between packages, e.g. in `packages/core/package.json`:

```json
{
  "name": "@my-org/core",
  "version": "1.0.0",
  "dependencies": {
    "@my-org/common": "^1.0.0"
  }
}
```

Then configure Versu itself:

```javascript
// versu.config.js
export default {
  plugins: ["@versu/plugin-node"],
  versioning: {
    cascadeRules: {
      // A dependency bump cascades to dependents as a patch bump
      stable: {
        major: "major",
        minor: "patch",
        patch: "patch",
      },
    },
  },
};
```

## Step-by-Step Setup

### 1. Install Versu

```bash
npm install -D @versu/cli @versu/plugin-node
```

### 2. Create Configuration

```bash
touch versu.config.js
# Copy the configuration above
```

### 3. Preview with a Dry Run

```bash
npx versu run --dry-run
```

Check the log output: module discovery should list all workspace packages (`:`, `:packages:common`, `:packages:core`, ...), and the calculated bumps should reflect your commits and the cascade rules.

### 4. Release

```bash
npx versu run
```

For a `feat` commit touching `packages/common`, one run will:

1. Bump `common` with a minor bump (e.g., `1.0.0` → `1.1.0`)
2. Cascade a patch bump to its dependents `core` and `auth` - and transitively to `cli` and `web`
3. Update every affected `package.json`, including internal dependency ranges (`^1.0.0` → `^1.1.0`)
4. Write a `CHANGELOG.md` per changed module plus the root changelog
5. Commit, tag each changed module (`@my-org/common@1.1.0`, `@my-org/core@1.0.1`, ...) and push

::: tip
Commits are attributed to modules by path: a commit that only touches `packages/common` bumps only `common` (plus its cascade). Keep commits scoped to one package when you can.
:::

## Next Steps

- [GitHub Actions](/tools/github-action) - Full automation
- [Advanced Configuration](/guide/config/configuration-file) - More options
- [Dependency Cascade](/guide/concepts/dependency-cascade) - Deep dive

---

Ready to automate everything? Check out the [GitHub Actions Guide](/tools/github-action)!
