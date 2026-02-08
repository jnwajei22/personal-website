import type React from "react";

type Props = {
  eyebrow?: string;
  title: string;
  lead?: React.ReactNode;
  meta?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, lead, meta }: Props) {
  return (
    <header className="pt-10">
      {eyebrow ? (
        <div className="text-xs font-semibold tracking-widest text-white/50">
          {eyebrow}
        </div>
      ) : null}

      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        {title}
      </h1>

      {lead ? (
        <div className="mt-4 max-w-2xl text-base leading-7 text-white/70">
          {lead}
        </div>
      ) : null}

      {meta ? <div className="mt-3 text-sm text-white/55">{meta}</div> : null}

      <div className="mt-8 border-b border-white/10" />
    </header>
  );
}
