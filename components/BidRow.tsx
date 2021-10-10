import React, { useState } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import { useAuction, Bid } from 'state/auction'
import Button from './Button'

const Row = styled.div`
  background: #EEEEE4;
  border-radius: 5px;
  padding: 20px;
  margin: 7px 0;
  display: flex;
  justify-content: space-between;
`

const Title = styled.span`
  font-weight: 800;
`

const Chip = styled.div`
  display: inline-block;
  font-size: 14px;
  border: 1px solid #000000;
  border-radius: 5px;
  padding: 8px;
`

const Right = styled.div`
  text-align: right;
`

const BidRow: React.FC<{ bid: Bid, num: number }> = ({ bid, num }) => {
  const [showUpdate, setShowUpdate] = useState(false)
  const [showDeposit, setShowDeposit] = useState(false)
  const [newBid, setNewBid] = useState(bid.gweiPerSec)
  const [depositAmount, setDepositAmount] = useState('0')
  const { setBidApproval, update, updateBid, deposit, withdrawAll } = useAuction()
  
  return (
    <Row>
      <div>
        <div>
          <Title>{num}. {bid.text}</Title>
          {bid.active && <Chip>Active</Chip>}
        </div>
      </div>

      <Right>
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
          <Button onClick={async () => {
            await setBidApproval(bid.id, !bid.approved)
            await update()
          }}>
            {bid.approved ? 'Unapprove' : 'Approve'}
          </Button>
          <Button onClick={() => setShowUpdate(true)} disabled={showUpdate}>Update Bid</Button>
          <Button onClick={() => setShowDeposit(true)} disabled={showDeposit}>Deposit</Button>
          <Button onClick={() => withdrawAll(bid.id).then(update)} disabled={bid.balance === 0}>Withdraw All</Button>
        </div>
      </Right>
    </Row>
  )
}

export default BidRow
