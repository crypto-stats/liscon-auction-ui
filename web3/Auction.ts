import { AUCTION_ABI, WETH_ADAPTER_ABI } from './abis'
import { ethers, Contract } from 'ethers'

export const ARB_TESTNET = {
  AUCTION_ADDRESS: '0x582d2093452A0Cf9AB354Ae272aF4bAC507cb0ef',
  WETH_ADAPTER_ADDRESS: '0xef1C8F5A7Ae6A28552c74be6F40e7bf32Ae4f2F1',
  WETH_ADDRESS: '0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681',
}

export const KOVAN = {
  AUCTION_ADDRESS: '0xa4B04Dc866584f0FCdBC40a609f4E00feE76D07B',
  WETH_ADAPTER_ADDRESS: '0xD46B3322d018f27ff424CBb0cF3D8A151c2bc9f7',
  WETH_ADDRESS: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
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

  async ethCollected() {
    const paymentWei = await this.auctionContract.paymentCollected(KOVAN.WETH_ADDRESS)
    return ethers.utils.formatEther(paymentWei)
  }

  async owner() {
    const owner = await this.auctionContract.owner()
    return owner
  }

  async setBidApproval(id: string, approved: boolean) {
    const tx = await this.auctionContract.setApproved(id, approved)
    await tx.wait()
  }

  async updateBid(id: string, gweiPerBlock: string) {
    const weiPerBlock = ethers.utils.parseUnits(gweiPerBlock, 'gwei')
    const tx = await this.auctionContract.updateBid(id, KOVAN.WETH_ADDRESS, weiPerBlock)
    await tx.wait()
  }

  async deposit(id: string, ethToDeposit: string) {
    const tx = await this.wethAdapterContract.deposit(id, {
      value: ethers.utils.parseEther(ethToDeposit),
    })
    await tx.wait()
  }

  async withdrawAll(id: string) {
    const tx = await this.auctionContract.withdraw(
      id,
      ethers.utils.parseEther('99999999'), // If withdrawing more than balance, it will withdraw all
      await this.auctionContract.signer.getAddress(),
    )
    await tx.wait()
  }

  async lift(id: string) {
    const tx = await this.auctionContract.lift(id)
    await tx.wait()
  }

  async swap(inactiveId: string, activeId: string) {
    const tx = await this.auctionContract.swap(inactiveId, activeId)
    await tx.wait()
  }
}
