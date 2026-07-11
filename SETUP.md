# VitePress Documentation Setup

This folder contains a complete VitePress documentation site for Versu.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run docs:dev
```

Open your browser to `http://localhost:5173` to see the documentation.

### 3. Build for Production

```bash
npm run docs:build
```

Output files will be in `dist/` folder.

### 4. Preview Production Build

```bash
npm run docs:preview
```

## Folder Structure

```text
versuhq.github.io/
├── .vitepress/
│   ├── config.mts          # VitePress configuration
│   └── theme/
│       ├── index.ts        # Theme setup
│       └── style.css       # Custom styles
├── index.md                # Home page
├── faq.md
├── guide/
│   ├── introduction.md
│   ├── installation.md
│   ├── quick-start.md
│   ├── concepts/
│   │   ├── conventional-commits.md
│   │   ├── semantic-versioning.md
│   │   ├── multi-module.md
│   │   └── dependency-cascade.md
│   ├── config/
│   │   ├── configuration-file.md
│   │   ├── changelog.md
│   │   └── prerelease.md
│   └── advanced/
│       ├── plugins.md
│       ├── adapters.md
│       └── monorepo.md
├── tools/
│   ├── cli.md
│   ├── github-action.md
│   ├── plugins.md
│   ├── gradle-plugin.md
│   ├── maven-plugin.md
│   └── node-plugin.md
├── api/
│   ├── core.md
│   ├── services.md
│   ├── utilities.md
│   └── types.md
├── examples/
│   ├── basic-setup.md
│   ├── monorepo-setup.md
│   └── quick-reference.md
├── package.json
├── .gitignore
└── README.md
```

## Customization

### Colors & Branding

Edit `.vitepress/theme/style.css` to customize colors:

```css
:root {
  --vp-c-brand: #your-color;
  --vp-c-brand-light: #your-light-color;
}
```

### Navigation

Edit `.vitepress/config.mts` to customize:

- Navigation bar
- Sidebar structure
- Social links
- Footer

### Content

- Markdown files in root, `guide/`, `tools/`, `api/`, `examples/`
- Follow the same structure for organization
- Add new folders for new sections

## Building & Deployment

### Build Static Site

```bash
npm run docs:build
```

Creates `dist/` folder with static HTML files.

### Deploy to GitHub Pages

```bash
# Build
npm run docs:build

# Push dist/ to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

## Development Tips

### Hot Module Reload

Changes to `.md` files automatically refresh in browser.

### Adding New Pages

1. Create `.md` file in appropriate folder
2. Add to navigation in `.vitepress/config.mts`
3. Use frontmatter for metadata:

```markdown
---
title: Page Title
description: Page description
---

# Page Title

Content here...
```

### Creating Internal Links

```markdown
[Link text](/guide/introduction)
[Link text](/api/core#section)
```

### Code Blocks with Syntax Highlighting

````markdown
```typescript
const hello: string = "world"
```

```bash
npm install @versu/cli
```

```javascript
export default {
  // config
}
```
````

### Callouts

```markdown
:::tip
This is a tip
:::

:::info
This is info
:::

:::warning
This is a warning
:::

:::danger
This is dangerous
:::
```

## SEO & Meta

Configure in `.vitepress/config.mts`:

```typescript
export default defineConfig({
  title: 'Versu',
  description: 'Your description',
  head: [
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:image', content: 'image-url' }]
  ]
})
```

## Search

VitePress includes local search by default. Users can search from the search box in the navigation.

## Performance

- Static generation is fast
- Built-in optimizations for images
- No database required
- Can be hosted on any static host

## Troubleshooting

### Page Not Showing

1. Check file exists in correct location
2. Verify entry in `config.mts` navigation/sidebar
3. Restart dev server: `npm run docs:dev`

### Build Fails

```bash
# Clear cache
rm -rf .vitepress/cache dist

# Reinstall
npm install

# Rebuild
npm run docs:build
```

### Broken Links

Run tests with:

```bash
# Check for broken markdown links
npm run docs:build -- --debug
```

## Next Steps

1. Customize colors in `.vitepress/theme/style.css`
2. Add your logo/images
3. Update navigation in `.vitepress/config.mts`
4. Add additional guide pages
5. Deploy to your preferred host

## Resources

- [VitePress Documentation](https://vitepress.dev/)
- [Markdown Guide](https://vitepress.dev/guide/markdown)
- [Vue Components](https://vitepress.dev/guide/using-vue)

---

Happy documenting! 📚
