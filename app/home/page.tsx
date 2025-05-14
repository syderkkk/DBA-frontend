import AuthContent from "./AuthContent";

export default async function Page() {
  // Aquí puedes realizar cualquier lógica asíncrona necesaria
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <main className="m-10">
      <h1 className="text-center">/Home</h1>
      {/* Renderiza el componente cliente */}
      <AuthContent />

      <div>
        <button>Ingresar a clase por codigo</button>
      </div>
      <div>
        <button>Crear clase</button>
      </div>
    </main>
  );
}
