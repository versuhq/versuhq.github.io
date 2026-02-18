# Introduction to Versu

Versu is an intelligent versioning automation tool designed for modern software development. Whether you're working on a monorepo with dozens of interdependent modules or a simple single-module project, Versu adapts to your workflow.

## What is Versu?

Versu automatically manages version numbers across your projects by:

1. **Analyzing commit history** using [Conventional Commits](https://conventionalcommits.org/)
2. **Determining semantic version bumps** (major, minor, patch)
3. **Managing dependency cascades** automatically
4. **Generating changelogs** per-module
5. **Supporting pre-release versions** (alpha, beta, rc, etc.)

## Key Capabilities

### 🔄 Automatic Version Bumping

Based on Conventional Commits, Versu automatically determines if you need a major, minor, or patch version bump:

- `feat:` = minor version bump
- `fix:` = patch version bump
- `BREAKING CHANGE:` in commit footer = major version bump
- `<type>!:` = major version bump (alternative syntax)
- Custom commit types and rules are also supported through configuration

### 📦 Multi-Module Support

Each module in your project can be versioned independently while maintaining consistency across your entire codebase.

### 📝 Changelog Generation

Automatically generate beautiful changelogs from your commit history. Customize the format to match your team's standards.

### 🔌 Extensible Architecture

Support any build system or language ecosystem through our plugin architecture. Built-in support for:

<!--- **npm** (JavaScript/TypeScript)-->
- **Gradle** (JVM languages)
<!--- **Maven** (Java)-->
- Custom ecosystems via plugins

### ⚡ Multiple Interfaces

Choose how to integrate Versu:

- **Library**: Use as a npm package in your custom tools
- **CLI**: Run versioning commands directly in your terminal
- **GitHub Action**: Automate versioning in your CI/CD pipeline

## How It Works

Versu follows a simple workflow:

```text
Your Project
    ↓
Analyze Commits (Conventional Commits)
    ↓
Determine Version Bumps
    ↓
Resolve Dependency Cascades
    ↓
Generate Changelogs
    ↓
Update Version Files
    ↓
Ready to Release!
```

## When to Use Versu

Versu is perfect for:

- **Monorepos** with multiple interdependent modules
- **Microservices** that need synchronized versions
- **Libraries** published to package registries
- **Enterprise projects** with complex versioning needs
- **Teams** that want consistent, automated versioning

## Core Concepts

Before diving deeper, let's understand some key concepts:

- **Conventional Commits**: A specification for adding human and machine readable meaning to commit messages
- **Semantic Versioning**: A versioning scheme (MAJOR.MINOR.PATCH)
- **Dependency Cascade**: When one module changes, dependent modules are automatically versioned
- **Pre-release**: Alpha, beta, or release candidate versions for testing

## What's Next?

- [Installation](/guide/installation) - Get Versu set up in your project
- [Quick Start](/guide/quick-start) - Run your first versioning cycle
- [Concepts](/guide/concepts/conventional-commits) - Deep dive into key concepts

---

Ready to get started? Head over to the [Installation guide](/guide/installation)!
