import { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import crypto from 'node:crypto'

export async function transactionRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const body = createTransactionBodySchema.parse(request.body)

    const { title, amount, type } = body

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    reply.status(201).send()
  })
}
