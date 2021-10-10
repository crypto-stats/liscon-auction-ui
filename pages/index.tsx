import React, { useState, Fragment } from 'react'
import styled from 'styled-components'
import Providers from 'state/Providers'
import Header from 'components/Header'
import ModeSelector from 'components/ModeSelector'
import Simulator from 'components/Simulator'

const Title = styled.h1`
  color: #eeeeee;
  font-size: 30px;
  margin: 4px 0 8px;
`

const Narrow = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  align-self: center;
`

export default function Home() {
  const [mode, setMode] = useState<'memory' | 'testnet' | null>(null)

  if (!mode) {
    return (
      <Narrow>
        <Header>LisCon Live Stream</Header>

        <ModeSelector onSelect={setMode} />
      </Narrow>
    )
  }

  return (
    <Providers mode={mode}>
      <Title>LisCon Stream Sponsorship</Title>
      <Simulator />
    </Providers>
  )
}
