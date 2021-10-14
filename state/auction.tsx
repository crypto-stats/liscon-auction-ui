import React, { useContext } from 'react'
import { AuctionStateWithMethods } from './types'
import { useChainAuction } from './chain-auction'
import { useMemoryAuction } from './memory-auction'

export type { Bid } from './types'

const AuctionContext = React.createContext<AuctionStateWithMethods>({
  lastUpdate: 0,
  ethCollected: 0,
  activeBid: null,
  bids: [],
  owner: null,

  async addBid() { throw new Error('Not initialized') },
  async setBidApproval() { throw new Error('Not initialized') },
  async updateBid() { throw new Error('Not initialized') },
  async deposit() { throw new Error('Not initialized') },
  async withdrawAll() { throw new Error('Not initialized') },
  async update() { throw new Error('Not initialized') },
});

export const useAuction = () => useContext(AuctionContext)

const MemoryAuctionProvider: React.FC = ({ children }) => {
  const state = useMemoryAuction()

  return (
    <AuctionContext.Provider value={state}>{children}</AuctionContext.Provider>
  )
}

const ChainAuctionProvider: React.FC = ({ children }) => {
  const state = useChainAuction()

  return (
    <AuctionContext.Provider value={state}>{children}</AuctionContext.Provider>
  )
}

export const AuctionProvider: React.FC<{ mode: 'memory' | 'testnet' }> = ({ children, mode }) => {
  if (mode === 'memory') {
    return <MemoryAuctionProvider>{children}</MemoryAuctionProvider>
  }
  if (mode === 'testnet') {
    return <ChainAuctionProvider>{children}</ChainAuctionProvider>
  }
  throw new Error(`Invalid mode ${mode}`)
}
