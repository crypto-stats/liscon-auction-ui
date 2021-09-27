import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 300px;
  align-self: center;
  display: flex;
  flex-direction: column;
`

const ModeButton = styled.button`
  display: block;
  margin: 10px;
`

interface ModeSelectorProps {
  onSelect: (mode: 'memory' | 'testnet') => void
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect }) => {
  return (
    <Container>
      <ModeButton onClick={() => onSelect('memory')}>
        <div>Simulator</div>
        <div>Test the auction mechanism in your browser</div>
      </ModeButton>

      <ModeButton onClick={() => onSelect('testnet')}>
        <div>Testnet</div>
        <div>Run the auction on the Arbitrum testnet</div>
      </ModeButton>
    </Container>
  );
};

export default ModeSelector;
