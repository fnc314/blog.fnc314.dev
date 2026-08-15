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
      lastmodDateOnly: false,
    },
    head: [
      [
        "link",
        {
          rel: "icon",
          href: "./icon/favicon.ico"
        }
      ],
      [
        "link",
        {
          rel: "icon",
          href: "./icon/favicon-32x32.png",
          type: "image/png",
          sizes: "32x32",
        }
      ],
      [
        "link",
        {
          rel: "icon",
          href: "./icon/favicon-16x16.png",
          type: "image/png",
          sizes: "16x16",
        }
      ],
      [
        "link",
        {
          rel: "icon",
          href: "./icon/icon.svg",
          type: "image/svg+xml",
          sizes: "any",
        }
      ],
      [
        "link",
        {
          rel: "apple-touch-icon",
          href: "./icon/apple-touch-icon.png",
        }
      ],
      [
        "meta",
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0, viewport-fit=contain"
        }
      ],
      [
        "meta",
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        }
      ],
      [
        "meta",
        {
          name: "mobile-web-app-capable",
          content: "yes",
        }
      ],
      [
        "meta",
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        }
      ],
      [
        "meta",
        {
          name: "description",
          content: "Blog site for Franco N. Colaizzi - blog.fnc314.dev",
        }
      ],
      [
        "meta",
        {
          property: "og:title",
          content: "blog.fnc314.dev",
        }
      ],
      [
        "meta",
        {
          property: "og:url",
          content: "https://blog.fnc314.dev/",
        }
      ],
      [
        "meta",
        {
          property: "og:description",
          content: "Blog site for Franco Colaizzi - blog.fnc314.dev",
        }
      ],
      [
        "meta",
        {
          property: "og:image",
          content: "/profile-photo/profile-photo-1200.webp",
        }
      ],
      [
        "meta",
        {
          property: "og:image:secure_url",
          content: "/profile-photo/profile-photo-1200.webp",
        }
      ],
      [
        "meta",
        {
          property: "og:image:secure_url",
          content: "/profile-photo/profile-photo-1200.webp",
        }
      ],
      [
        "meta",
        {
          property: "og:image:type",
          content: "image/webp",
        }
      ],
      [
        "meta",
        {
          property: "og:image:alt",
          content: "Profile Photo of Franco N. Colaizzi with a blurred background of Abruzzo, Italy from 2025",
        }
      ],
      [
        "meta",
        {
          property: "og:image:width",
          content: "1200",
        }
      ],
      [
        "meta",
        {
          property: "og:image:height",
          content: "1735",
        }
      ],
      // Twitter
      [
        "meta",
        {
          property: "twitter:title",
          content: "blog.fnc314.dev",
        }
      ],
      [
        "meta",
        {
          property: "twitter:site",
          content: "@fnc314",
        }
      ],
      [
        "meta",
        {
          property: "twitter:creator",
          content: "@fnc314",
        }
      ],
      [
        "meta",
        {
          property: "twitter:url",
          content: "https://blog.fnc314.dev",
        }
      ],
      [
        "meta",
        {
          property: "twitter:description",
          content: "Blog site for Franco N. Colaizzi - blog.fnc314.dev",
        }
      ],
      [
        "meta",
        {
          property: "twitter:image",
          content: "/profile-photo/profile-photo-1200.webp",
        }
      ],
      [
        "meta",
        {
          property: "twitter:image:alt",
          content: "Profile Photo of Franco N. Colaizzi with a blurred background of Abruzzo, Italy from 2025",
        }
      ],
    ],
    themeConfig: {
      aside: false,
      nav: [
        {
          text: "Home",
          link: "/",
          noIcon: false,
          target: "_self",
        }
      ],
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
