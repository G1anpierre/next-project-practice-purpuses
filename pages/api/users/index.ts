import type {NextApiRequest, NextApiResponse} from 'next'
import {users} from '../../../data/users'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(users)
  }
  return res.status(405).json({error: 'Method not allowed'})
}
