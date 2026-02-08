// src/app/contact/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xleqwdpy";

const EMAIL = "jnwajei22@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/jnwajei22";
const GITHUB_URL = "https://github.com/jnwajei22";

const REASONS = [
  { value: "contract", label: "Contract work" },
  { value: "collab", label: "Collaboration" },
  { value: "speaking", label: "Speaking / interview" },
  { value: "question", label: "General question" },
  { value: "other", label: "Other" },
] as const;

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function buildMailto({
  name,
  fromEmail,
  reason,
  message,
}: {
  name: string;
  fromEmail: string;
  reason: string;
  message: string;
}) {
  const reasonLabel = REASONS.find((r) => r.value === reason)?.label ?? "Message";

  const subject = `${reasonLabel} — ${name || "Hello"}`;
  const bodyLines = [
    `Name: ${name || "-"}`,
    `Email: ${fromEmail || "-"}`,
    `Reason: ${reasonLabel}`,
    "",
    message || "",
    "",
    "---",
    "Sent from the website contact form.",
  ];

  const params = new URLSearchParams({
    subject,
    body: bodyLines.join("\n"),
  });

  return `mailto:${EMAIL}?${params.toString()}`;
}

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [reason, setReason] = useState<(typeof REASONS)[number]["value"]>("contract");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // spam trap (hidden input). Humans leave it blank.
  const [website, setWebsite] = useState("");

  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string>("");

  const mailto = useMemo(
    () => buildMailto({ name, fromEmail, reason, message }),
    [name, fromEmail, reason, message]
  );

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard might be blocked; that's fine
    }
  }

  const canSubmit =
    status !== "sending" &&
    message.trim().length >= 10 &&
    isEmail(fromEmail) &&
    website.trim().length === 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // If the honeypot is filled, quietly pretend success.
    if (website.trim().length > 0) {
      setStatus("sent");
      return;
    }

    if (!isEmail(fromEmail) || message.trim().length < 10) {
      setStatus("error");
      setError("Please enter a valid email and a message.");
      return;
    }

    try {
      setStatus("sending");

      const payload = {
        name: name.trim(),
        email: fromEmail.trim(),
        reason: REASONS.find((r) => r.value === reason)?.label ?? reason,
        message: message.trim(),
        _subject: `New message — ${
          REASONS.find((r) => r.value === reason)?.label ?? "Contact"
        }`,
      };

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setStatus("error");
        setError("Couldn’t send right now. Try again, or use email below.");
        return;
      }

      setStatus("sent");

      // Clear form
      setName("");
      setFromEmail("");
      setReason("contract");
      setMessage("");

      // Optional: auto-reset the success state after a bit
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setError("Network error. Try again, or use email below.");
    }
  }

  return (
    <SiteLayout>
      <section className="space-y-10 pt-10">
        <PageHeader
          eyebrow="CONTACT"
          title="Contact"
          lead={
            <>
              Open to contract work, collaborations, and speaking/interviews. If you can share a
              little context (goal, timeline, and any constraints), I can respond faster and more
              accurately.
            </>
          }
          meta={
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">America/Chicago</Badge>
              <Badge variant="secondary">Reply: 24–72 hrs</Badge>
              <Badge variant="secondary">Async-friendly</Badge>
            </div>
          }
        />

        {/* Quick actions */}
        <div className="flex flex-wrap items-center gap-3">
          <a href={`mailto:${EMAIL}`} className="inline-flex">
            <Button>Email me</Button>
          </a>

          <Button variant="secondary" onClick={copyEmail}>
            {copied ? "Copied ✅" : "Copy email"}
          </Button>

          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="inline-flex">
            <Button variant="outline">LinkedIn</Button>
          </a>

          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex">
            <Button variant="outline">GitHub</Button>
          </a>
        </div>

        {/* Content grid */}
        <div className="grid gap-6 md:grid-cols-5">
          {/* Form */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      inputMode="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason</label>
                  <select
                    value={reason}
                    onChange={(e) =>
                      setReason(e.target.value as (typeof REASONS)[number]["value"])
                    }
                    className="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-black dark:focus:ring-white/10"
                  >
                    {REASONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What are you trying to build, and what would success look like?"
                    rows={7}
                  />
                  <p className="text-xs text-black/60 dark:text-white/60">
                    Helpful details: timeline, budget range (if applicable), and links or references.
                  </p>
                </div>

                {/* Honeypot */}
                <div className="hidden">
                  <label className="text-sm font-medium">Website</label>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    autoComplete="off"
                    tabIndex={-1}
                    className="h-10 w-full rounded-md border px-3"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button type="submit" disabled={!canSubmit}>
                    {status === "sending"
                      ? "Sending..."
                      : status === "sent"
                        ? "Sent ✅"
                        : "Send message"}
                  </Button>

                  {status === "error" ? (
                    <p className="text-sm text-red-500">{error}</p>
                  ) : (
                    <p className="text-sm text-black/60 dark:text-white/60">
                      Sends via Formspree. Prefer email?{" "}
                      <a href={mailto} className="underline underline-offset-4">
                        Open an email draft
                      </a>
                      .
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>For project requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-black/70 dark:text-white/70">
                <ul className="list-disc space-y-2 pl-5">
                  <li>What you’re building (1–2 sentences)</li>
                  <li>Timeline + constraints</li>
                  <li>Budget range (rough is fine)</li>
                  <li>Links / references / examples</li>
                  <li>What “done” looks like</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Where I’m useful</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-black/70 dark:text-white/70">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">UI systems</Badge>
                  <Badge variant="secondary">Embedded</Badge>
                  <Badge variant="secondary">PCB design</Badge>
                  <Badge variant="secondary">System integration</Badge>
                </div>
                <p className="pt-2">
                  If you want to see what I’ve built, visit{" "}
                  <Link className="underline underline-offset-4" href="/projects">
                    Projects
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>A few notes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-black/70 dark:text-white/70">
                <ul className="list-disc space-y-2 pl-5">
                  <li>Spam or link drops usually won’t get a reply</li>
                  <li>If you’re asking a “quick question,” a bit of context helps a lot</li>
                  <li>
                    If it’s an equity-only pitch, include traction and terms so I can evaluate it
                    properly
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
