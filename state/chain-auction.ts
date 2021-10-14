import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import Auction, { KOVAN } from 'web3/Auction'
import { AuctionState, /*Bid*/ } from './types'

const defaultState: AuctionState = {
  lastUpdate: 0,
  ethCollected: 0,
  activeBid: null,
  bids: [],
  owner: null,
}

export const useChainAuction = () => {
  const { library, account } = useWeb3React()
  const [state, setState] = useState<AuctionState>(defaultState)

  const updateBids = async () => {
    const req = await fetch('/api/auction-status')
    const json = await req.json()

    const now = Date.now() / 1000
    const bids = json.sponsors.map((sponsor: any) => ({
      id: sponsor.id,
      owner: sponsor.owner,
      text: typeof sponsor.metadata === 'string' ? sponsor.metadata : sponsor.metadata.text,
      subtext: typeof sponsor.metadata === 'string' ? null : sponsor.metadata.subtext,
      image: typeof sponsor.metadata === 'string' ? null : sponsor.metadata.image,
      balance: sponsor.active
        ? (sponsor.storedBalance - (sponsor.paymentPerBlock * (now - sponsor.lastUpdated))) / 1e18
        : sponsor.storedBalance / 1e18,
      gweiPerSec: sponsor.paymentPerBlock / 1e9,
      approved: sponsor.approved,
      active: sponsor.active,
    }))

    const [activeBid] = bids.filter((bid: any) => bid.active)

    setState((currentState: AuctionState) => ({
      ...currentState,
      bids,
      owner: json.owner,
      ethCollected: parseFloat(json.ethCollected),
      activeBid: activeBid || null,
    }))
  }

  useEffect(() => {
    updateBids()
  }, [])

  const getAuction = () => new Auction(library.getSigner(), KOVAN.AUCTION_ADDRESS, KOVAN.WETH_ADAPTER_ADDRESS)

  return {
    ...state,

    async addBid(
      owner: string,
      text: string,
      subtext: string,
      gweiPerSec: number,
      deposit: number,
      image: File | null
    ) {
      let imageCid: string | null = null
      if (image) {
        const req = await fetch('/api/upload-image', {
          method: 'POST',
          body: image,
          headers: {
            type: image.type,
            name: image.name,
          },
        })
        const { cid } = await req.json()
        imageCid = cid
      }

      const metadataUpload = await fetch('/api/upload-bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, subtext, image: imageCid })
      })
      const { cid } = await metadataUpload.json()

      const auction = getAuction()
      const id = await auction.createSponsor({
        campaign: 'liscon',
        gweiPerBlock: gweiPerSec.toString(),
        metadata: cid,
        depositAmount: deposit.toString(),
      })

      setState((currentState: AuctionState) => {
        return {
          ...currentState,
          bids: [...currentState.bids, {
            id,
            owner: account!,
            text,
            subtext,
            balance: deposit,
            gweiPerSec,
            approved: false,
            active: false,
            image: null, // TODO base64
          }],
        }
      })
      return id
    },

    async setBidApproval(id: string, approved: boolean) {
      const auction = getAuction()
      await auction.setBidApproval(id, approved)
      await updateBids()
    },

    async updateBid(id: string, gweiPerSec: number) {
      const auction = getAuction()
      await auction.updateBid(id, gweiPerSec.toString())
      await updateBids()
    },

    async deposit(id: string, ethToDeposit: number) {
      const auction = getAuction()
      await auction.deposit(id, ethToDeposit.toString())
      await updateBids()
    },

    async withdrawAll(id: string) {
      const auction = getAuction()
      await auction.withdrawAll(id)
      await updateBids()
    },

    async update() {
      await updateBids()
    },
  }
}
