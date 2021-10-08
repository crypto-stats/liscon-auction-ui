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

    if (details.active) {
      activeSponsor = sponsor
    }

    if (parseInt(details.paymentPerBlock) > topBidAmount && details.storedBalance !== '0') {
      topBidAmount = parseInt(details.paymentPerBlock)
      topBid = sponsor
    }

    return { id: sponsor.id, ...details }
  }))

  if (signer) {
    if (topBid && !activeSponsor) {
      await auction.lift(topBid.id)
      console.log(`Lifted ${topBid.id}`)
      topBid.active = true
    } else if (topBid && activeSponsor && topBid !== activeSponsor) {
      await auction.swap(topBid.id, activeSponsor.id)
      console.log(`Swapped ${activeSponsor.id} for ${topBid.id}`)
      topBid.active = true
      activeSponsor.active = false
    }
  }

  const ethCollected = await auction.ethCollected()

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=5, stale-while-revalidate');
  res.json({
    success: true,
    sponsors,
    ethCollected,
    // total,
    // totalUSD,
    // yesterday,
    // yesterdayUSD,
    // block,
  })
}

export default handler
