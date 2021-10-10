import React, { useState } from 'react'
import styled from 'styled-components'
import { Bid } from 'state/auction'
import Button from './Button'

const Title = styled.h4`
  font-size: 36px;
`

const ETH_PRICE = 3500

interface UpdateFormProps {
  bid: Bid
  onClose: () => void
  onSave: (num: number) => void
}

const UpdateForm: React.FC<UpdateFormProps> = ({ bid, onClose, onSave }) => {
  const [gweiPerSec, setBid] = useState(bid.gweiPerSec.toString())
  return (
    <div>
      <Title>Update Bid</Title>
      <p>Update the bid for {bid.text}.</p>
      <label htmlFor="bid">New Bid</label>
      <input
        id="bid"
        type="number"
        value={gweiPerSec}
        onChange={(e: any) => setBid(e.target.value)}
      />

      <div>
        {((parseFloat(gweiPerSec) || 0) * ETH_PRICE / 1e9 * 60).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })} per minute
      </div>

      <div>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(parseFloat(gweiPerSec))}>Update Bid</Button>
      </div>
    </div>
  );
};

export default UpdateForm
