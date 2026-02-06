#!/bin/bash

# Usage: ./check-architecture.sh [package-folder]
# Default: src/modules
PACKAGE_DIR="${1:-src/modules}"

echo "Checking for architectural violations in: $PACKAGE_DIR"

# 1. Run ESLint specifically for import restrictions
npx eslint "$PACKAGE_DIR" --rule 'import/no-restricted-paths: error'

# 2. Check for missing public-api files
find "$PACKAGE_DIR" -maxdepth 1 -mindepth 1 -type d '!' -exec test -e "{}/index.ts" -o -e "{}/$(basename {}).public.ts" ';' -print | grep . && echo "Error: Missing Public API in slice" && exit 1

echo "Architecture is clean!"