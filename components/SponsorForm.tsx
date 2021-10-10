import React, { useState } from 'react'
import styled from 'styled-components'
import { useAuction } from 'state/auction'
import Button from './Button'

const Title = styled.h4`
  font-size: 36px;
`

const Label = styled.label`
  display: block;
`

const ETH_PRICE = 3500

const SponsorList: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [text, setText] = useState('')
  const [deposit, setDeposit] = useState('')
  const { addBid, activeBid } = useAuction()
  const [gweiPerSec, setGweiPerSec] = useState(activeBid?.gweiPerSec.toString() || '')

  const submit = async () => {
    await addBid('', text, parseFloat(gweiPerSec), parseFloat(deposit))
    onClose()
  }

  return (
    <div>
      <Title>Place New bid</Title>

      <p>
        To get your placement onto the LisCon stream, you’ll need to outbid the current top bid, which is:
      </p>
      {activeBid && (
        <p>{activeBid.text} - {activeBid.gweiPerSec} gwei/sec</p>
      )}

      <Label htmlFor="text">Text</Label>
      <input
        id="text"
        value={text}
        onChange={(e: any) => setText(e.target.value)}
        placeholder="Text"
      />

      <Label htmlFor="bid">Bid (gwei-per-second)</Label>
      <input
        type="number"
        value={gweiPerSec}
        onChange={(e: any) => setGweiPerSec(e.target.value)}
        placeholder="Gwei per second"
      />
      <div>
        ({((parseFloat(gweiPerSec) || 0) * ETH_PRICE / 1e9 * 60).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })} per minute)
      </div>

      <Label htmlFor="budget">Budget</Label>
      <input
        id="budget"
        type="number"
        value={deposit}
        onChange={(e: any) => setDeposit(e.target.value)}
        placeholder="Deposit amount"
      />
      <div>
        ({((parseFloat(deposit) || 0) * ETH_PRICE).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })})
      </div>
      <div>You may withdraw any unspent ETH at any time</div>

      <div>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={submit}>Place Bid</Button>
      </div>
    </div>
  );
};

export default SponsorList
