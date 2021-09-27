import { useState } from 'react'
import { AccountsState } from './types'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

const ARB_TESTNET_CHAIN_ID = 421611

const defaultState: AccountsState = {
  balances: {},
  activeAccount: '',
  status: 'inactive',
}

export const useChainAccounts = () => {
  const { activate, active, chainId, library } = useWeb3React()
  const [state, setState] = useState<AccountsState>(defaultState)

  let status = 'ready'
  if (!active) {
    status = 'inactive'
  } else if (chainId !== ARB_TESTNET_CHAIN_ID) {
    status = 'wrong-chain'
  }

  return {
    ...state,
    status,

    async activate() {
      const injected = new InjectedConnector({})
      await activate(injected)
      setState({ ...state, status: 'ready' })
    },

    async switchChain() {
      try {
        await library.send('wallet_switchEthereumChain', [{ chainId: `0x${ARB_TESTNET_CHAIN_ID.toString(16)}` }])
      } catch (error: any) {
        // This error code indicates that the chain has not been added to MetaMask
        // if it is not, then install it into the user MetaMask
        if (error.code === 4902) {
          try {
            await library.send('wallet_addEthereumChain', [{
              chainId: `0x${ARB_TESTNET_CHAIN_ID.toString(16)}`,
              chainName: 'Arbitrum Testnet',
              rpcUrl: 'https://rinkeby.arbitrum.io/rpc',
              blockExplorerUrl: 'https://rinkeby-explorer.arbitrum.io/#/',
            }])
          } catch (addError) {
            console.error(addError);
          }
        }
        console.error(error);
      }
    },

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