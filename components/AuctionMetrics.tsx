import React from 'react';
import CountUp from 'react-countup'
import { useAuction } from 'state/auction'

const AuctionMetrics = () => {
  const { activeBid, ethCollected } = useAuction()

  return (
    <div>
      <div>
        Total revenue:{' '}
        {activeBid ? (
          <CountUp
            start={ethCollected}
            end={ethCollected + activeBid.balance}
            duration={activeBid.balance / (activeBid.gweiPerSec / 1e9)}
            decimals={8}
          />
        ) : ethCollected}
        {' ETH'}
      </div>
    </div>
  )
};

export default AuctionMetrics
