import RegisterForm from "./RegisterForm";

export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return(
    <>
    <RegisterForm></RegisterForm>
    </>
  );
}