"use client";

import { useState } from "react";

type FormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-brand-navy placeholder:text-gray-400 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange";
const inputErrorClass = `${inputClass} border-brand-red focus:border-brand-red focus:ring-brand-red`;
const labelClass = "mb-1.5 block text-sm font-medium text-brand-navy";
const errorClass = "mt-1 text-xs text-brand-red";

function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, "").slice(0, 15);
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const setField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: Partial<FormState> = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!form.message.trim()) nextErrors.message = "Message is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    if (!validate()) {
      setSubmitError("Please fix the highlighted fields and try again.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone,
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmittedName(form.name.trim());
      setForm(EMPTY_FORM);
      setSubmitted(true);
      setSubmitting(false);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-green-200 bg-green-50 px-6 py-12 text-center">
        <h3 className="text-lg font-bold text-green-700">
          Message sent successfully!
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-green-700">
          Thank you for reaching out, {submittedName || "friend"}. Our team
          will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 rounded-md border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Name <span className="text-brand-red">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={(event) => setField("name", event.target.value)}
          className={errors.name ? inputErrorClass : inputClass}
          placeholder="e.g. Rajesh Kumar"
        />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="contact-phone" className={labelClass}>
          Phone Number
        </label>
        <input
          id="contact-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={form.phone}
          onChange={(event) => setField("phone", normalizePhone(event.target.value))}
          className={inputClass}
          placeholder="e.g. 9876543210"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Email <span className="text-brand-red">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => setField("email", event.target.value)}
          className={errors.email ? inputErrorClass : inputClass}
          placeholder="e.g. rajesh@gmail.com"
        />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message <span className="text-brand-red">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={form.message}
          onChange={(event) => setField("message", event.target.value)}
          className={`${errors.message ? inputErrorClass : inputClass} resize-y`}
          placeholder="How can we help you? Tell us about your requirements."
        />
        {errors.message && <p className={errorClass}>{errors.message}</p>}
      </div>

      {submitError && (
        <p className="rounded-md bg-red-50 px-3 py-2.5 text-sm font-medium text-brand-red">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
