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
`

const RightText = styled.div`
  text-align: right;
  margin-right: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
          <div>{text}</div>
          {subtext && <div>{subtext}</div>}
        </RightText>

        {image && (
          <SponsorLogo style={{ backgroundImage: `url('${image}'` }} />
        )}
      </Right>
    </Container>
  );
};

export default Overlay;
