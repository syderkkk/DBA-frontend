export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">Not found</h1>
    </main>
  );
}