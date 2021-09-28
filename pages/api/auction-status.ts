import { NextApiRequest, NextApiResponse } from 'next'
import Auction, { ARB_TESTNET } from 'web3/Auction'
import { ethers } from 'ethers'

const rpc = 'https://rinkeby.arbitrum.io/rpc'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const provider = new ethers.providers.JsonRpcProvider(rpc)
  const auction = new Auction(provider, ARB_TESTNET.AUCTION_ADDRESS, ARB_TESTNET.WETH_ADAPTER_ADDRESS)

  const req = await fetch('https://api.thegraph.com/subgraphs/id/QmRvcDgKJkoMiaRQr8LHjMZxr5BmoNp2wUcbyvgkh265hL', {
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

  const sponsors = await Promise.all(data.sponsors.map(async (sponsor: any) => {
    const details = auction.sponsorDetails(sponsor.id)
    return details
  }))

  res.setHeader('Cache-Control', 'max-age=0, s-maxage=5, stale-while-revalidate');
  res.json({
    success: true,
    sponsors,
    // total,
    // totalUSD,
    // yesterday,
    // yesterdayUSD,
    // block,
  })
}

export default handler
