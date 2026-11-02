import { useState } from 'react'
import { usePortfolio } from '../hooks/usePortfolio'
import { validateContact } from '../utils/validateContact'

function ContactSection() {
  const { addMessage, firebaseConfigured } = usePortfolio()
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [emailDraft, setEmailDraft] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setFeedback('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateContact(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setFeedback('Confira os campos indicados.')
      return
    }

    setSending(true)
    try {
      const result = await addMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      })
      setEmailDraft(values)
      setValues({ name: '', email: '', message: '' })
      if (!firebaseConfigured) {
        setFeedback('Mensagem registrada neste navegador. Configure o Firebase para enviar e salvar na nuvem.')
      } else if (result.emailSent) {
        setFeedback('Mensagem enviada por e-mail e salva no dashboard.')
      } else {
        setFeedback('Mensagem salva no dashboard, mas o e-mail não foi enviado. Verifique a configuração do serviço.')
      }
    } catch (error) {
      console.error('Não foi possível registrar a mensagem.', error)
      if (error.code === 'functions/resource-exhausted') {
        setFeedback('Limite de envios atingido. Tente novamente mais tarde.')
      } else if (error.code === 'functions/failed-precondition') {
        setFeedback('O serviço de e-mail ainda não está configurado.')
      } else {
        setFeedback('Não foi possível enviar a mensagem. Verifique a conexão e a configuração do Firebase.')
      }
    } finally {
      setSending(false)
    }
  }

  const draft = values.name || values.email || values.message ? values : emailDraft
  const mailto = `mailto:anabcruzsilva@gmail.com?subject=${encodeURIComponent(
    `Contato de ${draft.name || 'visitante'} pelo portfólio`,
  )}&body=${encodeURIComponent(`E-mail: ${draft.email}\n\n${draft.message}`)}`

  return (
    <section className="contact-section" id="contato">
      <div className="contact">
        <div>
          <h2>Vamos conversar?</h2>
          <a className="mail" href="mailto:anabcruzsilva@gmail.com">anabcruzsilva@gmail.com</a>
          <a className="btn ghost email-link" href={mailto}>Abrir aplicativo de e-mail</a>
        </div>
        <form className="contact-form" aria-label="Formulário de contato" noValidate onSubmit={handleSubmit}>
          <label className="form-field">
            Nome
            <input name="name" value={values.name} onChange={handleChange} aria-invalid={Boolean(errors.name)} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label className="form-field">
            E-mail
            <input name="email" type="email" value={values.email} onChange={handleChange} aria-invalid={Boolean(errors.email)} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label className="form-field">
            Mensagem
            <textarea name="message" rows="4" value={values.message} onChange={handleChange} aria-invalid={Boolean(errors.message)} />
            {errors.message && <span className="field-error">{errors.message}</span>}
          </label>
          <button className="btn main" type="submit" disabled={sending}>
            {sending ? (firebaseConfigured ? 'Enviando...' : 'Registrando...') : 'Enviar mensagem'}
          </button>
          <p className="form-feedback" aria-live="polite">{feedback}</p>
          <p className="form-hint">
            {firebaseConfigured
              ? 'A mensagem será salva no dashboard e enviada por e-mail.'
              : 'Modo local: a mensagem fica salva neste navegador e não é enviada automaticamente.'}
          </p>
        </form>
        <div className="row contact-links">
          <a className="btn main" href="https://github.com/cruzanab" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="btn ghost" href="https://www.linkedin.com/in/ana-beatriz-da-cruz-silva-bb8527270/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </section>
  )
}

export default ContactSection