import React, { useState } from 'react'
import { useAuction } from 'state/auction'

const SponsorList: React.FC = () => {
  const [text, setText] = useState('')
  const { addBid } = useAuction()

  const submit = async () => {
    await addBid('', text)
    setText('')
  }

  return (
    <div>
      <input value={text} onChange={(e: any) => setText(e.target.value)} />
      <button onClick={submit}>Submit</button>
    </div>
  );
};

export default SponsorList
