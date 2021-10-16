import { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'

const rpc = 'https://rinkeby.arbitrum.io/rpc'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'must POST' })
  }

  if (!req.body?.address) {
    return res.status(400).json({ error: 'must send address' })
  }

  if (!process.env.MNEMONIC) {
    return res.status(400).json({ error: 'no server account' })
  }

  const provider = new ethers.providers.JsonRpcProvider(rpc)
  const signer = ethers.Wallet.fromMnemonic(process.env.MNEMONIC).connect(provider)

  const balance = await signer.getBalance()

  if (balance.lt(ethers.utils.parseEther('0.2'))) {
    return res.status(400).json({ error: 'Balance too low' })
  }

  const tx = await signer.sendTransaction({
    to: req.body.address,
    value: ethers.utils.parseEther('0.1'),
  })

  res.json({
    success: true,
    tx: tx.hash,
  })
}

export default handler
