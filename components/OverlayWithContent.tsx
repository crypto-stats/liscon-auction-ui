import React from 'react'
import Overlay from './Overlay'
import { useAuction } from 'state/auction'

const OverlayWithContent = () => {
  const { activeBid } = useAuction()

  if (!activeBid) {
    return null
  }

  return (
    <Overlay
      text={activeBid.text}
      subtext={activeBid.subtext}
      image={activeBid.image}
    />
  )
}

export default OverlayWithContent
