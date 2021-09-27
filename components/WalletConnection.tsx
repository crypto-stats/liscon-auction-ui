import React from 'react'
import { useAccounts } from 'state/accounts'

const WalletConnection: React.FC = () => {
  const { status, activate, switchChain } = useAccounts()

  if (status === 'inactive') {
    return (
      <div>
        <button onClick={activate}>Connect wallet</button>
      </div>
    )
  }

  if (status === 'wrong-chain') {
    return (
      <div>
        <button onClick={switchChain}>Switch to Arbitrum Testnet</button>
      </div>
    )
  }

  return null
}

export default WalletConnection
