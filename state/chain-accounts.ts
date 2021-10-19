import { useState, useEffect } from 'react'
import { AccountsState } from './types'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ethers } from 'ethers'

// const ARB_TESTNET_CHAIN_ID = 421611
const ARB_CHAIN_ID = 42161
// const KOVAN_CHAIN_ID = 42

const defaultState: AccountsState = {
  balances: {},
  activeAccount: null,
  accountBalance: '0',
  status: 'inactive',
}

export const useChainAccounts = () => {
  const { activate, active, chainId, library, account } = useWeb3React()
  const [state, setState] = useState<AccountsState>(defaultState)

  let status = 'ready'
  if (!active) {
    status = 'inactive'
  } else if (chainId !== ARB_CHAIN_ID) {
    status = 'wrong-chain'
  }

  useEffect(() => {
    let timeout: any = null
    const refreshBalance = async () => {
      try {
        const balance = await library.getBalance(account)
        setState((currentState: AccountsState) => ({
          ...currentState,
          accountBalance: ethers.utils.formatEther(balance),
        }))
      } catch (e) {}
      timeout = setTimeout(refreshBalance, 5000)
    }

    if (status === 'ready') {
      refreshBalance()
    }

    return () => timeout && clearTimeout(timeout)
  }, [status, account])

  return {
    ...state,
    status,
    activeAccount: account || null,

    async activate() {
      const injected = new InjectedConnector({})
      await activate(injected)
      setState({ ...state, status: 'ready' })
    },

    async switchChain() {
      try {
        await library.send('wallet_switchEthereumChain', [{ chainId: `0x${ARB_CHAIN_ID.toString(16)}` }])
      } catch (error: any) {
        // This error code indicates that the chain has not been added to MetaMask
        // if it is not, then install it into the user MetaMask
        if (error.code === 4902) {
          try {
            await library.send('wallet_addEthereumChain', [{
              chainId: `0x${ARB_CHAIN_ID.toString(16)}`,
              chainName: 'Arbitrum',
              rpcUrls: ['https://arb1.arbitrum.io/rpc'],
              blockExplorerUrls: ['https://arbiscan.io/'],
              nativeCurrency: {
                name: "Arbitrum ETH",
                symbol: "ETH",
                decimals: 18,
              }
            }])
          } catch (addError) {
            console.error(addError);
          }
        }
        console.error(error);
      }
    },

    async transfer() {},

    async balanceOf(account: string) {
      return state.balances[account] || 0
    },

    async faucet() {
      const req = await fetch('/api/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: account }),
      })
      await req.json()
    },
  }
}