#!/usr/bin/env bash
set -euo pipefail

# Cloudflare Pages is configured to skip its automatic dependency install.
# Always install with npm here so a stale dependency cache can never make the
# build use a different package manager or an incompatible lockfile.
npm install --no-package-lock --no-audit --no-fund
npm run build
