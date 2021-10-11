import React from 'react'
import Button from './Button'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 300px;
  align-self: center;
  display: flex;
  flex-direction: column;
`

const ButtonTitle = styled.h3`
  margin: 10px;
`

interface ModeSelectorProps {
  onSelect: (mode: 'memory' | 'testnet') => void
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect }) => {
  return (
    <Container>
      <Button onClick={() => onSelect('memory')}>
        <ButtonTitle>Simulator</ButtonTitle>
        <div>Test the auction mechanism in your browser</div>
      </Button>

      <Button onClick={() => onSelect('testnet')}>
        <ButtonTitle>Testnet</ButtonTitle>
        <div>Run the auction on the Arbitrum testnet</div>
      </Button>
    </Container>
  );
};

export default ModeSelector;
