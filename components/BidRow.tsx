import React from 'react'
import CountUp from 'react-countup'
import { useAuction, Bid } from 'state/auction'

const BidRow: React.FC<{ bid: Bid }> = ({ bid }) => {
  const { setBidApproval, update } = useAuction()
  
  return (
    <div>
      <div>{bid.active && '[Active] '}{bid.text}</div>
      <div>
        Bid: {bid.gweiPerSec} gwei/s | Balance:{' '}
        {bid.active ? (
          <CountUp
            start={bid.balance}
            end={0}
            duration={bid.balance / (bid.gweiPerSec / 1e9)}
            decimals={8}
            onEnd={update}
          />
        ) : bid.balance}
      </div>
      <div>
        <button onClick={async () => {
          await setBidApproval(bid.id, !bid.approved)
          await update()
        }}>
          {bid.approved ? 'Unapprove' : 'Approve'}
        </button>
      </div>
    </div>
  )
}

export default BidRow
