import React, { Fragment } from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
    font-family: 'Neue Machina', monospace;
  }
  html, body, #__next {
    display: flex;
    flex-direction: column;
    flex: 1 1 100%;
    margin: 0;
  }

  #__next {
    justify-content: center;
    align-items: center;
  }

  .ReactModal__Overlay {
    z-index: 10;
  }

  body {
    background: #FAFAF0;
    color: #000000;
  }
`
const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Fragment>
      <Head>
        <title key="title">LisCon Stream and Sponsorship</title>
        <link rel="icon" href="/favicon.png" />
        <link href="/NeueMachina/stylesheet.css" rel="stylesheet" />
      </Head>

      <GlobalStyle />

      <Component {...pageProps} />
    </Fragment>
  );
};

export default App;
