import React from 'react'
import styled from 'styled-components'

const HeaderRow = styled.div`
  display: flex;
  height: auto;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 2rem 0;
  h1 {
    font-size: 36px;
    font-weight: 300;
    @media (max-width: 600px) {
      text-align: center;
    }
  }
`

const Logo = styled.div`
  background-image: url('/logo.svg');
  flex: 1;
  height: 64px;
  background-repeat: no-repeat;
  flex-basis: 100px;
  @media (max-width: 600px) {
    background-position: center;
  }
`

const Header: React.FC = ({ children }) => {
  return (
    <HeaderRow>
      <Logo />
      {children}
    </HeaderRow>
  )
}

export default Header
