import { NextApiRequest, NextApiResponse } from 'next'
import Auction, { NETWORK } from 'web3/Auction'
import { ethers } from 'ethers'

const rpc = 'https://rinkeby.arbitrum.io/rpc'
// const rpc = `https://kovan.infura.io/v3/${process.env.INFURA_KEY}`

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const provider = new ethers.providers.JsonRpcProvider(rpc)
  const signer = process.env.MNEMONIC
    ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC).connect(provider)
    : null
  const auction = new Auction(signer || provider, NETWORK.AUCTION_ADDRESS, NETWORK.WETH_ADAPTER_ADDRESS)

  const req = await fetch('https://api.thegraph.com/subgraphs/name/dmihal/sponsor-auction', {
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `{
        sponsors(where: {campaign: "0x6c6973636f6e00000000000000000000"}) {
          id
          paymentPerBlock
          owner
          metadata
          approved
          active
          storedBalance,
          lastUpdated
        }
        auctionGlobal(id: "${NETWORK.AUCTION_ADDRESS.toLowerCase()}") {
          owner
        }
        token(id: "${NETWORK.WETH_ADDRESS.toLowerCase()}") {
          totalCollected
          collectedBalance
        }
      }
      `,
      variables: {},
    }),
    method: 'POST',
  })
  const { data } = await req.json()

  let activeSponsor: any = null
  let topBidAmount = 0
  let topBid: any = null

  const sponsors = await Promise.all(data.sponsors.map(async (sponsor: any) => {
    let metadata = sponsor.metadata
    if (metadata.indexOf('Qm') === 0) {
      const metadataRequest = await fetch(`https://ipfs.io/ipfs/${sponsor.metadata}`)
      metadata = await metadataRequest.json()

      if (metadata.image) {
        const imageRequest = await fetch(`https://ipfs.io/ipfs/${metadata.image}`)
        const blob: any = await imageRequest.arrayBuffer()
        metadata.image = 'data:image/jpeg;base64,' + Buffer.from(blob, 'binary').toString('base64')
      }
    }

    const fullSponsor = {
      ...sponsor,
      id: sponsor.id,
      metadata,
      currentBalance: parseInt(sponsor.storedBalance),
    }

    if (sponsor.active) {
      fullSponsor.currentBalance -= sponsor.paymentPerBlock * ((Date.now() / 1000) - sponsor.lastUpdated)
      fullSponsor.currentBalance = Math.max(fullSponsor.currentBalance, 0)
      activeSponsor = fullSponsor
    }

    if (sponsor.approved
      && parseInt(sponsor.paymentPerBlock) > topBidAmount
      && fullSponsor.currentBalance / 1e18 > 0.0001) {
      topBidAmount = parseInt(sponsor.paymentPerBlock)
      topBid = fullSponsor
    }

    return fullSponsor
  }))

  if (signer) {
    if (topBid && !activeSponsor) {
      try {
        await auction.lift(topBid.id)
        console.log(`Lifted ${topBid.id}`)
        topBid.active = true
      } catch (e) {
        console.warn(`Failed to lift ${topBid.id}`, e)
      }
    } else if (topBid && activeSponsor && topBid !== activeSponsor) {
      try {
        await auction.swap(topBid.id, activeSponsor.id)
        console.log(`Swapped ${activeSponsor.id} for ${topBid.id}`)
        topBid.active = true
        activeSponsor.active = false
      } catch (e) {
        console.warn(`Failed to swap ${activeSponsor.id} for ${topBid.id}`, e)
      }
    }
  }

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=5, stale-while-revalidate');
  res.json({
    success: true,
    sponsors,
    ethCollected: data.token.totalCollected,
    ethBalance: data.token.collectedBalance,
    owner: data.auctionGlobal.owner,
  })
}

export default handler
