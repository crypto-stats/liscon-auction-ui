import { useState, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import Auction, { ARB_TESTNET } from 'web3/Auction'
import { AuctionState, Bid } from './types'

const defaultState: AuctionState = {
  lastUpdate: 0,
  ethCollected: 0,
  activeBid: null,
  bids: [],
}

export const useChainAuction = () => {
  const { library } = useWeb3React()
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

  const getAuction = () => new Auction(library.getSigner(), ARB_TESTNET.AUCTION_ADDRESS, ARB_TESTNET.WETH_ADAPTER_ADDRESS)

  return {
    ...state,

    async addBid(owner: string, text: string, gweiPerSec: number, deposit: number) {
      const auction = getAuction()
      const id = await auction.createSponsor({
        campaign: 'liscon',
        gweiPerBlock: gweiPerSec.toString(),
        metadata: text,
        depositAmount: deposit.toString(),
      })

      setState((currentState: AuctionState) => {
        return {
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
        }
      })
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
  }
}
