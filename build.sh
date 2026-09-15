#!/usr/bin/env bash
set -euo pipefail

# Cloudflare may either install dependencies automatically or skip that step.
# If dependencies are not present, install them explicitly with npm.
if [ ! -d "node_modules" ]; then
  npm install --no-package-lock
fi

npm run build
