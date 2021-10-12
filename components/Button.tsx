import styled from 'styled-components'

interface Props {
  cancel?: boolean
}

const Button = styled.button<Props>`
  background: ${props => props.cancel ? "#F2E5BE" : "#EBBF41"};
  border-radius: 5px;
  font-family: 'Neue Machina';
  font-size: 1rem;
  border: none;
  padding: 12px 20px;
  margin: 1rem 0;
  &:hover {
    cursor: pointer;
  }
`

export default Button
