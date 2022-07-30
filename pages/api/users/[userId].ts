// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {users} from '../../../data/users'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const userId = req.query.userId
    const user = users.find(user => user.id === Number(userId))
    if (!user) {
      res.status(404).json({error: 'User not Found'})
    }
    res.status(200).json({user})
  }

  return res.status(405).json({error: 'Method not allowed'})
  // res.status(200).json({ name: 'John Doe' })
}
