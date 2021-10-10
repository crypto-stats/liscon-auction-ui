import React, { useState } from 'react'
import styled from 'styled-components'
import Modal from 'react-modal'
import Overlay from 'components/Overlay'
import AuctionMetrics from 'components/AuctionMetrics'
import SponsorForm from 'components/SponsorForm'
import SponsorList from 'components/SponsorList'
import VideoPlayer from 'components/VideoPlayer'
import WalletConnection from 'components/WalletConnection'
import { useAuction } from 'state/auction'
import Button from './Button'
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

const Heading = styled.h2`
  font-size: 36px;
  display: flex;
`

const Simulator = () => {
  const { activeBid } = useAuction()
  const [showNewBid, setShowNewBid] = useState(false)

  return (
    <Container>
      <Column>
        <Panel title="wallet">
          <WalletConnection />
        </Panel>

        <Panel>
          <AuctionMetrics />
        </Panel>

        <Heading>
          Sponsor Bids
          <Button onClick={() => setShowNewBid(true)}>New Bid</Button>
        </Heading>

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

      {showNewBid && (
        <Modal isOpen={true} onRequestClose={() => setShowNewBid(false)}>
          <SponsorForm onClose={() => setShowNewBid(false)} />
        </Modal>
      )}
    </Container>
  )
};

export default Simulator
