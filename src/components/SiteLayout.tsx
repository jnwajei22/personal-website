export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 py-10 sm:py-16">
      {children}
    </div>
  );
}
