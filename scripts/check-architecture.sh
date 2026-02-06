#!/bin/bash

# Usage: ./check-architecture.sh [package-folder]
# Default: src/modules
# Default to src/modules if no argument, or [arg]/src/modules if argument provided
if [ -z "$1" ]; then
    PACKAGE_DIR="src/modules"
elif [ -d "$1/src/modules" ]; then
    PACKAGE_DIR="$1/src/modules"
else
    PACKAGE_DIR="$1"
fi

echo "Checking for architectural violations in: $PACKAGE_DIR"

# 1. Run ESLint specifically for import restrictions
# We check if local eslint exists, otherwise use npx
ESLINT_CMD="npx eslint"
$ESLINT_CMD "$PACKAGE_DIR" --rule 'import/no-restricted-paths: error'

# 2. Check for missing public-api files
# Exclude node_modules and only check directories inside PACKAGE_DIR
find "$PACKAGE_DIR" -maxdepth 1 -mindepth 1 -type d '!' -name "node_modules" '!' -exec test -e "{}/index.ts" -o -e "{}/$(basename {}).public.ts" ';' -print | grep . && echo "Error: Missing Public API in slice" && exit 1

echo "Architecture is clean!"