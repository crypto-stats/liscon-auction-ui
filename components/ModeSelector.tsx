import React from 'react'
import Button from './Button'
import styled from 'styled-components'
import Link from 'next/link'

const Container = styled.div`
  align-self: center;
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const ButtonTitle = styled.h3`
  margin: 10px 0;
`

const ModeSelector: React.FC = () => {
  return (
    <Container>
      <Link href='/sponsorship/testnet' passHref>
        <Button as="a">
          <ButtonTitle>Testnet</ButtonTitle>
          <div>Run the auction on the Kovan testnet</div>
        </Button>
      </Link>

      <Link href='/sponsorship/memory' passHref>
        <Button as="a">
          <ButtonTitle>Simulator</ButtonTitle>
          <div>Test the auction mechanism in your browser</div>
        </Button>
      </Link>
    </Container>
  );
};

export default ModeSelector;
