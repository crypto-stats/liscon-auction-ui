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
  activeBid: Bid | null
  bids: Bid[]
}

interface AuctionStateWithMethods extends AuctionState {
  addBid(owner: string, text: string, gweiPerSec: number, deposit: number): Promise<number>
  setBidApproval(id: number, approved: boolean): Promise<void>
  update(): Promise<void>
}

const defaultState: AuctionState = {
  lastUpdate: 0,
  activeBid: null,
  bids: [],
}

const AuctionContext = React.createContext<AuctionStateWithMethods>({
  ...defaultState,
  async addBid() { throw new Error('Not initialized') },
  async setBidApproval() { throw new Error('Not initialized') },
  async update() { throw new Error('Not initialized') },
});

export const useAuction = () => useContext(AuctionContext)

export const AuctionProvider: React.FC = ({ children }) => {
  const nextId = useRef(0)
  const [state, setState] = useState<AuctionState>(defaultState)

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
        for (const i in state.bids) {
          if (state.bids[i].id === id) {
            state.bids[i] = { ...state.bids[i], approved }
            const activeBid = state.activeBid?.id === id ? state.bids[i] : state.activeBid
            setState({ ...state, activeBid })
            return
          }
        }
        throw new Error(`Bid ${id} not found`)
      },
      async update() {
        setState((currentState: AuctionState) => {
          let nextTopBid = currentState.activeBid

          if (nextTopBid && !nextTopBid.approved) {
            nextTopBid = null
          }

          for (const bid of currentState.bids) {
            if (bid.approved && (!nextTopBid || bid.gweiPerSec > nextTopBid.gweiPerSec)) {
              nextTopBid = bid
            }
          }
          if (nextTopBid !== currentState.activeBid) {
            if (nextTopBid) {
              nextTopBid.active = true
            }
            if (currentState.activeBid) {
              currentState.activeBid.active = false
            }

            return {
              ...currentState,
              activeBid: nextTopBid,
              bids: [...currentState.bids],
            }
          }
          return currentState
        })
      },
    }}>
      {children}
    </AuctionContext.Provider>
  )
}
