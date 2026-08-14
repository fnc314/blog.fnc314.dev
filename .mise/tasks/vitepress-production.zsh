#! /usr/bin/env zsh -S
#MISE alias="vp:p"
#MISE description="The production build command"
#MISE outputs=[".vitepress/dist/*"]
#MISE shell="zsh"
#MISE sources=["index.md", "./posts/**/*.md", ".vitepress/config.ts", ".vitepress/theme/*.{css,vue,ts}"]
#MISE tools={ node = "latest", "npm:vite" = "latest", "npm:vitepress" = "latest" }

set -euo pipefail

pnpm vitepress build