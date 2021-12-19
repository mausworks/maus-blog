import * as shiki from "shiki";
import theme from "./mausworks-night-theme.json";

const options: shiki.HighlighterOptions = {
  theme: theme as any,
  langs: ["ts", "tsx", "jsx", "js", "sh", "html", "css", "ini"],
};

let highlighter: shiki.Highlighter | null = null;

export async function getHighlighter(): Promise<shiki.Highlighter> {
  return (highlighter = highlighter || (await shiki.getHighlighter(options)));
}
