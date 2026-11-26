// https://vitepress.dev/guide/custom-theme
import { type Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import "./overrides.css";
import "./styles.css";
import "./tokens.css";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    if (typeof window !== "undefined") {
      router.onAfterRouteChange = (to) => {
        if (typeof window.gtag === "function") {
          window.gtag("event", "page_view", {
            page_path: to,
            page_location: window.location.href,
            page_title: document.title,
          });
        }
      };

      // Delegated listener for tracking back-clicks to portfolio
      window.addEventListener("click", (event) => {
        const target = (event.target as HTMLElement)?.closest("a");
        if (!target) return;
        const href = target.getAttribute("href") || "";
        if (href.includes("fnc314.dev") && !href.includes("blog.fnc314.dev")) {
          if (typeof window.gtag === "function") {
            window.gtag("event", "click_outbound", {
              category: "navigation",
              label: "Return to Portfolio",
              destination: href,
              platform: "www.fnc314.dev",
            });
          }
        }
      });
    }
  },
} satisfies Theme;
