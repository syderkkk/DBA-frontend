import { AuthProvider } from "@/context/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="">
        <main className="">{children}</main>
      </div>
    </AuthProvider>
  );
}
