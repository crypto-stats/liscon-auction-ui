import React, { useState } from 'react'
import styled from 'styled-components'
import { useAccounts } from 'state/accounts'
import Button from './Button'

const Row = styled.div`
  display: flex;
`

const WalletBalance: React.FC = () => {
  const { accountBalance, status, faucet } = useAccounts()
  const [loading, setLoading] = useState(false)
  console.log(accountBalance)
  
  if (status !== 'ready') {
    return null
  }

  const callFaucet = async () => {
    setLoading(true)
    await faucet()
    setLoading(false)
  }

  return (
    <Row>
      {accountBalance} ETH

      {parseFloat(accountBalance) < 0.01 && (
        <Button onClick={callFaucet} disabled={loading}>ETH Faucet</Button>
      )}
    </Row>
  )
}


export default WalletBalance
