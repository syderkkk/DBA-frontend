
import ClientRoleSelector from "./ClientRoleSelector";

export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <ClientRoleSelector></ClientRoleSelector>
  );
}
