import "./_global.css";
import styles from "./_app.module.css";

import Head from "next/head";

import Logo from "../components/Logo";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.app}>
        <Logo />

        <main className={styles.main}>
          <Component {...pageProps} />
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerLine}>
            &copy; Rasmus Wennerström {new Date().getUTCFullYear()}{" "}
            <span className={styles.vercelLogo}>▲</span> Hosted by{" "}
            <a href="https://vercel.com" target="_blank" rel="noreferrer">
              Vercel
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
