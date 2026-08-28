import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Reveal } from "../Reveal";
import { AdminSectionActions } from "../admin/AdminSectionActions";
import { DataSourceTag } from "../admin/DataSourceTag";
import { api } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { SectionHeading } from "../SectionHeading";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactProps = {
  eyebrow: string;
  title: string;
  blurb: string;
  email: string;
};

type Result = { type: "success" | "error"; message: string } | null;

export function Contact({ eyebrow, title, blurb, email }: ContactProps) {
  const { isAdmin } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    mode: "onBlur",
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const [result, setResult] = useState<Result>(null);

  const [watchName, watchEmail, watchSubject, watchMessage] = watch([
    "name",
    "email",
    "subject",
    "message",
  ]);

  const isFormValid =
    watchName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchEmail.trim()) &&
    watchSubject.trim().length >= 3 &&
    watchMessage.trim().length >= 10;

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setResult(null);
    try {
      await api.post("contact", {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });
      setResult({
        type: "success",
        message:
          "Thanks! Your message has been sent — I'll get back to you soon.",
      });
      reset();

      const engineSound = new Audio("/sounds/engine-starting.mp3");
      engineSound.play().catch(() => {});
    } catch {
      setResult({
        type: "error",
        message: "Something went wrong sending your message. Please try again.",
      });
    }
  };

  const baseField =
    "w-full rounded-sm border bg-bg-elevated px-4 py-3.5 text-[16px] text-ink outline-none transition-all duration-300 placeholder:text-ink-soft focus:shadow-[0_0_0_3px_rgba(127,173,173,0.1)]";
  const fieldClass = (hasError: boolean) =>
    `${baseField} ${
      hasError
        ? "border-error focus:border-error/60"
        : "border-ink-muted/15 focus:border-accent/60 focus:bg-white"
    }`;

  const errorClass = "mt-1.5 font-mono text-[11px] text-error";

  return (
    <section
      className="relative scroll-mt-20 px-5 py-[72px] text-center md:px-0 md:py-[100px]"
      id="contact"
    >
      <div className="mx-auto w-full max-w-[1000px] md:w-[min(100%-10rem,1000px)]">
      <Reveal>
        <div>
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4 md:mb-10">
            <SectionHeading number="07." title={eyebrow} className="mb-0" />
            <AdminSectionActions section="contact" />
          </div>
          {isAdmin && (
            <DataSourceTag hasServerData={false} className="mb-4 block text-left" />
          )}
          <h2 className="mb-4 font-sans text-[clamp(2rem,6vw,3.5rem)] font-extrabold tracking-[-0.03em] text-ink">
            {title}
          </h2>
          <p className="mx-auto mb-10 max-w-[520px] text-[17px] leading-[1.8] text-ink-muted md:text-body">
            {blurb}
          </p>
        </div>
      </Reveal>

      <div>
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2  top-4 z-10 flex flex-col items-center gap-1 md:right-8 md:top-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              Over here
            </span>
            <span aria-hidden className="animate-bounce text-accent">
              ↓
            </span>
          </div>
        <Reveal delay={0.1}>
          <form
            className="mx-auto grid max-w-[600px] gap-4 text-left"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="sr-only" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Name"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  aria-invalid={errors.name ? "true" : undefined}
                  className={fieldClass(!!errors.name)}
                />
                {errors.name && (
                  <p className={errorClass}>{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="sr-only" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  aria-invalid={errors.email ? "true" : undefined}
                  className={fieldClass(!!errors.email)}
                />
                {errors.email && (
                  <p className={errorClass}>{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="sr-only" htmlFor="subject">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                placeholder="Subject"
                {...register("subject", {
                  required: "Subject is required",
                  minLength: {
                    value: 3,
                    message: "Subject must be at least 3 characters",
                  },
                })}
                aria-invalid={errors.subject ? "true" : undefined}
                className={fieldClass(!!errors.subject)}
              />
              {errors.subject && (
                <p className={errorClass}>{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label className="sr-only" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Message"
                rows={6}
                {...register("message", {
                  required: "Message is required",
                  minLength: {
                    value: 10,
                    message: "Message must be at least 10 characters",
                  },
                })}
                aria-invalid={errors.message ? "true" : undefined}
                className={`${fieldClass(!!errors.message)} min-h-[160px] resize-y`}
              />
              {errors.message && (
                <p className={errorClass}>{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="mt-3 w-full max-w-[280px] justify-self-center rounded-sm border border-ink bg-white px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.1em] text-ink transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:border-accent enabled:hover:bg-accent/10 enabled:hover:shadow-[0_8px_25px_-10px_rgba(127,173,173,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending…" : "Say Hello"}
            </button>

            {result && (
              <p
                role="status"
                className={`text-center font-mono text-[12px] ${
                  result.type === "success" ? "text-success" : "text-error"
                }`}
              >
                {result.message}
              </p>
            )}

            <p className="text-center font-mono text-[12px] text-ink-soft">
              or email me directly at{" "}
              <a
                href={`mailto:${email}`}
                className="text-accent hover:underline"
              >
                {email}
              </a>
            </p>
          </form>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
