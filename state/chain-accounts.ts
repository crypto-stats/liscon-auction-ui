import { useState } from 'react'
import { AccountsState } from './types'

const defaultState: AccountsState = {
  balances: {},
  activeAccount: '',
  active: false,
}

export const useChainAccounts = () => {
  const [state, setState] = useState<AccountsState>(defaultState)

  return {
    ...state,

    async activate() {},

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
  }
}