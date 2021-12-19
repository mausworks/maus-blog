import fs from "fs/promises";
import { Stats } from "fs";
import { basename, join } from "path";
import grayMatter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import withShiki from "./rehype-shiki";
import { getHighlighter } from "./syntax-highlight";

const POSTS_DIR = "./posts";

export type MDXContent = string;
export type PostContents = MDXRemoteSerializeResult;
export type CanonicalData = { slug: string };
export type ContentMetadata = {
  banner: string | null;
  bannerSource: string | null;
  title: string;
  description: string;
  createdAt?: number;
  updatedAt?: number;
};

export type PostDates = { createdAt: number; updatedAt: number };
export type PostMetadata = CanonicalData & ContentMetadata & PostDates;
export type BlogPost = { metadata: PostMetadata; contents: PostContents };

const FALLBACK_METADATA: ContentMetadata = {
  banner: null,
  bannerSource: null,
  title: "I forgot to name this page ...",
  description: "I forgot to add a description to this page ...",
};

export async function loadPost(name: string): Promise<BlogPost> {
  const path = join("posts", `${name}.mdx`);
  const status = await fs.stat(path);

  if (!status.isFile()) {
    throw new Error("The post is not a file.");
  } else {
    const [meta, contents] = await serializePost(path);

    return {
      contents,
      metadata: combineMetadata(
        getSlug(path),
        parsePostDates(status),
        formatContentMetadata(meta)
      ),
    };
  }
}

export async function latestPosts(max: 10): Promise<PostMetadata[]> {
  const names = await fs.readdir(POSTS_DIR);
  const byDate: Array<[number, { path: string; dates: PostDates }]> = [];

  for (const path of names.map((name) => join(POSTS_DIR, name))) {
    const status = await fs.stat(path);
    const dates = parsePostDates(status);

    byDate.push([dates.createdAt, { path, dates }]);
  }

  const latest = byDate
    .sort((l, r) => r[0] - l[0])
    .slice(0, max)
    .map(([, data]) => data);

  return await Promise.all(
    latest.map(async ({ path, dates }) =>
      combineMetadata(getSlug(path), dates, await readContentMetadata(path))
    )
  );
}

type PostData = [Record<string, unknown>, PostContents];

async function serializePost(path: string): Promise<PostData> {
  const rawPost = await readPost(path);
  const { content, data: frontMatter } = grayMatter(rawPost);
  const highlighter = await getHighlighter();

  return [
    frontMatter,
    await serialize(content, {
      mdxOptions: {
        rehypePlugins: [[withShiki as any, { highlighter }]],
      },
    }),
  ];
}

export async function listPosts() {
  return await fs.readdir(POSTS_DIR).then((paths) => paths.map(getSlug));
}

async function readContentMetadata(path: string): Promise<ContentMetadata> {
  const post = await readPost(path);
  const { data } = grayMatter(post);

  return formatContentMetadata(data);
}

const readPost = (path: string) =>
  fs
    .readFile(path, "utf-8")
    .catch((error) => `Cannot read post '${path}': ${String(error)}`);

const combineMetadata = (
  slug: string,
  dates: PostDates,
  contentMetadata: ContentMetadata
): PostMetadata => ({ ...dates, ...contentMetadata, slug });

const parsePostDates = (status: Stats): PostDates => ({
  createdAt: status.birthtimeMs || status.ctimeMs,
  updatedAt: status.mtimeMs,
});

function formatContentMetadata(data: Record<string, any>): ContentMetadata {
  let { createdAt, updatedAt, ...rest } = data;

  const metadata = { ...FALLBACK_METADATA, ...rest };

  updatedAt = parseDate(updatedAt);
  createdAt = parseDate(createdAt);
  createdAt && (metadata.createdAt = createdAt);
  updatedAt && (metadata.updatedAt = updatedAt);

  return metadata;
}

const parseDate = (input: unknown) =>
  typeof input === "string" ? new Date(input).getTime() : undefined;

const getSlug = (path: string) => basename(path, ".mdx");
