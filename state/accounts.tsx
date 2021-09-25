import React, { useContext, useState } from 'react'

export const USER_ACCOUNT = '0x1111111111111111111111111111111111111111'
export const ADMIN_ACCOUNT = '0x2222222222222222222222222222222222222222'

export interface AccountsState {
  balances: { [address: string]: number }
  activeAccount: string
}

interface AccountsStateWithMethods extends AccountsState {
  transfer(from: string, to: string, amount: number): Promise<void>
  balanceOf(address: string): Promise<number>
}

const defaultState: AccountsState = {
  balances: {},
  activeAccount: USER_ACCOUNT,
}

const AuctionContext = React.createContext<AccountsStateWithMethods>({
  ...defaultState,
  async transfer() { throw new Error('Not initialized') },
  async balanceOf() { throw new Error('Not initialized') },
});

export const useAccounts = () => useContext(AuctionContext)

export const AccountsProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<AccountsState>(defaultState)

  return (
    <AuctionContext.Provider value={{
      ...state,
      async transfer(from: string, to: string, amount: number) {
        setState((currentState: AccountsState) => {
          if (currentState.balances[from] < amount) {
            throw new Error(`Can't transfer from ${from}: insufficent balance`)
          }

          return {
            ...currentState,
            balances: {
              ...currentState.balances,
              [from]: currentState.balances[from] - amount,
              [to]: currentState.balances[from] + amount,
            },
          }
        })
      },
      async balanceOf(account: string) {
        return state.balances[account] || 0
      },
    }}>
      {children}
    </AuctionContext.Provider>
  )
}
