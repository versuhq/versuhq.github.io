import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: 'versu',
  description: 'Intelligent Versioning Automation - Compose the epic of your code, one release at a time.',
  lang: 'en-US',
  
  head: [
    ['meta', { name: 'theme-color', content: '#3c3c3d' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
  ],

  lastUpdated: true,

  themeConfig: {
    logo: '/versu-logo.svg',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'API', link: '/api/core' },
      {
        text: 'Tools',
        items: [
          { text: 'CLI', link: '/tools/cli' },
          { text: 'GitHub Action', link: '/tools/github-action' },
          //{ text: 'Plugins', link: '/tools/plugins' },
        ]
      },
      { text: 'Examples', link: '/examples/basic-setup' },
      {
        text: 'Resources',
        items: [
          { text: 'GitHub', link: 'https://github.com/versuhq/versu' },
          { text: 'NPM', link: 'https://www.npmjs.com/package/@versu/core' },
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Conventional Commits', link: '/guide/concepts/conventional-commits' },
            { text: 'Semantic Versioning', link: '/guide/concepts/semantic-versioning' },
            { text: 'Multi-Module Projects', link: '/guide/concepts/multi-module' },
            { text: 'Dependency Cascade', link: '/guide/concepts/dependency-cascade' },
          ]
        },
        {
          text: 'Configuration',
          items: [
            { text: 'Configuration File', link: '/guide/config/configuration-file' },
            { text: 'Changelog Generation', link: '/guide/config/changelog' },
            { text: 'Pre-release Versions', link: '/guide/config/prerelease' },
          ]
        },
        /*{
          text: 'Advanced',
          items: [
            { text: 'Plugin Development', link: '/guide/advanced/plugins' },
            { text: 'Custom Adapters', link: '/guide/advanced/adapters' },
            { text: 'Monorepo Setup', link: '/guide/advanced/monorepo' },
          ]
        },*/
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Core Package', link: '/api/core' },
            { text: 'Services', link: '/api/services' },
            { text: 'Utilities', link: '/api/utilities' },
            { text: 'Types', link: '/api/types' },
          ]
        }
      ],
      '/tools/': [
        {
          text: 'Tools',
          items: [
            { text: 'CLI', link: '/tools/cli' },
            { text: 'GitHub Action', link: '/tools/github-action' },
            { text: 'Plugins', link: '/tools/plugins' },
            { text: 'Gradle Plugin', link: '/tools/gradle-plugin' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/versuhq/versu' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Tiago Santos'
    },

    editLink: {
      pattern: 'https://github.com/versuhq/versu/edit/main/docs-vitepress/:path',
      text: 'Edit this page on GitHub'
    },

    search: {
      provider: 'local'
    }
  }
})
