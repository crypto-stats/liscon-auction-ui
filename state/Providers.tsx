import React from 'react'
import { AccountsProvider } from './accounts'
import { AuctionProvider } from './auction'

const Providers: React.FC = ({ children }) => {
  return (
    <AccountsProvider>
      <AuctionProvider>
        {children}
      </AuctionProvider>
    </AccountsProvider>
  );
};

export default Providers;
