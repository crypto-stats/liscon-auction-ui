import React from 'react'
import VideoPlayer from './VideoPlayer'
import Overlay from './Overlay'
import { useAuction } from 'state/auction'

const VideoWithOverlay = () => {
  const { activeBid } = useAuction()

  return (
    <VideoPlayer>
      {activeBid && <Overlay>{activeBid.text}</Overlay>}
    </VideoPlayer>
  )
}

export default VideoWithOverlay
