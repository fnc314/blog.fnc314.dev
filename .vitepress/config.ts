import { type DefaultTheme, type UserConfig, defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default async () => {
  // Determine if VitePress is running from monorepo root or nested app root
  const isNestedRun = process.cwd().endsWith("blog");

  // Fix: If running "vitepress build sites/blog", process.cwd() is the root,
  // but VitePress shifts its internal execution root to "sites/blog".
  // Therefore, srcDir should just be "." because VitePress is already inside "sites/blog".
  const srcDir = ".";

  // Keep your monorepo-root relative asset paths intact
  const iconsDir = "public/icon";

  const userConfig: UserConfig<DefaultTheme.Config> = {
    title: "Franco's Blog",
    description: "Blog Site",
    lang: "en-US",
    lastUpdated: true,
    base: "/",
    dir: srcDir,
    srcDir: srcDir,
    cleanUrls: true,
    assetsDir: "public",
    metaChunk: true,
    // scrollOffset: {
    //   selector: "figure",
    //   padding: 0,
    // },
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
      configFile: ".config/vite/vite.config.ts",
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
    themeConfig: {
      aside: false,
      sidebar: {},
      nav: [],
      siteTitle: false,
      footer: {
        copyright: `All Rights Reserved`,
        message: `Franco N. Colaizzi - <a href="/">Home</a>`,
      },
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
        // src: `./../../public/icon/icon.svg`,
        dark: "/public/icon/icon-dark.svg",
        light: "/public/icon/icon-light.svg",
        alt: "Blog Site Logo",
      },
      logoLink: {
        link: "/",
        rel: "noopener noreferrer",
        // target: "_blank",
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
      search: {
        provider: "local",
        options: {
          disableQueryPersistence: true,
          miniSearch: {
            searchOptions: {
              weights: {
                fuzzy: 0.5,
                prefix: 0.5,
              },
            },
          }
        }
      },
      socialLinks: [
        {
          icon: {
            svg: "./public/icon/icon.svg",
          },
          link: "/",
          ariaLabel: "Link to Portfolio Site"
        },
        {
          icon: {
            svg: `${iconsDir}/github/github-mask.svg`
          },
          link: "https://www.github.com/fnc314",
          ariaLabel: "Link to GitHub"
        },
        {
          icon: {
            svg: `${iconsDir}/linkedin/linkedin-mask.svg`
          },
          link: "https://www.linkedin.com/in/fnc314",
          ariaLabel: "Link to LinkedIn"
        },
        {
          icon: {
            svg: `${iconsDir}/medium/medium-mask.svg`
          },
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
        isNestedRun,
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
