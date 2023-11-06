import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { method, body, endpoint } = req.body;

      const mock = await prisma.mock.create({
        data: {
          endpoint,
          method: method.toUpperCase(),
          body: body,
        },
      });

      res.status(200).json({ mockEndpoint: mock.endpoint, mockId: mock.id });
    } catch (error) {
      res.status(400).json({ error: 'Failed to create mock endpoint' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
