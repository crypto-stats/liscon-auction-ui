import React, { useState } from 'react'
import CountUp from 'react-countup'
import { useAuction, Bid } from 'state/auction'

const BidRow: React.FC<{ bid: Bid }> = ({ bid }) => {
  const [showUpdate, setShowUpdate] = useState(false)
  const [showDeposit, setShowDeposit] = useState(false)
  const [newBid, setNewBid] = useState(bid.gweiPerSec)
  const [depositAmount, setDepositAmount] = useState('0')
  const { setBidApproval, update, updateBid, deposit, withdrawAll } = useAuction()
  
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

      {showDeposit && (
        <div>
          Deposit:
          <input type="number" value={depositAmount} onChange={(e: any) => setDepositAmount(e.target.value)} />
          <button onClick={async () => {
            await deposit(bid.id, parseFloat(depositAmount))
            await update()
            setShowDeposit(false)
            setDepositAmount('0')
          }}>
            Deposit
          </button>
          <button onClick={() => setShowDeposit(false)}>Cancel</button>
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
        <button onClick={() => setShowDeposit(true)} disabled={showDeposit}>Deposit</button>
        <button onClick={() => withdrawAll(bid.id).then(update)} disabled={bid.balance === 0}>Withdraw All</button>
      </div>
    </div>
  )
}

export default BidRow
