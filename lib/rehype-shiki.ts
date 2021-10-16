import { raw } from "hast-util-raw";
import { toString } from "hast-util-to-string";
import { Element, Node } from "hast";
import { Highlighter } from "shiki";
import visit, { Visitor } from "unist-util-visit";

export interface ShikiPluginOptions {
  highlighter: Highlighter;
}

type ClassLike = null | string | number | boolean | Array<string | number>;

export default function attach({ highlighter }: ShikiPluginOptions) {
  const langs: string[] = highlighter.getLoadedLanguages();

  const visitor: Visitor<Element> = (element, _i, parentNode) => {
    const parent = asElement(parentNode);

    if (!parent) {
      return;
    }

    const lang = getLang(element);

    if (lang && langs.includes(lang)) {
      const html = highlighter.codeToHtml(toString(element), lang);
      const generated = raw({ type: "raw", value: html }) as Element;

      parent.properties = generated.properties;
      parent.children = generated.children;
    }
  };

  return (tree: Element) => visit(tree, "element", visitor);
}

const toClassList = (input?: ClassLike): string[] => {
  if (Array.isArray(input)) {
    return input.map(String);
  } else if (typeof input === "string") {
    return [input];
  } else {
    return [String(input)];
  }
};

const isElement = (node?: Node | null) => node?.type === "element";

const asElement = (node?: Node | null) =>
  (isElement(node) && (node as Element)) || null;

function getLang({ properties, tagName }: Element): string | null {
  if (tagName === "code") {
    for (const className of toClassList(properties?.className)) {
      if (className.slice(0, 9) === "language-") {
        return className.slice(9).toLowerCase();
      }
    }
  }

  return null;
}
