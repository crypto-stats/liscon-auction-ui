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

const Column = styled.section`
  flex-basis: 38%;
  max-width: 38%;
  display: flex;
  flex-direction: column;
`
const VideoContainer = styled.section`
  flex-basis: 32%;
  max-width: 32%;
`
const HeadingContainer = styled.article`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 8px;
`

const Heading = styled.h2`
  font-size: 30px;
  display: flex;
`

const Simulator = () => {
  const { activeBid } = useAuction()
  const [showNewBid, setShowNewBid] = useState(false)

  return (
    <>
      <VideoContainer>
        <VideoPlayer>
          {activeBid && <Overlay>{activeBid.text}</Overlay>}
        </VideoPlayer>
      </VideoContainer>

      <Column>
        <Panel title="Wallet" ButtonEl={WalletConnection} />

        <Panel>
          <AuctionMetrics />
        </Panel>

        <HeadingContainer>
          <Heading>
            Sponsor Bids
          </Heading>
          <Button onClick={() => setShowNewBid(true)}>Place new bid</Button>
        </HeadingContainer>

        <Panel title="Current Bids">
          <SponsorList />
        </Panel>
        <Panel title="Unapproved Bids">
          <SponsorList unapproved />
        </Panel>
      </Column>

      {showNewBid && (
        <Modal isOpen={true} onRequestClose={() => setShowNewBid(false)}>
          <SponsorForm onClose={() => setShowNewBid(false)} />
        </Modal>
      )}
    </>
  )
};

export default Simulator
