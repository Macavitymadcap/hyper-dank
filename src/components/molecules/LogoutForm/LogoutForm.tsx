import { Button } from "../../atoms/Button";
import { HxForm } from "../HxForm";

export const LogoutForm = () => {
  return (
    <HxForm action="/logout" method="post" hx-post="/logout" hx-swap="none">
      <Button type="submit" size="compact" variant="outline">
        Sign out
      </Button>
    </HxForm>
  );
};
