import React from 'react'
import { useAuction, Bid } from 'state/auction'

const SponsorList = () => {
  const { bids } = useAuction()

  return (
    <ul>
      {bids.map((bid: Bid) => (
        <li key={bid.id}>{bid.text}</li>
      ))}
    </ul>
  );
};

export default SponsorList
