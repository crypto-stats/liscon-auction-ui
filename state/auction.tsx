import React, { useContext, useState, useRef } from 'react'

export interface Bid {
  id: number
  owner: string
  text: string
  gweiPerSec: number
  balance: number
  approved: boolean
  active: boolean
}

export interface AuctionState {
  lastUpdate: number
  ethCollected: number
  activeBid: Bid | null
  bids: Bid[]
}

interface AuctionStateWithMethods extends AuctionState {
  addBid(owner: string, text: string, gweiPerSec: number, deposit: number): Promise<number>
  setBidApproval(id: number, approved: boolean): Promise<void>
  updateBid(id: number, gweiPerSec: number): Promise<void>
  deposit(id: number, eth: number): Promise<void>
  withdrawAll(id: number): Promise<void>
  update(): Promise<void>
}

const defaultState: AuctionState = {
  lastUpdate: 0,
  ethCollected: 0,
  activeBid: null,
  bids: [],
}

const AuctionContext = React.createContext<AuctionStateWithMethods>({
  ...defaultState,
  async addBid() { throw new Error('Not initialized') },
  async setBidApproval() { throw new Error('Not initialized') },
  async updateBid() { throw new Error('Not initialized') },
  async deposit() { throw new Error('Not initialized') },
  async withdrawAll() { throw new Error('Not initialized') },
  async update() { throw new Error('Not initialized') },
});

export const useAuction = () => useContext(AuctionContext)

export const AuctionProvider: React.FC = ({ children }) => {
  const nextId = useRef(0)
  const [state, setState] = useState<AuctionState>(defaultState)

  const updateState = (currentState: AuctionState) => {
    let nextTopBid = currentState.activeBid
    let ethCollected = currentState.ethCollected
    const now = Date.now() / 1000

    if (currentState.activeBid) {
      let amountPaid = currentState.activeBid.gweiPerSec * (now - currentState.lastUpdate) / 1e9
      if (amountPaid > currentState.activeBid.balance) {
        amountPaid = currentState.activeBid.balance

        currentState.activeBid.active = false
        nextTopBid = null
      }

      currentState.activeBid.balance -= amountPaid
      ethCollected += amountPaid
    }

    if (nextTopBid && !nextTopBid.approved) {
      nextTopBid = null
    }

    for (const bid of currentState.bids) {
      if (bid.approved
        && bid.balance > 0
        && (!nextTopBid || bid.gweiPerSec > nextTopBid.gweiPerSec)) {
        nextTopBid = bid
      }
    }
    if (nextTopBid !== currentState.activeBid) {
      if (nextTopBid) {
        nextTopBid.active = true
      }
      if (currentState.activeBid?.active) {
        currentState.activeBid.active = false
      }
    }
    return {
      ...currentState,
      ethCollected,
      lastUpdate: now,
      activeBid: nextTopBid,
      bids: [...currentState.bids],
    }
  }

  const changeBid = (id: number, update: any, withUpdate?: boolean) =>
    setState((currentState: AuctionState) => {
      for (const i in currentState.bids) {
        const _state = withUpdate ? updateState(currentState) : currentState

        if (_state.bids[i].id === id) {
          const newBid = typeof update === 'function'
            ? update(state.bids[i])
            : { ...state.bids[i], ...update }

          _state.bids[i] = newBid

          const activeBid = _state.activeBid?.id === id
            ? newBid
            : _state.activeBid
          return { ..._state, activeBid }
        }
      }
      throw new Error(`Bid ${id} not found`)
    })

  return (
    <AuctionContext.Provider value={{
      ...state,
      async addBid(owner: string, text: string, gweiPerSec: number, deposit: number) {
        const id = nextId.current++;
        setState((currentState: AuctionState) => ({
          ...currentState,
          bids: [...currentState.bids, {
            id,
            owner,
            text,
            balance: deposit,
            gweiPerSec,
            approved: false,
            active: false,
          }],
        }))
        return id
      },
      
      async setBidApproval(id: number, approved: boolean) {
        changeBid(id, { approved })
      },

      async updateBid(id: number, gweiPerSec: number) {
        changeBid(id, { gweiPerSec }, true)
      },

      async deposit(id: number, ethToDeposit: number) {
        changeBid(id, (bid: Bid) => ({ ...bid, balance: bid.balance + ethToDeposit }), true)
      },

      async withdrawAll(id: number) {
        changeBid(id, { balance: 0 }, true)
      },

      async update() {
        setState(updateState)
      },
    }}>
      {children}
    </AuctionContext.Provider>
  )
}
