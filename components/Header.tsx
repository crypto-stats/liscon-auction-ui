import React from 'react'
import styled from 'styled-components'

const HeaderRow = styled.div`
  display: flex;
  height: 64px;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  padding: 2rem 0;
  h1 {
    font-size: 36px;
    font-weight: 300;
  }
`

const Logo = styled.div`
  background-image: url('/logo.svg');
  flex: 1;
  background-repeat: no-repeat;
  height: 100%;
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
