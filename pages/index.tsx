import React, { useState } from 'react'
import styled from 'styled-components'
import Providers from 'state/Providers'
import Header from 'components/Header'
import ModeSelector from 'components/ModeSelector'
import VideoWithOverlay from 'components/VideoWithOverlay'

const Centered = styled.main`
  flex: 1;
  width: 70%;
  display: flex;
  flex-direction: column;
  @media (max-width: 1300px) {
    width: 80%;
  }
  @media (max-width: 1000px) {
    width: 90%;
  }
`

const Flex = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;
  p {
    font-size: 24px;
    font-weight: 300;
    margin-right: 1rem;
    @media (max-width: 600px) {
      text-align: center;
    }
  }

  @media (max-width: 600px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`

const VideoContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`

export default function Home() {
  return (
    <Providers mode="testnet">
      <Centered>
        <Header><h1>LisCon Live Stream</h1></Header>
        <VideoContainer>
          <VideoWithOverlay />
        </VideoContainer>
        <Flex>
          <p>Place a bid and show your project or NFT in the stream.</p>
          <ModeSelector />
        </Flex>
      </Centered>
    </Providers>
  )
}
