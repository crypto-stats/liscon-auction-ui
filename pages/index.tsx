import React, { useState, Fragment } from 'react'
import styled from 'styled-components'
import Providers from 'state/Providers'
import Header from 'components/Header'
import ModeSelector from 'components/ModeSelector'
import Simulator from 'components/Simulator'

const Narrow = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  align-self: center;
`

const Full = styled.main`
  margin: 10px;
`

const Explainer = styled.div`
  max-width: 400px;
  margin-right: 20px;
`

const ExplainerTitle = styled.h2`
  font-size: 24px;
`

export default function Home() {
  const [mode, setMode] = useState<'memory' | 'testnet' | null>(null)

  if (!mode) {
    return (
      <Narrow>
        <Header>LisCon Live Stream</Header>

        <ModeSelector onSelect={setMode} />
      </Narrow>
    )
  }

  return (
    <Providers mode={mode}>
      <Full>
        <Header>LisCon Stream Sponsorship</Header>
        <Simulator />

        <Explainer>
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
        </Explainer>
      </Full>
    </Providers>
  )
}
