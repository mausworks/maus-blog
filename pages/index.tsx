import type { GetStaticPropsResult, NextPage } from "next";
import Head from "next/head";
import { latestPosts, PostMetadata } from "../post";
import PostList from "../components/PostList";

import styles from "./index.module.css";

type HomeProps = { latest: PostMetadata[] };
type StaticHomeProps = GetStaticPropsResult<HomeProps>;

export default function Home({ latest }: HomeProps) {
  return (
    <div className="content">
      <Head>
        <title>maus - latest posts</title>
        <meta name="description" content="My latest posts" />
      </Head>

      <div className={styles.content}>
        <h1 className="fatTitle">Latest posts</h1>

        <PostList posts={latest} />
      </div>
    </div>
  );
}

export async function getStaticProps(): Promise<StaticHomeProps> {
  const latest = await latestPosts(10);

  return { props: { latest } };
}
