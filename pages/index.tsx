import React, { useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Providers from 'state/Providers'
import Header from 'components/Header'
import ModeSelector from 'components/ModeSelector'
import VideoPlayer from 'components/VideoPlayer'
import Overlay from 'components/Overlay'
import Button from 'components/Button'
import { useAuction } from 'state/auction'

const Centered = styled.main`
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
  button {
    min-width: 200px;
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
`

export default function Home() {
  const [mode, setMode] = useState<'memory' | 'testnet' | null>(null)
  const { activeBid } = useAuction()

  if (!mode) {
    return (
      <Centered>
        <Header><h1>LisCon Live Stream</h1></Header>
        <ModeSelector onSelect={setMode} />
      </Centered>
    )
  }

  return (
    <Providers mode={mode}>
      <Centered>
        <Header><h1>LLisCon Live Stream</h1></Header>
        <VideoContainer>
          <VideoPlayer>
            {activeBid && <Overlay>{activeBid.text}</Overlay>}
          </VideoPlayer>
        </VideoContainer>
        <Flex>
          <p>Place a bid and show your project or NFT in the stream.</p>
          <Link href='/sponsorship'>
            <Button>Place new bid</Button>
          </Link>
        </Flex>
      </Centered>
    </Providers>
  )
}
