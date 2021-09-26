import React, { Fragment } from 'react';
import Overlay from 'components/Overlay'
import AuctionMetrics from 'components/AuctionMetrics'
import SponsorForm from 'components/SponsorForm'
import SponsorList from 'components/SponsorList'
import VideoPlayer from 'components/VideoPlayer'
import { useAuction } from 'state/auction'

const Simulator = () => {
  const { activeBid } = useAuction()

  return (
    <Fragment>
      <AuctionMetrics />

      <SponsorList />
      <SponsorForm />
      <VideoPlayer>
        {activeBid && <Overlay>{activeBid.text}</Overlay>}
      </VideoPlayer>
    </Fragment>
  )
};

export default Simulator
