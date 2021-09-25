import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 15%;
  background: #333;
  color: white;
  padding: 10px;
  margin-bottom: 20px;
`

const Overlay: React.FC = ({ children }) => {
  return (
    <Container>
      {children}
    </Container>
  );
};

export default Overlay;
