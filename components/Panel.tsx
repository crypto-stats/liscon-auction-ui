import React from 'react'
import styled from 'styled-components';

const Container = styled.div`
  margin: 4px;
  border: solid 1px white;
  border-radius: 4px;
`

const Title = styled.h3`
  padding: 4px;
  margin-bottom: 4px;
  border-bottom: solid 1px white;
`

const Content = styled.div`
  margin: 4px;
`

interface PanelProps {
  title?: string
}

const Panel: React.FC<PanelProps> = ({ children, title }) => {
  return (
    <Container>
      {title && <Title>{title}</Title>}

      <Content>
        {children}
      </Content>
    </Container> 
  );
};

export default Panel;
