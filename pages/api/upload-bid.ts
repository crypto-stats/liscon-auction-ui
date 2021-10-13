import * as fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import pinataSDK from '@pinata/sdk'

const filePath = '/tmp/upload.txt';

async function saveToIPFS(file: string, name: string): Promise<string> {
  if (!process.env.PINATA_KEY || !process.env.PINATA_SECRET) {
    throw new Error('Pinata key missing')
  }

  const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET)
  fs.writeFileSync(filePath, file);
  const response = await pinata.pinFromFS(filePath, {
    pinataMetadata: {
      name,
      // @ts-ignore
      keyvalues: {
        type: 'bid',
      },
    },
  });

  return response.IpfsHash;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })
    return
  }

  const { text, subtext, image } = req.body

  const bidMetadata = JSON.stringify({ text, subtext, image })

  const cid = await saveToIPFS(bidMetadata, text)

  res.json({ success: true, cid })
}

export default handler
