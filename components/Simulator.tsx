import React, { useState } from 'react'
import styled from 'styled-components'
import Modal from 'react-modal'
import AuctionMetrics from 'components/AuctionMetrics'
import SponsorForm from 'components/SponsorForm'
import SponsorList from 'components/SponsorList'
import WalletBalance from 'components/WalletBalance'
import WalletConnection from 'components/WalletConnection'
import { useAccounts } from 'state/accounts'
import { useAuction, Bid } from 'state/auction'
import Button from './Button'
import Panel from './Panel'

const Column = styled.section`
  flex-basis: 54%;
  max-width: 54%;
  display: flex;
  flex-direction: column;
  @media (max-width: 1000px) {
    flex-basis: 100%;
    max-width: 100%;
    order: 1;
  }
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
  const [showNewBid, setShowNewBid] = useState(false)
  const { bids, owner } = useAuction()
  const { activeAccount } = useAccounts()

  const isOwner = owner === activeAccount?.toLowerCase()

  const activeBids = bids
    .filter((bid: Bid) => bid.approved)
    .sort((a: Bid, b: Bid) => !b.balance !== !a.balance ? b.balance - a.balance : b.gweiPerSec - a.gweiPerSec)

  const inactiveBids = bids
    .filter((bid: Bid) => !bid.approved && (isOwner || bid.owner === activeAccount))
    .sort((a: Bid, b: Bid) => !b.balance !== !a.balance ? b.balance - a.balance : b.gweiPerSec - a.gweiPerSec)

  return (
    <>
      <Column>
        <Panel title="Wallet" ButtonEl={WalletConnection}>
          <WalletBalance />
        </Panel>

        <Panel>
          <AuctionMetrics />
        </Panel>

        <HeadingContainer>
          <Heading>
            Sponsor Bids
          </Heading>
          <Button onClick={() => setShowNewBid(true)} disabled={!activeAccount}>Place new bid</Button>
        </HeadingContainer>

        <Panel title="Current Bids">
          <SponsorList bids={activeBids} />
        </Panel>
        {inactiveBids.length > 0 && (
          <Panel title="Unapproved Bids">
            <SponsorList bids={inactiveBids} />
          </Panel>
        )}
      </Column>

      {showNewBid && (
        <Modal 
          isOpen={true} 
          onRequestClose={() => setShowNewBid(false)}
          style={{
            overlay: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            },
            content: {
              position: 'relative',
              inset: 'unset',
              background: '#FAFAF0',
              padding: '30px',
              maxWidth: '400px'
            }
          }}
        >
          <SponsorForm onClose={() => setShowNewBid(false)} />
        </Modal>
      )}
    </>
  )
};

export default Simulator
