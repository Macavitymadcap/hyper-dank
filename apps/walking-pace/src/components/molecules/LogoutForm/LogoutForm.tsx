import { Button, HxForm } from "@macavitymadcap/hyper-dank-components";

export interface LogoutFormProps {
  label?: string;
}

export const LogoutForm = ({ label = "Sign out" }: LogoutFormProps = {}) => {
  return (
    <HxForm action="/logout" method="post" hx-post="/logout" hx-swap="none">
      <Button type="submit" size="compact" variant="outline">
        {label}
      </Button>
    </HxForm>
  );
};
