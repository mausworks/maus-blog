import * as shiki from "shiki";
import { join } from "path";

const options: shiki.HighlighterOptions = {
  themes: ["mausworks-night"],
  paths: { themes: join(process.cwd(), "./shiki-themes/") },
  langs: ["ts", "tsx", "jsx", "js", "sh", "html", "css"],
};

let highlighter: shiki.Highlighter | null = null;

export async function getHighlighter(): Promise<shiki.Highlighter> {
  return (highlighter = highlighter || (await shiki.getHighlighter(options)));
}
