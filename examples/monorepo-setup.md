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

::: warning
This page is still under construction. Check back soon for the full example!
:::

## Step-by-Step Setup

### 1. Install VERSU

```bash
npm install -D versu
```

### 2. Create Configuration

```bash
touch versu.config.js
# Copy the configuration above
```

::: warning
This page is still under construction. Check back soon for the full example!
:::

## Next Steps

- [GitHub Actions](/tools/github-action) - Full automation
- [Advanced Configuration](/guide/config/configuration-file) - More options
- [Dependency Cascade](/guide/concepts/dependency-cascade) - Deep dive

---

Ready to automate everything? Check out the [GitHub Actions Guide](/tools/github-action)!
