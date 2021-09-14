import { Highlighter } from "shiki";
import { raw } from "hast-util-raw";
import { toString } from "hast-util-to-string";
import { Element, Node } from "hast";
import visit from "unist-util-visit";

export interface ShikiPluginOptions {
  highlighter: Highlighter;
}

type ClassLike = null | string | number | boolean | Array<string | number>;

export default function attach({ highlighter }: ShikiPluginOptions) {
  const langs: string[] = highlighter.getLoadedLanguages();

  const visitor = (node: Element, _: number, parentNode?: Node) => {
    const parent = asElement(parentNode);

    if (!parent) {
      return;
    }

    const lang = getLang(node);

    if (lang && langs.includes(lang)) {
      const html = highlighter.codeToHtml(toString(node), lang);
      const code = raw({ type: "raw", value: html }) as Element;

      parent.properties = code.properties;
      parent.children = code.children;
    }
  };

  return (tree: Element) => visit<Element>(tree, [isElement], visitor);
}

const toClassList = (input?: ClassLike): string[] => {
  if (input instanceof Array) {
    return input.map(String);
  } else if (typeof input === "string") {
    return [input];
  } else {
    return [String(input)];
  }
};

const isElement = (node?: Node) => node?.type === "element";

const asElement = (node?: Node) =>
  (isElement(node) && (node as Element)) || null;

function getLang({ properties, tagName }: Element): string | null {
  if (tagName === "pre" || tagName === "code") {
    for (const className of toClassList(properties?.className)) {
      if (className.slice(0, 9) === "language-") {
        return className.slice(9).toLowerCase() as string;
      }
    }
  }

  return null;
}
