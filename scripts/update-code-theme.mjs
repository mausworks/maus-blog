import fs from "fs/promises";
import fetch from "node-fetch";
import stripComments from "strip-json-comments";

const THEME_URL =
  "https://raw.githubusercontent.com/mausworks/mausworks-theme-vscode/main/themes/Mausworks%20Night-color-theme.json";

const OUTPUT_PATH = "./lib/mausworks-night-theme.json";

(async () => {
  const jsonWithComments = await fetch(THEME_URL).then((res) => res.text());
  const json = stripComments(jsonWithComments);

  await fs.writeFile(OUTPUT_PATH, json);
})();
