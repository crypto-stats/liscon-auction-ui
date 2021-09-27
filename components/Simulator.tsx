import React from 'react'
import styled from 'styled-components'
import Overlay from 'components/Overlay'
import AuctionMetrics from 'components/AuctionMetrics'
import SponsorForm from 'components/SponsorForm'
import SponsorList from 'components/SponsorList'
import VideoPlayer from 'components/VideoPlayer'
import WalletConnection from 'components/WalletConnection'
import { useAuction } from 'state/auction'
import Panel from './Panel'

const Container = styled.div`
  display: flex;
  flex: 1;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const Simulator = () => {
  const { activeBid } = useAuction()

  return (
    <Container>
      <Column>
        <Panel title="wallet">
          <WalletConnection />
        </Panel>

        <Panel>
          <AuctionMetrics />
        </Panel>

        <Panel title="Submit Sponsorship Bid">
          <SponsorForm />
        </Panel>
        <Panel title="Sponsor Bids">
          <SponsorList />
        </Panel>
        <Panel title="Unapproved Bids">
          <SponsorList unapproved />
        </Panel>
      </Column>

      <Column>
        <VideoPlayer>
          {activeBid && <Overlay>{activeBid.text}</Overlay>}
        </VideoPlayer>
      </Column>
    </Container>
  )
};

export default Simulator
