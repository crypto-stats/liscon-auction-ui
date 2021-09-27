import React, { useState, Fragment } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { AuctionProvider } from 'state/auction'
import ModeSelector from 'components/ModeSelector'
import Simulator from 'components/Simulator'

const Title = styled.h1`
  color: #eeeeee;
  font-size: 30px;
  margin: 4px 0 8px;
`

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
    font-family: sans-serif;
  }
  html, body, #__next {
    display: flex;
    flex-direction: column;
    flex: 1 1 100%;
    margin: 0;
  }

  body {
    background: #0f0f58;
    color: white;
  }
`

export default function Home() {
  const [mode, setMode] = useState<'memory' | 'testnet' | null>(null)

  if (!mode) {
    return (
      <Fragment>
        <GlobalStyle />

        <ModeSelector onSelect={setMode} />
      </Fragment>
    )
  }

  return (
    <AuctionProvider mode={mode}>
      <GlobalStyle />
      
      <Title>LisCon Stream Sponsorship</Title>
      <Simulator />
    </AuctionProvider>
  )
}
