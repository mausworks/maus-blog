import relative from "date-fns/formatRelative";
import iso from "date-fns/formatISO";
import { PostMetadata } from "../post";
import Link from "next/link";

import styles from "./PostList.module.css";

export type PostListProps = { posts: PostMetadata[] };

export default function PostList({ posts }: PostListProps) {
  const now = Date.now();

  return (
    <div className={styles.list}>
      {posts.map((post) => (
        <article className={styles.item} key={post.slug}>
          <Link href={"/" + post.slug}>
            <a>
              <h3 className={styles.title}>
                {post.title}
                <time className={styles.date} title={iso(post.createdAt)}>
                  {relative(post.createdAt, now)}
                </time>
              </h3>

              <h4 className={styles.description}>{post.description}</h4>
            </a>
          </Link>
        </article>
      ))}
    </div>
  );
}
