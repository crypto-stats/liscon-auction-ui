import React from 'react'
import { useAuction, Bid } from 'state/auction'

const SponsorList = () => {
  const { bids, setBidApproval, update } = useAuction()

  return (
    <ul>
      {bids.map((bid: Bid) => (
        <li key={bid.id}>
          <div>{bid.active && '[Active] '}{bid.text}</div>
          <div>Bid: {bid.gweiPerSec} gwei/s | Balance: {bid.balance}</div>
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
