import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 15%;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
`

const Logo = styled.div`
  background-image: url('/logo.svg');
  aspect-ratio: 7 / 5;
`

const Right = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`

const SponsorLogo = styled.div`
  aspect-ratio: 1;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: #e9e9e9;
  border-radius: 4px;
  background-position: center;
`

const RightText = styled.div`
  font-family: sans-serif;
  text-align: right;
  margin-right: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Title = styled.div`
  font-size: 24px;
`

const SubTitle = styled.div`
  font-size: 18px;
  color: #eee;
`

interface OverlayProps {
  text: string
  subtext: string | null
  image: string | null
}

const Overlay: React.FC<OverlayProps> = ({ text, subtext, image }) => {
  return (
    <Container>
      <Logo />
      <Right>
        <RightText>
          <Title>{text}</Title>
          {subtext && <SubTitle>{subtext}</SubTitle>}
        </RightText>

        {image && (
          <SponsorLogo style={{ backgroundImage: `url('${image}'` }} />
        )}
      </Right>
    </Container>
  );
};

export default Overlay;
