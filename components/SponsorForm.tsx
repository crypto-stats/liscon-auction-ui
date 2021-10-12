import React, { useState } from 'react'
import styled from 'styled-components'
import { useAuction } from 'state/auction'
import Button from './Button'

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h4`
  font-size: 30px;
  margin: 1rem 0;
`

const CloseIcon = styled.div`
  background-image: url('/close.svg');
  background-repeat: no-repeat;
  background-position: center;
  height: 28px;
  flex-basis: 28px;
  margin-bottom: 8px;
  &:hover {
    cursor: pointer;
  }
`

const Label = styled.label`
  display: block;
  margin-top: 1.5rem;
  line-height: 1.5;
  padding: 10px 0;
`

const Input = styled.input`
  font-family: 'Neue Machina';
  font-size: 1rem;
  background-color: #EEEEE4;
  border: none;
  padding: 15px;
  width: calc(100% - 30px);
  margin-bottom: 5px;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  button:first-child {
    margin-right: 10px;
  }
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
    <section>
      <TitleWrapper>
        <Title>Place new bid</Title>
        <CloseIcon role="button" tabIndex={0} onClick={onClose}/>
      </TitleWrapper>

      <p>
        To get your placement onto the LisCon stream, you’ll need to outbid the current top bid, which is:
      </p>
      {activeBid && (
        <p>{activeBid.text} - {activeBid.gweiPerSec} gwei/sec</p>
      )}

      <Label htmlFor="text">Text</Label>
      <Input
        id="text"
        value={text}
        onChange={(e: any) => setText(e.target.value)}
        placeholder="Text"
      />

      <Label htmlFor="bid">Bid (gwei-per-second)</Label>
      <Input
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
      <Input
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
      <p>You may withdraw any unspent ETH at any time</p>

      <ButtonWrapper>
        <Button cancel onClick={onClose}>Cancel</Button>
        <Button onClick={submit}>Place bid</Button>
      </ButtonWrapper>
    </section>
  );
};

export default SponsorList
