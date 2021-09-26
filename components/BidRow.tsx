import React, { useState } from 'react'
import CountUp from 'react-countup'
import { useAuction, Bid } from 'state/auction'

const BidRow: React.FC<{ bid: Bid }> = ({ bid }) => {
  const [showUpdate, setShowUpdate] = useState(false)
  const [newBid, setNewBid] = useState(bid.gweiPerSec)
  const { setBidApproval, update, updateBid } = useAuction()
  
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

      {showUpdate && (
        <div>
          New bid:
          <input type="number" value={newBid} onChange={(e: any) => setNewBid(e.target.value)} />
          <button onClick={async () => {
            await updateBid(bid.id, newBid)
            await update()
            setShowUpdate(false)
          }}>
            Update
          </button>
          <button onClick={() => setShowUpdate(false)}>Cancel</button>
        </div>
      )}

      <div>
        <button onClick={async () => {
          await setBidApproval(bid.id, !bid.approved)
          await update()
        }}>
          {bid.approved ? 'Unapprove' : 'Approve'}
        </button>
        <button onClick={() => setShowUpdate(true)} disabled={showUpdate}>Update Bid</button>
      </div>
    </div>
  )
}

export default BidRow
