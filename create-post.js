const fs = require("fs/promises");

const date = new Date();

const args = process.argv.slice(2);
const title = args[0];

if (!title) {
  console.error(
    "You have to provide a title as the first positional argument."
  );
  process.exit(1);
}

const slug = title.replace(/\W+/g, "-").toLowerCase();

const frontMatter = `---
title: "${title}"
createdAt: "${new Date().toISOString()}"
---`;

(async () => {
  await fs.writeFile(`./posts/${slug}.mdx`, frontMatter, "utf-8");

  console.log(`Page '${title}'' created!!`);
})();
