#! /usr/bin/env zsh
#MISE alias="vp:p"
#MISE description="The production build command"
#MISE shell="zsh"
#MISE tools={ node = "latest", "npm:vite" = "latest", "npm:vitepress" = "latest" }
#USAGE flag "-p" help="Runs `pnpm vitepress preview`" default="false"

set -euo pipefail

if [[ "${usage_p:=false}" == "true" ]]; then
  pnpm vitepress build && pnpm vitepress preview
else
  pnpm vitepress build
fi