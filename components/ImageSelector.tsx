import React, { useRef, useState, useEffect, Fragment } from 'react'
import styled from 'styled-components'

const Thumbnail = styled.div`
  position: relative;
  height: 100px;
  width: 100px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`

const Close = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 15px;
  height: 15px;
  width: 16px;
  height: 16px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center
`

interface ImageSelectorProps {
  value: File | null
  onChange: (file: File | null) => void
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ value, onChange }) => {
  const hiddenFileInput = useRef<HTMLInputElement | null>(null)
  const [imgUrl, setImgUrl] = useState('')

  useEffect(() => {
    setImgUrl('')
    if (value) {
      const reader = new FileReader();
      reader.readAsDataURL(value);
      reader.onload = () => setImgUrl(reader.result as string);
    }
  }, [value])

  return (
    <div>
      {value ? (
        <Thumbnail style={{ backgroundImage: `url('${imgUrl}')` }} >
          <Close onClick={() => onChange(null)}>&times;</Close>
        </Thumbnail>
      ) : (
        <Fragment>
          <button onClick={() => hiddenFileInput.current!.click()}>
            Upload a file
          </button>
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={(event: any) => onChange(event.target.files[0])}
            style={{ display: 'none' }}
          />
        </Fragment>
      )}
    </div>
  )
}

export default ImageSelector
