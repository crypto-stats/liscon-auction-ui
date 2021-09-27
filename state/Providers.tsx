import React, { Fragment } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
// import { InjectedConnector } from '@web3-react/injected-connector'
import { ethers } from 'ethers'
import { AccountsProvider } from './accounts'
import { AuctionProvider } from './auction'

// const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })

const Providers: React.FC<{ mode: 'memory' | 'testnet' }> = ({ children, mode }) => {
  const Web3Provider = mode === 'testnet' ? Web3ReactProvider : Fragment;

  return (
    <AccountsProvider mode={mode}>
      <AuctionProvider mode={mode}>
        <Web3Provider getLibrary={(provider: any) => new ethers.providers.Web3Provider(provider)}>
          {children}
        </Web3Provider>
      </AuctionProvider>
    </AccountsProvider>
  );
};

export default Providers;
