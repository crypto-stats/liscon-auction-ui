import React, { useContext } from 'react'
import { AccountsStateWithMethods } from './types'
import { useMemoryAccounts } from './memory-accounts'
import { useChainAccounts } from './chain-accounts'

const AuctionContext = React.createContext<AccountsStateWithMethods>({
  balances: {},
  activeAccount: '',
  active: false,

  async activate() { throw new Error('Not initialized') },
  async transfer() { throw new Error('Not initialized') },
  async balanceOf() { throw new Error('Not initialized') },
});

export const useAccounts = () => useContext(AuctionContext)


const MemoryAccountsProvider: React.FC = ({ children }) => {
  const state = useMemoryAccounts()

  return (
    <AuctionContext.Provider value={state}>{children}</AuctionContext.Provider>
  )
}

const ChainAccountsProvider: React.FC = ({ children }) => {
  const state = useChainAccounts()

  return (
    <AuctionContext.Provider value={state}>{children}</AuctionContext.Provider>
  )
}

export const AccountsProvider: React.FC<{ mode: 'memory' | 'testnet' }> = ({ children, mode }) => {
  if (mode === 'memory') {
    return <MemoryAccountsProvider>{children}</MemoryAccountsProvider>
  }
  if (mode === 'testnet') {
    return <ChainAccountsProvider>{children}</ChainAccountsProvider>
  }
  throw new Error(`Invalid mode ${mode}`)
}
