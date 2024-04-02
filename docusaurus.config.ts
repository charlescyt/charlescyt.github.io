import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'Charles\'s Blog',
  tagline: 'I dart, I flutter, I wonder.',
  favicon: 'img/favicon.ico',
  url: 'https://charlescyt.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'charlescyt',
  projectName: 'charlescyt.github.io',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          path: 'blog',
          routeBasePath: '/',
          blogSidebarTitle: 'Recent Posts',
          blogSidebarCount: 5,
          showReadingTime: true,
          readingTime: ({ content, frontMatter, defaultReadingTime }) =>
            defaultReadingTime({ content, options: { wordsPerMinute: 300 } }),
          blogListComponent: '@theme/BlogListPage',
          blogPostComponent: '@theme/BlogPostPage',
          blogTagsListComponent: '@theme/BlogTagsListPage',
          blogTagsPostsComponent: '@theme/BlogTagsPostsPage',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: 'img/social-card.webp',
    colorMode: {
      defaultMode: "dark",
    },
    announcementBar: {
      id: 'announcement-bar-01',
      content: 'New blog post released: <a href="/dart-static-analysis-and-lint-rules">Dart static analysis and lint rules</a>',
      backgroundColor: '#d4081c',
      textColor: '#FFF',
    },
    navbar: {
      logo: {
        alt: 'Logo',
        src: 'img/logo.webp',
      },
      items: [
      ],
    },
    footer: {
      style: 'light',
      logo: {
        alt: "Logo",
        href: "/",
        src: "img/logo.webp",
        height: 50,
        width: 50,
      },
      links: [
        {
          label: 'GitHub',
          href: 'https://github.com/charlescyt',
        },
        {
          label: 'Twitter',
          href: 'https://twitter.com/_charlescyt',
        },
        {
          label: 'Stack Overflow',
          href: 'https://stackoverflow.com/users/22174275/charles',
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Charles Tsang.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: [
        'bash',
        'dart',
        'java',
        'json',
      ],
    },
  } satisfies Preset.ThemeConfig,
  plugins: [
  ],
};

export default config;
