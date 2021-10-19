import React from 'react'
import Button from './Button'
import { useAccounts } from 'state/accounts'

const WalletConnection: React.FC = () => {
  const { status, activate, switchChain } = useAccounts()

  if (status === 'inactive') {
    return (
      <Button onClick={activate}>Connect wallet</Button>
    )
  }

  if (status === 'wrong-chain') {
    return (
      <Button onClick={switchChain}>Switch to Arbitrum</Button>
    )
  }

  return null
}

export default WalletConnection
