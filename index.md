---
layout: home

hero:
  name: "versu"
  text: "Intelligent Versioning Automation"
  tagline: Compose the epic of your code, one release at a time
  image:
    src: /versu-logo.png
    alt: versu
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: View on GitHub
      link: https://github.com/versuhq/versu

features:
  - icon: 🔄
    title: Automatic Version Bumping
    details: Analyze commit history using Conventional Commits and automatically determine semantic version bumps without manual intervention.
    
  - icon: 📦
    title: Multi-Module Support
    details: Each module can be versioned independently with automatic dependency cascade management across your entire project.
    
  - icon: 📝
    title: Changelog Generation
    details: Generate beautiful, customizable changelogs per-module directly from your commit history.
    
  - icon: 🔌
    title: Extensible Plugin Architecture
    details: Support for Gradle, npm, Maven, and any ecosystem through our extensible plugin system.
    
  - icon: ⚡
    title: Multiple Interfaces
    details: Use as a library in your code, as a CLI tool, or as a GitHub Action in your CI/CD pipeline.
    
  - icon: 🎯
    title: Pre-release Support
    details: Seamlessly generate alpha, beta, rc, or custom pre-release versions for testing and staging.

---

## Why versu?

<!--<div class="vp-doc">-->

### The Problem

Managing versions in multi-module projects is painful:

- **Manual versioning is error-prone** - Developers forget to bump versions or choose the wrong increment
- **Dependencies are a nightmare** - When module A changes, which dependents need bumping?
- **Inconsistent practices** - Different team members have different versioning philosophies
- **Changelog chaos** - Manually maintained changelogs become outdated or incomplete
- **CI/CD complexity** - Building robust versioning automation from scratch is time-consuming

### The Solution

Versu automates the entire versioning lifecycle:

- **Zero manual decisions** - Your commit messages dictate version bumps automatically
- **Smart dependency tracking** - When a module changes, Versu automatically identifies and versions all dependents
- **Team consistency** - Everyone follows the same Conventional Commits standard
- **Generated changelogs** - Beautiful, accurate changelogs generated per-module from commit history
- **Pre-release support** - Seamlessly generate alpha, beta, rc, or custom pre-release versions
- **Ecosystem agnostic** - Works with Gradle, npm, Maven, or any ecosystem through custom plugins

<!--</div>-->

## Quick Example

```bash
# Install versu CLI
npm install -g @versu/cli

# Install a versu plugin for your ecosystem (e.g. Gradle)
npm install -g @versu/plugin-gradle

# Run versioning in your project
versu run

# That's it! versu will:
# ✓ Analyze your commits
# ✓ Bump versions automatically
# ✓ Update all dependencies
# ✓ Generate changelogs
# ✓ Ready to release!
```

## Used By

Versu is trusted by teams working with:

- **Monorepos** - Manage versions across dozens of modules
- **Microservices** - Keep services aligned and properly versioned
- **Libraries** - Publish multiple packages with synchronized versions
- **Enterprise Projects** - Scale versioning across large organizations

## Community

- **GitHub**: [versuhq/versu](https://github.com/versuhq/versu)
- **NPM**: [@versu/core](https://www.npmjs.com/package/@versu/core)
- **Issues**: Report bugs and request features on [GitHub Issues](https://github.com/versuhq/versu/issues)

---

Ready to automate your versioning? [Get started now →](/guide/introduction)
