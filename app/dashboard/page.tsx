export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">Dashboard</h1>
    </main>
  );
}

/* export default function Page() {
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    const getUserData = async () => {
      try {
        const userData = await fetchUserData(token);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [router]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Correo:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.role}</p>
        </div>
      ) : (
        <p>No se pudo cargar la información del usuario.</p>
      )}
    </div>
  );
} */
