import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { getLoginErrorMessage, useLogin, type LoginFormData } from "../hooks/useLogin";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const [watchEmail, watchPassword] = watch(["email", "password"]);

  const isFormValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchEmail.trim()) &&
    watchPassword.trim().length >= 6;

  useEffect(() => {
    if (login.isSuccess) {
      navigate("/", { replace: true });
    }
  }, [login.isSuccess, navigate]);

  if (isAdmin) {
    return <Navigate to="/" replace />;
  }

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    login.reset();
    await login.mutateAsync({
      email: data.email.trim(),
      password: data.password,
    });
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
    <div className="flex min-h-svh items-center justify-center bg-bg px-5 py-12">
      <div className="w-full max-w-[420px] rounded-lg border border-ink/10 bg-bg-elevated/70 p-8 shadow-[0_20px_60px_rgba(26,31,36,0.08)]">
        <div className="mb-8 text-center">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Admin
          </p>
          <h1 className="font-sans text-[clamp(1.75rem,4vw,2.25rem)] font-extrabold tracking-[-0.03em] text-ink">
            Sign in
          </h1>
          <p className="mt-3 text-[15px] leading-[1.7] text-ink-muted">
            Enter your credentials to manage portfolio content.
          </p>
        </div>

        <form
          className="grid gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label className="sr-only" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
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

          <div>
            <label className="sr-only" htmlFor="admin-password">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                aria-invalid={errors.password ? "true" : undefined}
                className={`${fieldClass(!!errors.password)} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center text-ink-muted transition hover:text-accent"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting || login.isPending}
            className="mt-2 w-full rounded-sm border border-ink bg-white px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.1em] text-ink transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:border-accent enabled:hover:bg-accent/10 enabled:hover:shadow-[0_8px_25px_-10px_rgba(127,173,173,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting || login.isPending ? "Signing in…" : "Sign in"}
          </button>

          {login.isError && (
            <p role="alert" className="text-center font-mono text-[12px] text-error">
              {getLoginErrorMessage(login.error)}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
