import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 15%;
  background-image: linear-gradient(0, black, transparent);
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

const Overlay: React.FC = ({ children }) => {
  return (
    <Container>
      <Logo />
      <Right>
        <RightText>
          {children}
        </RightText>

        <SponsorLogo style={{
          backgroundImage: `url('https://usethebitcoin.com/wp-content/uploads/2018/03/CoinGecko.png'`
        }} />
      </Right>
    </Container>
  );
};

export default Overlay;
