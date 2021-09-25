import React, { useContext, useState, useRef } from 'react'

export interface Bid {
  id: number
  owner: string
  text: string
  approved: boolean
}

export interface AuctionState {
  activeBid: Bid | null
  bids: Bid[]
}

interface AuctionStateWithMethods extends AuctionState {
  addBid(owner: string, text: string): Promise<number>
  setBidApproval(id: number, approved: boolean): Promise<void>
}

const defaultState: AuctionState = {
  activeBid: null,
  bids: [],
}

const AuctionContext = React.createContext<AuctionStateWithMethods>({
  ...defaultState,
  async addBid() { throw new Error('Not initialized') },
  async setBidApproval() { throw new Error('Not initialized') },
});

export const useAuction = () => useContext(AuctionContext)

export const AuctionProvider: React.FC = ({ children }) => {
  const nextId = useRef(0)
  const [state, setState] = useState<AuctionState>(defaultState)

  return (
    <AuctionContext.Provider value={{
      ...state,
      async addBid(owner: string, text: string) {
        const id = nextId.current++;
        setState((currentState: AuctionState) => ({
          ...currentState,
          bids: [...currentState.bids, { id, owner, text, approved: false }],
        }))
        return id
      },
      async setBidApproval(id: number, approved: boolean) {
        for (const i in state.bids) {
          if (state.bids[i].id === id) {
            state.bids[i] = { ...state.bids[i], approved }
            setState({ ...state })
            return
          }
        }
        throw new Error(`Bid ${id} not found`)
      },
    }}>
      {children}
    </AuctionContext.Provider>
  )
}
