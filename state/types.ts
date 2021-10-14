export interface Bid {
  id: string
  owner: string
  text: string
  subtext: string | null
  image: string | null
  gweiPerSec: number
  balance: number
  approved: boolean
  active: boolean
}

export interface AuctionState {
  lastUpdate: number
  ethCollected: number
  activeBid: Bid | null
  bids: Bid[]
  owner: string | null
}

export interface AuctionStateWithMethods extends AuctionState {
  addBid(owner: string, text: string, subtext: string, gweiPerSec: number, deposit: number, image: File | null): Promise<string>
  setBidApproval(id: string, approved: boolean): Promise<void>
  updateBid(id: string, gweiPerSec: number): Promise<void>
  deposit(id: string, eth: number): Promise<void>
  withdrawAll(id: string): Promise<void>
  update(): Promise<void>
}

export interface AccountsState {
  balances: { [address: string]: number }
  activeAccount: string | null
  status: string
}

export interface AccountsStateWithMethods extends AccountsState {
  activate(): Promise<void>
  switchChain(): Promise<void>
  transfer(from: string, to: string, amount: number): Promise<void>
  balanceOf(address: string): Promise<number>
}
