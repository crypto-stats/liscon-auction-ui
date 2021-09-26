import React, { useState } from 'react'
import styled from 'styled-components'
import { useAuction } from 'state/auction'

const Label = styled.label`
  display: block;
`

const ETH_PRICE = 3000

const SponsorList: React.FC = () => {
  const [text, setText] = useState('')
  const [gweiPerSec, setGweiPerSec] = useState('')
  const [deposit, setDeposit] = useState('')
  const { addBid } = useAuction()

  const submit = async () => {
    await addBid('', text, parseFloat(gweiPerSec), parseFloat(deposit))
    setText('')
    setGweiPerSec('')
    setDeposit('')
  }

  return (
    <div>
      <Label>
        Text:
        <input
          value={text}
          onChange={(e: any) => setText(e.target.value)}
          placeholder="Text"
        />
      </Label>
      <Label>
        Bid (gwei-per-second)
        <input
          type="number"
          value={gweiPerSec}
          onChange={(e: any) => setGweiPerSec(e.target.value)}
          placeholder="Gwei per second"
        />
        ({((parseFloat(gweiPerSec) || 0) * ETH_PRICE / 1e9 * 60).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })} per minute)
      </Label>
      <Label>
        Deposit (ETH)
        <input
          type="number"
          value={deposit}
          onChange={(e: any) => setDeposit(e.target.value)}
          placeholder="Deposit amount"
        />
        ({((parseFloat(deposit) || 0) * ETH_PRICE).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })})
      </Label>
      <button onClick={submit}>Submit</button>
    </div>
  );
};

export default SponsorList
