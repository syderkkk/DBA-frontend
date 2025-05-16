import LoginForm from "./LoginForm";

export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <>
    <LoginForm></LoginForm>
    </>
  );
}