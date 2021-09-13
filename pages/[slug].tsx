import { MDXRemote } from "next-mdx-remote";
import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  GetStaticPathsResult,
} from "next";
import Head from "next/head";

import { listPosts, loadPost, BlogPost } from "../post";
import { Banner } from "../components/Banner";

import styles from "./BlogPage.module.css";

type BlogParams = { slug: string };
type StaticBlogContext = GetStaticPropsContext<BlogParams>;
type StaticBlogProps = GetStaticPropsResult<BlogPost>;

export default function BlogPage({ metadata, contents }: BlogPost) {
  return (
    <>
      <Head>
        <title>{metadata.title} - maus.lol</title>
        <meta property="og:title" content={metadata.title} />
        <meta
          name="description"
          property="og:description"
          content={metadata.description}
        />
        {metadata.banner && (
          <meta property="og:image" content={metadata.banner} />
        )}
      </Head>

      <article className={styles.page}>
        <Banner {...metadata} />

        <div className="content">
          <h1
            className="fatTitle"
            style={{
              transform: "translateY(calc(var(--fat-title-height) * -1))",
            }}
          >
            {metadata.title}
          </h1>

          <div className={styles.postContents}>
            <p className={styles.description}>{metadata.description}</p>

            <MDXRemote {...contents} />
          </div>
        </div>
      </article>
    </>
  );
}

export async function getStaticProps({
  params,
}: StaticBlogContext): Promise<StaticBlogProps> {
  if (!params?.slug) {
    throw new Error("Please provide a slug 🐛");
  } else {
    return { props: { ...(await loadPost(params.slug)) } };
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths = await listPosts().then((names) =>
    names.map((name) => "/" + name)
  );

  return { paths, fallback: false };
}
