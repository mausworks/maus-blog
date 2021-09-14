import Image from "next/image";
import { CSSProperties } from "react";
import { PostMetadata } from "../lib/post";

import styles from "./Banner.module.css";

export function Banner({ banner, bannerSource }: PostMetadata) {
  if (!banner) {
    return <div className={styles.noBanner} />;
  } else {
    const bannerStyle: CSSProperties = {
      backgroundImage: `url(${banner})`,
    };

    return (
      <div className={styles.wrapper}>
        <div className={styles.banner} style={bannerStyle} />
        {bannerSource && (
          <span className={styles.originalSource}>
            Image from{" "}
            <a href={bannerSource} target="_blank" rel="noreferrer">
              {bannerSource}
            </a>
          </span>
        )}
      </div>
    );
  }
}
