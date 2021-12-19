import type { GetStaticPropsResult, NextPage } from "next";
import Head from "next/head";
import { latestPosts, PostMetadata } from "../lib/post";
import PostList from "../components/PostList";

import styles from "./index.module.css";

type HomeProps = { latest: PostMetadata[] };
type StaticHomeProps = GetStaticPropsResult<HomeProps>;

export default function Home({ latest }: HomeProps) {
  return (
    <div className="content">
      <Head>
        <title>maus · posts</title>
        <meta name="description" content="Long obtuse litanies" />
      </Head>

      <div className={styles.content}>
        <h1 className="fatTitle">Long obtuse litanies</h1>

        <PostList posts={latest} />
      </div>
    </div>
  );
}

export async function getStaticProps(): Promise<StaticHomeProps> {
  const latest = await latestPosts(10);

  return { props: { latest } };
}
