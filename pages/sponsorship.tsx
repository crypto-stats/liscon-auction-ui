import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Header from 'components/Header'
import Simulator from 'components/Simulator'
import VideoPlayer from 'components/VideoPlayer'
import Overlay from 'components/Overlay'
import { useAuction } from 'state/auction'

const Full = styled.main`
  width: 90%;
`

const Flex = styled.section`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 2rem 0;
`

const Column = styled.section`
  flex-basis: 40%;
  max-width: 40%;
  display: flex;
  flex-direction: column;
  @media (max-width: 1000px) {
    flex-basis: 100%;
    max-width: 100%;
    order: 2;
  }
`

const VideoContainer = styled.section`
  margin: 2rem 0;
`

const ExplainerTitle = styled.h2`
  font-size: 24px;
`

const LinkWrapper = styled.div`
  a {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #000;
  }
`

const BackIcon = styled.div`
  background-image: url('/arrowBack.svg');
  background-repeat: no-repeat;
  background-position: center;
  height: 10px;
  flex-basis: 20px;
  margin-right: 10px;
  margin-bottom: 2px;
`

export default function Sponsorship() {
  const { activeBid } = useAuction()

  return (
    <Full>
      <Header><h1>LisCon Stream Sponsorship</h1></Header>
      <LinkWrapper>
        <Link href='/'>
          <a>
          <BackIcon />
          <p>Back to full-screen live stream</p>
          </a>
        </Link>
      </LinkWrapper>
      <Flex>
        <Column>
          <VideoContainer>
            <VideoPlayer>
              {activeBid && <Overlay>{activeBid.text}</Overlay>}
            </VideoPlayer>
          </VideoContainer>
          <section>
            <ExplainerTitle>How does this work?</ExplainerTitle>
            <p>
              For the Liscon stream we are trying out an experimental system that lets anyone add a placement to the stream by bidding with others in real-time.
            </p>
            <p>
              The placement can be anything, it can be a logo and your project name or even your PFP.
            </p>
            <p>
              The way it works is that you set a budget in ETH, and then set a spend per second bid in gwei. The one with the highest gwei per second spend will show up on the stream.
            </p>
            <p>
              The top bidder will then spend their budget until either someone outbids them or their budget runs out. If you are the top bidder, you'll only spend your budget while the placement is in the top spot.
            </p>
            <p>You can at any time stop or withdraw your sponsorship spot. </p>
          </section>
        </Column>
        <Simulator />
      </Flex>
    </Full>
  )
}
