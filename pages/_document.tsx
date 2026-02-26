import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="id" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/assets/images/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/assets/images/icon-192x192.png" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
