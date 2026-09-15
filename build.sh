#!/usr/bin/env bash
set -euo pipefail

# Cloudflare Pages can install dependencies before invoking this script.
# The fallback keeps direct Wrangler/manual builds reproducible without a lockfile.
if [ ! -d "node_modules" ]; then
  npm install --no-package-lock --no-audit --no-fund
fi

npm run build
