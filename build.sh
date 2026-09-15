#!/usr/bin/env bash
set -euo pipefail

# Cloudflare Pages is configured to skip its automatic dependency install.
# Install with npm explicitly so the build never depends on Bun lockfile detection.
npm install --no-package-lock
npm run build
