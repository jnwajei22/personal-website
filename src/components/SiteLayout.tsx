export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-28">
        {children}
      </div>
    </main>
  );
}
