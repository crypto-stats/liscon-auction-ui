import React from 'react'
import CountUp from 'react-countup'
import { useAuction, Bid } from 'state/auction'

const SponsorList = () => {
  const { bids, setBidApproval, update } = useAuction()

  return (
    <ul>
      {bids.map((bid: Bid) => (
        <li key={bid.id}>
          <div>{bid.active && '[Active] '}{bid.text}</div>
          <div>
            Bid: {bid.gweiPerSec} gwei/s | Balance:{' '}
            {bid.active ? (
              <CountUp
                start={bid.balance}
                end={0}
                duration={bid.balance / (bid.gweiPerSec / 1e9)}
                decimals={8}
              />
            ) : bid.balance}
            Duration: {bid.balance / (bid.gweiPerSec / 1e9)}
          </div>
          <div>
            <button onClick={async () => {
              await setBidApproval(bid.id, !bid.approved)
              await update()
            }}>
              {bid.approved ? 'Unapprove' : 'Approve'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SponsorList
