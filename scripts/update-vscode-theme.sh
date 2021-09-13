#!/bin/bash

THEME_URL='https://raw.githubusercontent.com/mausworks/mausworks-theme-vscode/main/themes/Mausworks%20Night-color-theme.json'
OUTPUT_PATH="./shiki-themes/mausworks-night.json"

wget "$THEME_URL" -O "$OUTPUT_PATH"
