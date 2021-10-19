import React from 'react'
import styled from 'styled-components'
import Providers from 'state/Providers'
import OverlayWithContent from 'components/OverlayWithContent'

const Container = styled.main`
  background: black;
  flex: 1;
  align-self: stretch;
`

const AspectRatio = styled.section`
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: green;
`

export default function Home() {
  return (
    <Providers mode="testnet">
      <Container>
        <AspectRatio>
          <OverlayWithContent />
        </AspectRatio>
      </Container>
    </Providers>
  )
}
