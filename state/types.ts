export interface Bid {
  id: number
  owner: string
  text: string
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
}

export interface AuctionStateWithMethods extends AuctionState {
  addBid(owner: string, text: string, gweiPerSec: number, deposit: number): Promise<number>
  setBidApproval(id: number, approved: boolean): Promise<void>
  updateBid(id: number, gweiPerSec: number): Promise<void>
  deposit(id: number, eth: number): Promise<void>
  withdrawAll(id: number): Promise<void>
  update(): Promise<void>
}

export interface AccountsState {
  balances: { [address: string]: number }
  activeAccount: string
  status: string
}

export interface AccountsStateWithMethods extends AccountsState {
  activate(): Promise<void>
  switchChain(): Promise<void>
  transfer(from: string, to: string, amount: number): Promise<void>
  balanceOf(address: string): Promise<number>
}
