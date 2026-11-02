export function validateContact(values) {
  const errors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const message = values.message.trim()

  if (!name) errors.name = 'Informe seu nome.'
  if (!email) {
    errors.email = 'Informe seu e-mail.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Informe um e-mail válido.'
  }
  if (message.length < 20) {
    errors.message = 'A mensagem precisa ter no mínimo 20 caracteres.'
  }

  return errors
}
