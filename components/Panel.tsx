import React from 'react'
import styled from 'styled-components';

const Container = styled.div`
  margin: 4px;
  border: solid 1px white;
  border-radius: 4px;
`
const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const Title = styled.h3`
  font-size: 24px;
  padding: 4px;
  margin-bottom: 4px;
  border-bottom: solid 1px white;
`

const Content = styled.div`
  margin: 4px;
`

interface PanelProps {
  title?: string
  ButtonEl?: React.FC
}

const Panel: React.FC<PanelProps> = ({ children, title, ButtonEl }) => {
  return (
    <Container>
      <TitleWrapper>
        {title && <Title>{title}</Title>}
        {ButtonEl && <ButtonEl />}
      </TitleWrapper>

      <Content>
        {children}
      </Content>
    </Container> 
  );
};

export default Panel;
