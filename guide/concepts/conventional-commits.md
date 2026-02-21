# Conventional Commits

Conventional Commits is a specification for adding human and machine-readable meaning to commit messages. Versu relies on this standard to automatically determine version bumps.

## Commit Format

The basic format of a Conventional Commit is:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types

The standard types and their default version impacts are:

| Type | Meaning | Default Version Impact |
| ------ | --------- | ----------------- |
| `feat` | A new feature | Minor bump |
| `fix` | A bug fix | Patch bump |
| `docs` | Documentation only | No bump |
| `style` | Changes that don't affect code meaning (whitespace, formatting) | No bump |
| `refactor` | Code change that doesn't fix a bug or add a feature | Patch bump |
| `perf` | Code change that improves performance | Patch bump |
| `test` | Adding or updating tests | No bump |
| `chore` | Changes to build process, dependencies, etc. | No bump |
| `ci` | Changes to CI configuration | No bump |
| `build` | Changes that affect the build system | No bump |

Custom types are also allowed and will default to a patch bump unless configured otherwise.

::: tip

You can customize the types and their version impacts in your `versu.config.js` if you want to treat them differently.

:::

## Breaking Changes

A breaking change is indicated by adding `BREAKING CHANGE:` in the footer or by adding an exclamation mark `!` after the type/scope.

### Example with Footer

```text
feat: send email notification to user

BREAKING CHANGE: The email notification API has changed
```

### Example with Exclamation Mark

```text
feat!: redesign authentication system
```

**Both trigger a MAJOR version bump.**

## Scope

The scope is optional and specifies what part of the codebase is affected:

```text
feat(auth): add login endpoint
```

Common scopes might be: `auth`, `api`, `cli`, `core`, etc.

## Examples

### Feature Example

```text
feat(auth): add OAuth2 support

Implement OAuth2 authentication with GitHub and Google providers.
Closes #123
```

<!-- markdownlint-disable-next-line MD036 -->
**Result: Minor version bump**

### Bug Fix Example

```text
fix(api): handle null pointer exception

The API was throwing a null pointer exception when processing
empty request bodies.
```

<!-- markdownlint-disable-next-line MD036 -->
**Result: Patch version bump**

### Breaking Change Example

```text
feat(api)!: change response format from XML to JSON

The API response format has changed from XML to JSON.
All clients must update their parsers.

BREAKING CHANGE: Response format is now JSON instead of XML
```

<!-- markdownlint-disable-next-line MD036 -->
**Result: Major version bump**

### Documentation Example

```text
docs: update README with installation instructions
```

<!-- markdownlint-disable-next-line MD036 -->
**Result: No version bump**

## Best Practices

### ✅ Do's

- Use lowercase for type and scope
- Be descriptive and concise
- Include issue references when applicable
- Use imperative mood ("add feature" not "added feature")
- Keep the subject line under 50 characters

### ❌ Don'ts

- Use vague descriptions like "update stuff"
- Mix multiple unrelated changes in one commit
- Use all caps for types
- Include irrelevant information

## Examples of Good Commits

```text
feat: add user authentication module

fix(database): handle connection timeout

docs(contributing): add development setup guide

refactor(core): extract validation logic to separate module

feat(cli)!: change command structure
BREAKING CHANGE: Command syntax has changed from 'npx @versu/cli run' to 'npx @versu/cli'
```

## Versu Integration

Versu reads your commit history and:

1. **Identifies commit types** (feat, fix, etc.)
2. **Detects breaking changes** (BREAKING CHANGE footer or `!`)
3. **Calculates version bumps** based on the types found
4. **Generates changelogs** with commit messages organized by type

## Configuration

You can customize how Versu interprets commit types and their impacts on versioning in your `versu.config.js`.

From defining which types trigger which version bumps to specifying how dependency updates should be handled, you have full control over the versioning strategy.

::: code-group

```javascript [versu.config.js]
export default {
  versionRules: {
    defaultBump: 'patch',
    commitTypeBumps: {
      feat: 'minor',
      fix: 'patch',
      perf: 'patch',
      refactor: 'patch',
      docs: 'none',
      style: 'none',
      test: 'none',
      chore: 'none',
      ci: 'none',
      build: 'none'
    },
    dependencyBumps: {
      major: 'major',
      minor: 'minor',
      patch: 'patch'
    }
  }
}
```

:::

## Further Reading

- [Official Conventional Commits Spec](https://www.conventionalcommits.org/)
- [Semantic Versioning](/guide/concepts/semantic-versioning)
- [Configuration Guide](/guide/config/configuration-file)

---

Ready to use Conventional Commits in your project? Check out the [Quick Start](/guide/quick-start) guide!
