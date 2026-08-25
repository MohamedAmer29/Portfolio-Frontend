import { useState, type FormEvent } from 'react'
import { Reveal } from '../Reveal'
import { SectionHeading } from '../SectionHeading'

type ContactProps = {
  eyebrow: string
  title: string
  blurb: string
  email: string
}

export function Contact({ eyebrow, title, blurb, email }: ContactProps) {
  const [status, setStatus] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const from = String(data.get('email') || '').trim()
    const subject = String(data.get('subject') || '').trim()
    const message = String(data.get('message') || '').trim()

    const body = encodeURIComponent(`Name: ${name}\nEmail: ${from}\n\n${message}`)
    const mailSubject = encodeURIComponent(subject || `Message from ${name || 'portfolio'}`)

    window.location.href = `mailto:${email}?subject=${mailSubject}&body=${body}`
    setStatus('Opening your email client…')
    form.reset()
  }

  const fieldClass =
    'w-full rounded-sm border border-ink-muted/15 bg-bg-elevated px-4 py-3.5 text-[16px] text-ink outline-none transition-all duration-300 placeholder:text-ink-soft focus:border-accent/60 focus:bg-white focus:shadow-[0_0_0_3px_rgba(127,173,173,0.1)]'

  return (
    <section className="scroll-mt-20 px-5 py-[72px] text-center md:px-0 md:py-[100px]" id="contact">
      <div className="mx-auto w-full max-w-[1000px] md:w-[min(100%-10rem,1000px)]">
        <Reveal>
          <SectionHeading number="04." title={eyebrow} />
          <h2 className="mb-4 font-sans text-contact font-extrabold tracking-[-0.03em] text-ink">
            {title}
          </h2>
          <p className="mx-auto mb-10 max-w-[520px] text-[17px] leading-[1.8] text-ink-muted md:text-body">
            {blurb}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <form className="mx-auto grid max-w-[600px] gap-4 text-left" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sr-only" htmlFor="name">
                Name
              </label>
              <input id="name" name="name" type="text" placeholder="Name" required className={fieldClass} />
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
                className={fieldClass}
              />
            </div>

            <label className="sr-only" htmlFor="subject">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="Subject"
              required
              className={fieldClass}
            />

            <label className="sr-only" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Message"
              required
              className={`${fieldClass} min-h-[160px] resize-y`}
            />

            <button
              className="mt-3 w-full max-w-[280px] justify-self-center rounded-sm border border-ink bg-white px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.1em] text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10 hover:shadow-[0_8px_25px_-10px_rgba(127,173,173,0.35)]"
              type="submit"
            >
              Say Hello
            </button>
            {status ? (
              <p className="text-center font-mono text-[12px] text-accent">{status}</p>
            ) : null}
          </form>
        </Reveal>
      </div>
    </section>
  )
}
