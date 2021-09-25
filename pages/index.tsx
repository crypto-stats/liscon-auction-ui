import styled from 'styled-components'
import { AuctionProvider } from 'state/auction'
import SponsorForm from 'components/SponsorForm'
import SponsorList from 'components/SponsorList'
import VideoPlayer from 'components/VideoPlayer'

const Title = styled.h1`
  color: red;
  font-size: 50px;
`

export default function Home() {
  return (
    <AuctionProvider>
      <div>
        <Title>My page</Title>
        <SponsorList />
        <SponsorForm />
        <VideoPlayer />
      </div>
    </AuctionProvider>
  )
}
