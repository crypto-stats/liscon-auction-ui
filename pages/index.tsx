import styled from 'styled-components'
import { AuctionProvider } from 'state/auction'
import Simulator from 'components/Simulator'

const Title = styled.h1`
  color: red;
  font-size: 50px;
`

export default function Home() {
  return (
    <AuctionProvider>
      <div>
        <Title>My page</Title>
        <Simulator />
      </div>
    </AuctionProvider>
  )
}
