import React from 'react'
import styled from 'styled-components'
import YouTube from 'react-youtube'

const Container = styled.div`
  max-height: 500px;
  min-height: 200px;
  position: relative;
  flex: 1;

  & .player-container {
    height: 100%;
  }
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const VideoPlayer: React.FC = ({ children }) => {
  return (
    <Container>
      <Overlay>{children}</Overlay>
      <YouTube
        videoId="AdUw5RdyZxI"
        containerClassName="player-container"
        opts={{
          height: '100%',
          width: '100%',
          playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
          },
        }}
        onReady={(e: any) => e.target.mute()} 
      />
    </Container>
  );
};

export default VideoPlayer;
