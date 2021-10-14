import React from 'react'
import styled from 'styled-components'
import { Bid } from 'state/auction'
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
  bids: Bid[]
}

const SponsorList: React.FC<SponsorListProps> = ({ bids }) => {
  return (
    <List>
      {bids.map((bid: Bid, i: number) => (
        <ListItem key={bid.id}>
          <BidRow bid={bid} num={i + 1} />
        </ListItem>
      ))}
    </List>
  );
};

export default SponsorList
