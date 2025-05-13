

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <main className="ml-0 md:ml-64 transition-all">{children}</main>
    </div>
  );
}
