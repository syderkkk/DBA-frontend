import { AuthProvider } from "@/contexts/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <main className="">
        <AuthProvider>{children}</AuthProvider>
      </main>
    </div>
  );
}
