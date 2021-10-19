import { useState } from 'react'
import { AccountsState } from './types'

export const USER_ACCOUNT = '0x1111111111111111111111111111111111111111'
export const ADMIN_ACCOUNT = '0x2222222222222222222222222222222222222222'

const defaultState: AccountsState = {
  balances: {},
  activeAccount: USER_ACCOUNT,
  accountBalance: '0',
  status: 'ready',
}

export const useMemoryAccounts = () => {
  const [state, setState] = useState<AccountsState>(defaultState)

  return {
    ...state,

    async activate() {},
    async switchChain() {},

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

    async faucet() {},
  }
}
