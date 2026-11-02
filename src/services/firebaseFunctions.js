import { getFunctions, httpsCallable } from 'firebase/functions'
import { firebaseApp } from './firebaseApp'

const functions = getFunctions(firebaseApp)

export async function sendContactMessage(message) {
  const submitContactMessage = httpsCallable(functions, 'submitContactMessage')
  const response = await submitContactMessage(message)
  return response.data
}
