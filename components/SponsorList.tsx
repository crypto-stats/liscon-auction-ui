import React from 'react'
import styled from 'styled-components'
import { useAuction, Bid } from 'state/auction'
import BidRow from './BidRow'

const List = styled.ol`
  margin: 0;
  padding: 0;
`

const ListItem = styled.li`
  list-style: none;
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
      {_bids.map((bid: Bid, i: number) => (
        <ListItem key={bid.id}>
          <BidRow bid={bid} num={i + 1} />
        </ListItem>
      ))}
    </List>
  );
};

export default SponsorList
