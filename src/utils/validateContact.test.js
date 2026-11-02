import { describe, expect, it } from 'vitest'
import { validateContact } from './validateContact'

describe('validateContact', () => {
  it('reports a required name, invalid email, and short message', () => {
    expect(validateContact({
      name: '',
      email: 'email-invalido',
      message: 'Curta',
    })).toEqual({
      name: 'Informe seu nome.',
      email: 'Informe um e-mail válido.',
      message: 'A mensagem precisa ter no mínimo 20 caracteres.',
    })
  })

  it('accepts a complete valid message', () => {
    expect(validateContact({
      name: 'Ana',
      email: 'ana@example.com',
      message: 'Olá, gostaria de conversar sobre seu trabalho.',
    })).toEqual({})
  })
})
