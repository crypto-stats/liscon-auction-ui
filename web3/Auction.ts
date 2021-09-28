import { AUCTION_ABI, WETH_ADAPTER_ABI } from './abis'
import { ethers, Contract } from 'ethers'

export const ARB_TESTNET = {
  AUCTION_ADDRESS: '0x205c7ba994Fb43b11d35f13495C19204e1712de9',
  WETH_ADAPTER_ADDRESS: '0x0edA9ee4eAd2c5CB5A5C7CD1728B3014F3Fe7c55',
}

export default class Auction {
  private auctionContract: Contract;
  private wethAdapterContract: Contract;

  constructor(provider: any, auctionAddress: string, wethAdapterAddress: string) {
    this.auctionContract = new ethers.Contract(auctionAddress, AUCTION_ABI, provider);
    this.wethAdapterContract = new ethers.Contract(wethAdapterAddress, WETH_ADAPTER_ABI, provider);
  }

  async createSponsor({
    campaign,
    gweiPerBlock,
    metadata,
    depositAmount
  }: {
    campaign: string
    gweiPerBlock: string
    metadata: string
    depositAmount: string
  }) {
    const campaignId = ethers.utils.formatBytes32String(campaign).substr(0, 34)
    const weiPerBlock = ethers.utils.parseUnits(gweiPerBlock, 'gwei')
    const tx = await this.wethAdapterContract.createSponsor(campaignId, weiPerBlock, metadata, {
      value: ethers.utils.parseEther(depositAmount),
    })

    const { logs } = await tx.wait()
    const newSponsorEvent = this.auctionContract.interface.parseLog(logs[4])
    const { sponsor: id } = newSponsorEvent.args
    return id
  }

  async sponsorDetails(id: string) {
    const [details, balance] = await Promise.all([
      this.auctionContract.getSponsor(id),
      this.auctionContract.sponsorBalance(id),
    ])

    return {
      owner: details.owner,
      approved: details.approved,
      active: details.active,
      token: details.token,
      paymentPerBlock: details.paymentPerBlock.toString(),
      campaign: details.campaign,
      lastUpdated: details.lastUpdated,
      metadata: details.metadata,
      storedBalance: balance.storedBalance.toString(),
    }
  }
}
