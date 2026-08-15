import { type DefaultTheme, type UserConfig, defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default async () => {
  // Fix: If running "vitepress build sites/blog", process.cwd() is the root,
  // but VitePress shifts its internal execution root to "sites/blog".
  // Therefore, srcDir should just be "." because VitePress is already inside "sites/blog".
  const srcDir = ".";

  // Keep your monorepo-root relative asset paths intact
  const iconsDir = "/icon";

  const userConfig: UserConfig<DefaultTheme.Config> = {
    title: "Franco's Blog",
    description: "Blog Site",
    lang: "en-US",
    lastUpdated: true,
    base: "/",
    dir: srcDir,
    srcDir: srcDir,
    cleanUrls: true,
    assetsDir: "assets",
    metaChunk: true,
    srcExclude: [
      "./README.md",
    ],
    appearance: {
      deep: true,
      initOnMounted: true,
      listenToStorageChanges: true,
      mergeDefaults: true,
      shallow: true,
      writeDefaults: true,
    },
    vite: {
      // base: "/",
      // Ensure Vite resolves correctly relative to your command execution
      // root: isNestedRun ? process.cwd() : `${process.cwd()}/sites/blog`,
      configFile: `${process.cwd()}/.config/vite/vite.config.ts`,
    },
    vue: {
      features: {
        customElement: false,
        prodHydrationMismatchDetails: true,
        propsDestructure: true,
      }
    },
    markdown: {
      breaks: true,
      lineNumbers: true,
      typographer: true,
      headers: true,
      image: {
        lazyLoading: true,
      },
      linkify: false,
      frontmatter: {
        renderExcerpt: true,
        grayMatterOptions: {
          eval: true,
          excerpt: true,
        }
      },
      html: true,
      toc: {
        shouldAllowNested: true,
      },
      theme: {
        light: "one-light",
        dark: "material-theme-ocean",
        semanticHighlighting: true,
      },
    },
    sitemap: {
      hostname: "https://blog.fnc314.dev",
      lastmodDateOnly: true,
    },
    head: [
      [
        "link",
        {
          rel: "icon",
          href: "./icon/favicon.ico"
        }
      ]
    ],
    themeConfig: {
      aside: false,
      sidebar: {},
      nav: [],
      siteTitle: false,
      footer: {
        message: `Franco N. Colaizzi - <a href="/posts">Blog Home</a>`,
        copyright: `<a href="https://www.fnc314.dev/">Portfolio Home</a>`,
      },
      editLink: undefined, // Disables this
      externalLinkIcon: true,
      lastUpdated: {
        text: "Updated on",
        formatOptions: {
          dateStyle: "full",
          timeStyle: "full",
          // timeZoneName: "longOffset",
          // day: "2-digit",
          // month: "2-digit",
          // year: "numeric",
          // hour: "2-digit",
          // minute: "2-digit",
          // second: "2-digit",
          // hour12: false,
          // dayPeriod: "long",
          // era: "long",
          // weekday: "long",
        },
      },
      lightModeSwitchTitle: "Switch to Light Mode",
      darkModeSwitchLabel: "Dark Mode",
      darkModeSwitchTitle: "Switch to Dark Mode",
      returnToTopLabel: "",
      logo: {
        src: `${iconsDir}/icon.svg`,
        dark: `${iconsDir}/icon-dark.svg`,
        light: `${iconsDir}/icon-light.svg`,
        alt: "Blog Site Logo",
      },
      logoLink: {
        link: "/",
        rel: "noopener noreferrer",
        target: "_self",
      },
      notFound: {
        linkLabel: "Return to https://blog.fnc314.dev",
        linkText: "Get Outta Here",
        quote: "This is not the page you're looking for...",
        title: "Not Found",
        code: "404",
      },
      outline: {
        level: "deep",
        label: "Outline"
      },
      search: undefined,
      socialLinks: [
        {
          icon: "github",
          link: "https://www.github.com/fnc314",
          ariaLabel: "Link to GitHub"
        },
        {
          icon: "linkedin",
          link: "https://www.linkedin.com/in/fnc314",
          ariaLabel: "Link to LinkedIn"
        },
        {
          icon: "medium",
          link: "https://fnc314.medium.com",
          ariaLabel: "Link to Medium"
        },
      ],
    }
  };

  const definedConfig = defineConfig(userConfig);

  console.log(
    JSON.stringify(
      {
        "process.cwd": process.cwd(),
        iconsDir,
        userConfig,
        definedConfig,
      },
      null,
      2
    )
  );

  return definedConfig;
};
