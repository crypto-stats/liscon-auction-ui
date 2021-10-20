import React, { Fragment } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { AccountsProvider } from './accounts'
import { AuctionProvider } from './auction'
import PlausibleProvider from 'next-plausible'

const Providers: React.FC<{ mode: 'memory' | 'testnet' }> = ({ children, mode }) => {
  const Web3Provider = mode === 'testnet' ? Web3ReactProvider : Fragment;

  return (
    <Web3Provider getLibrary={(provider: any) => new ethers.providers.Web3Provider(provider)}>
      <AccountsProvider mode={mode}>
        <AuctionProvider mode={mode}>
          <PlausibleProvider domain="stream.liscon.org">
            {children}
          </PlausibleProvider>
        </AuctionProvider>
      </AccountsProvider>
    </Web3Provider>
  );
};

export default Providers;
