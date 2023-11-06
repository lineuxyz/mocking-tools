import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const mockId = req.query.id as string

  if (req.method === 'GET') {
    const mock = await prisma.mock.findUnique({
      where: { id: mockId },
    })
    if (mock) {
      res.status(200).json(mock.body)
    } else {
      res.status(404).json({ error: 'Objeto não encontrado.' })
    }
  } else if (req.method === 'PUT') {
    return res.status(404).json({ error: '🏗 em construção' })
    const { body } = req.body
    try {
      const mock = await prisma.mock.update({
        where: { id: mockId },
        data: { body },
      })
      res.status(200).json(mock.body)
    } catch (error) {
      res.status(404).json({ error: 'Objeto não encontrado ou erro na atualização.' })
    }
  } else if (req.method === 'DELETE') {
    return res.status(404).json({ error: '🏗 em construção' })
    try {
      await prisma.mock.delete({
        where: { id: mockId },
      })
      res.status(204).end()
    } catch (error) {
      res.status(404).json({ error: 'Objeto não encontrado ou erro na deleção.' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Método ${req.method} Não Permitido`)
  }
}
