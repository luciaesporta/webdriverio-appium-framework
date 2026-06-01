#!/usr/bin/env bash
# Dump the current Android UI hierarchy to a local XML file.
# Usage: ./scripts/dump-ui.sh [screen-name]
#
# Requires a running emulator or device connected via adb.
# The output file can be read by Claude Code or Cursor to discover
# real accessibility labels before writing selectors.

set -euo pipefail

SCREEN="${1:-current}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUT_DIR="ui-dumps"
OUT_FILE="${OUT_DIR}/${SCREEN}-${TIMESTAMP}.xml"

mkdir -p "$OUT_DIR"

echo "Dumping UI hierarchy..."
adb shell uiautomator dump /sdcard/ui-dump.xml 2>/dev/null
adb pull /sdcard/ui-dump.xml "$OUT_FILE" 2>/dev/null
adb shell rm /sdcard/ui-dump.xml 2>/dev/null

echo "Saved to $OUT_FILE"
echo ""
echo "Accessibility labels found:"
grep -oP 'content-desc="[^"]*"' "$OUT_FILE" | sort -u | head -50
