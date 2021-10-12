import React from 'react'
import styled from 'styled-components'
import YouTube from 'react-youtube'

const Container = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  width: 100%;
  max-width: 1000px;

  & .player-container {
    height: 100%;
  }
`

const Overlay = styled.div`
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
