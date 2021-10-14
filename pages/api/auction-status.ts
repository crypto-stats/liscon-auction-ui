import { NextApiRequest, NextApiResponse } from 'next'
import Auction, { KOVAN } from 'web3/Auction'
import { ethers } from 'ethers'

// const rpc = 'https://rinkeby.arbitrum.io/rpc'
const rpc = `https://kovan.infura.io/v3/${process.env.INFURA_KEY}`

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const provider = new ethers.providers.JsonRpcProvider(rpc)
  const signer = process.env.MNEMONIC
    ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC).connect(provider)
    : null
  const auction = new Auction(signer || provider, KOVAN.AUCTION_ADDRESS, KOVAN.WETH_ADAPTER_ADDRESS)

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
    const details = await auction.sponsorDetails(sponsor.id)

    let metadata = details.metadata
    if (metadata.indexOf('Qm') === 0) {
      const metadataRequest = await fetch(`https://ipfs.io/ipfs/${details.metadata}`)
      metadata = await metadataRequest.json()

      if (metadata.image) {
        const imageRequest = await fetch(`https://ipfs.io/ipfs/${metadata.image}`)
        const blob: any = await imageRequest.arrayBuffer()
        metadata.image = 'data:image/jpeg;base64,' + Buffer.from(blob, 'binary').toString('base64')
      }
    }

    const fullSponsor = {
      ...details,
      id: sponsor.id,
      metadata,
      currentBalance: parseInt(details.storedBalance),
    }

    if (details.active) {
      fullSponsor.currentBalance -= details.paymentPerBlock * ((Date.now() / 1000) - details.lastUpdated)
      fullSponsor.currentBalance = Math.max(fullSponsor.currentBalance, 0)
      activeSponsor = fullSponsor
    }

    if (details.approved
      && parseInt(details.paymentPerBlock) > topBidAmount
      && fullSponsor.currentBalance / 1e18 > 0.0001) {
      topBidAmount = parseInt(details.paymentPerBlock)
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

  const [ethCollected, owner] = await Promise.all([
    auction.ethCollected(),
    auction.owner(),
  ])

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=5, stale-while-revalidate');
  res.json({
    success: true,
    sponsors,
    ethCollected,
    owner,
  })
}

export default handler
