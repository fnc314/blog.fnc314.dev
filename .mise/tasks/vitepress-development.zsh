#! /usr/bin/env zsh
#MISE alias="vp:d"
#MISE description="The development build command"
#MISE shell="zsh"
#MISE tools={ node = "latest", "npm:vite" = "latest", "npm:vitepress" = "latest" }

set -euo pipefail

pnpm vitepress dev