import { createHash } from 'node:crypto'
import { initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'
import { defineSecret, defineString } from 'firebase-functions/params'
import { HttpsError, onCall } from 'firebase-functions/v2/https'

initializeApp()

const db = getFirestore()
const resendApiKey = defineSecret('RESEND_API_KEY')
const contactFromEmail = defineString('CONTACT_FROM_EMAIL')
const contactToEmail = defineString('CONTACT_TO_EMAIL')
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const rateLimitWindowMs = 60 * 60 * 1000
const maxMessagesPerWindow = 5

function validateMessage(data) {
  const name = typeof data?.name === 'string' ? data.name.trim() : ''
  const email = typeof data?.email === 'string' ? data.email.trim() : ''
  const message = typeof data?.message === 'string' ? data.message.trim() : ''

  if (!name || name.length > 120) {
    throw new HttpsError('invalid-argument', 'Informe um nome com até 120 caracteres.')
  }
  if (!emailPattern.test(email) || email.length > 254) {
    throw new HttpsError('invalid-argument', 'Informe um e-mail válido.')
  }
  if (message.length < 20 || message.length > 5000) {
    throw new HttpsError('invalid-argument', 'A mensagem deve ter entre 20 e 5000 caracteres.')
  }

  return { name, email, message }
}

async function applyContactRateLimit(ipAddress) {
  const identifier = createHash('sha256')
    .update(ipAddress)
    .digest('hex')
  const rateLimitReference = db.collection('contactRateLimits').doc(identifier)

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(rateLimitReference)
    const now = Date.now()
    const previous = snapshot.exists ? snapshot.data() : null
    const windowExpired = !previous || now - previous.windowStartedAt >= rateLimitWindowMs
    const count = windowExpired ? 0 : previous.count

    if (count >= maxMessagesPerWindow) {
      throw new HttpsError('resource-exhausted', 'Limite de mensagens atingido. Tente novamente mais tarde.')
    }

    transaction.set(rateLimitReference, {
      count: count + 1,
      windowStartedAt: windowExpired ? now : previous.windowStartedAt,
      expiresAt: Timestamp.fromMillis(now + 48 * rateLimitWindowMs),
    })
  })
}

export const submitContactMessage = onCall(
  {
    secrets: [resendApiKey],
    maxInstances: 3,
  },
  async (request) => {
    const message = validateMessage(request.data)
    if (!resendApiKey.value() || !contactFromEmail.value() || !contactToEmail.value()) {
      throw new HttpsError('failed-precondition', 'O serviço de e-mail ainda não está configurado.')
    }

    await applyContactRateLimit(request.rawRequest.ip || 'unknown')
    const messageReference = await db.collection('messages').add({
      ...message,
      createdAt: FieldValue.serverTimestamp(),
      answered: false,
      emailStatus: 'pending',
    })

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey.value()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: contactFromEmail.value(),
          to: [contactToEmail.value()],
          reply_to: message.email,
          subject: 'Novo contato recebido pelo portfólio',
          text: `Nome: ${message.name}\nE-mail: ${message.email}\n\n${message.message}`,
        }),
      })

      if (!response.ok) {
        throw new Error(`O provedor de e-mail respondeu com HTTP ${response.status}.`)
      }

      await messageReference.update({ emailStatus: 'sent' })
      return { emailSent: true }
    } catch (error) {
      logger.error('Contato salvo, mas o e-mail não foi enviado.', {
        messageId: messageReference.id,
        error,
      })
      await messageReference.update({ emailStatus: 'failed' })
      return { emailSent: false }
    }
  },
)
