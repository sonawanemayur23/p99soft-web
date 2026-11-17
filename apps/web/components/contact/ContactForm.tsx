// filepath: apps/web/components/contact/ContactForm.tsx
"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { BrandArrow } from "@/components/site/Logo";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string; fields?: Record<string, string[]> };

export function ContactForm({ topics }: { topics: string[] }) {
  const params = useSearchParams();
  const asked = params.get("topic") ?? "";
  // Match "Salesforce and CRM" from the starter tool, or any topic named in the link.
  const preset = topics.find((t) => t.toLowerCase() === asked.toLowerCase()) ?? topics.find((t) => asked && t.toLowerCase().includes(asked.toLowerCase().split(" ")[0]!)) ?? topics[0];
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: data.role || undefined }),
      });
      if (res.ok) return setStatus({ kind: "sent" });
      const body = (await res.json().catch(() => ({}))) as { message?: string; fields?: Record<string, string[]> };
      setStatus({
        kind: "error",
        message: body.message ?? (res.status === 400 ? "Some fields need attention. Check the highlighted fields and send again." : "The message did not send. Try again, or email us directly."),
        fields: body.fields,
      });
    } catch {
      setStatus({ kind: "error", message: "The message did not send because the connection dropped. Check your connection and try again." });
    }
  }

  const MESSAGES: Record<string, string> = {
    name: "Enter your name.",
    email: "Enter a valid work email, like name@company.com.",
    company: "Enter your company name.",
    role: "Keep the role under 120 characters.",
    message: "Write at least 10 characters.",
  };
  const err = (name: string) => (status.kind === "error" && status.fields?.[name] ? MESSAGES[name] : undefined);

  return (
    <AnimatePresence mode="wait">
      {status.kind === "sent" ? (
        <motion.div key="sent" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-mist p-10" role="status">
          <BrandArrow className="h-10" />
          <p className="t-h3 mt-6">Message sent.</p>
          <p className="mt-3 max-w-[40ch] text-slate">A practice lead will read it and reply by email.</p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2" exit={{ opacity: 0, y: -8 }}>
          <Field name="name" label="Your name" autoComplete="name" required error={err("name")} />
          <Field name="email" label="Work email" type="email" autoComplete="email" required error={err("email")} />
          <Field name="company" label="Company" autoComplete="organization" required error={err("company")} />
          <Field name="role" label="Role (optional)" autoComplete="organization-title" error={err("role")} />
          <label className="sm:col-span-2">
            <span className="text-sm font-semibold">Topic</span>
            <select name="topic" defaultValue={preset} className="mt-2 w-full rounded-2xl bg-mist px-4 py-3.5 ring-1 ring-line ring-inset focus:ring-2 focus:ring-sky focus:outline-none">
              {topics.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm font-semibold">Which journey hurts most?</span>
            <textarea
              name="message"
              required
              rows={6}
              minLength={10}
              aria-invalid={Boolean(err("message"))}
              className={clsx("mt-2 w-full rounded-2xl bg-mist px-4 py-3.5 ring-1 ring-inset focus:ring-2 focus:ring-sky focus:outline-none", err("message") ? "ring-red-500" : "ring-line")}
              placeholder="For example: our loyalty and commerce data do not match, so service agents cannot see recent orders."
            />
            {err("message") && <span className="mt-1.5 block text-sm text-red-700">{err("message")}</span>}
          </label>
          {/* honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
            <button
              type="submit"
              disabled={status.kind === "sending"}
              className="inline-flex items-center gap-3 rounded-full bg-ink py-3.5 pr-5 pl-6 font-semibold text-white transition-colors hover:bg-ink-2 disabled:opacity-60"
            >
              {status.kind === "sending" ? "Sending" : "Send message"}
              <BrandArrow className={clsx("h-3.5", status.kind === "sending" && "animate-pulse")} />
            </button>
            {status.kind === "error" && <p className="text-sm text-red-700" role="alert">{status.message}</p>}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Field({ name, label, type = "text", required, autoComplete, error }: { name: string; label: string; type?: string; required?: boolean; autoComplete?: string; error?: string }) {
  return (
    <label>
      <span className="text-sm font-semibold">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={clsx("mt-2 w-full rounded-2xl bg-mist px-4 py-3.5 ring-1 ring-inset focus:ring-2 focus:ring-sky focus:outline-none", error ? "ring-red-500" : "ring-line")}
      />
      {error && <span className="mt-1.5 block text-sm text-red-700">{error}</span>}
    </label>
  );
}
