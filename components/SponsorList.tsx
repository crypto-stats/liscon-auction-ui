import React from 'react'
import styled from 'styled-components'
import { useAuction, Bid } from 'state/auction'
import BidRow from './BidRow'

const List = styled.ul`
  margin: 0;
`

const ListItem = styled.li`
  list-type: none;
  padding: 0;
`

interface SponsorListProps {
  unapproved?: boolean
}

const SponsorList: React.FC<SponsorListProps> = ({ unapproved }) => {
  const { bids } = useAuction()

  const _bids = bids
    .filter((bid: Bid) => bid.approved !== !!unapproved)
    .sort((a: Bid, b: Bid) => !b.balance !== !a.balance ? b.balance - a.balance : b.gweiPerSec - a.gweiPerSec)

  return (
    <List>
      {_bids.map((bid: Bid) => (
        <ListItem key={bid.id}>
          <BidRow bid={bid} />
        </ListItem>
      ))}
    </List>
  );
};

export default SponsorList
