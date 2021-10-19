import React, { useState, Fragment } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import Modal from 'react-modal'
import { useAccounts } from 'state/accounts'
import { useAuction, Bid } from 'state/auction'
import Button from './Button'
import UpdateForm from './UpdateForm'

const Row = styled.div`
  background: #EEEEE4;
  border-radius: 5px;
  padding: 20px;
  margin: 7px 0;
  display: flex;
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
  flex: 1;
`

const Image = styled.div`
  aspect-ratio: 1;
  background-size: contain;
  background-repeat: no-repeat;
`

Modal.setAppElement('#__next')

const BidRow: React.FC<{ bid: Bid, num: number }> = ({ bid, num }) => {
  const [modal, setModal] = useState('')
  const [showDeposit, setShowDeposit] = useState(false)
  const [depositAmount, setDepositAmount] = useState('0')
  const { setBidApproval, update, updateBid, deposit, withdrawAll, owner } = useAuction()
  const { activeAccount } = useAccounts()
  
  return (
    <Row>
      <div>
        <div>
          <Title>{num}. {bid.text}</Title>
          {bid.active && <Chip>Active</Chip>}
        </div>
        {bid.subtext && <div>{bid.subtext}</div>}
      </div>

      {bid.image && <Image style={{ backgroundImage: `url('${bid.image}')` }} />}

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

        {modal === 'update' && (
          <Modal isOpen={true} onRequestClose={() => setModal('')}>
            <UpdateForm
              bid={bid}
              onClose={() => setModal('')}
              onSave={async (newBid: number) => {
                await updateBid(bid.id, newBid)
                await update()
                setModal('')
              }}
            />
          </Modal>
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
          {activeAccount?.toLowerCase() === owner && (
            <Button onClick={async () => {
              await setBidApproval(bid.id, !bid.approved)
              await update()
            }}>
              {bid.approved ? 'Unapprove' : 'Approve'}
            </Button>
          )}
          {!bid.approved && activeAccount?.toLowerCase() !== owner && (
            <div>Pending Approval</div>
          )}

          {activeAccount?.toLowerCase() === bid.owner && (
            <Fragment>
              <Button onClick={() => setModal('update')}>Update Bid</Button>
              <Button onClick={() => setShowDeposit(true)} disabled={showDeposit}>Deposit</Button>
              <Button onClick={() => withdrawAll(bid.id).then(update)} disabled={bid.balance === 0}>
                Withdraw All
              </Button>
            </Fragment>
          )}
        </div>
      </Right>
    </Row>
  )
}

export default BidRow
