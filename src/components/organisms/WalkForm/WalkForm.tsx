import { Button } from "../../atoms/Button";
import { HxForm } from "../../molecules/HxForm";
import { InputGroup } from "../../molecules/InputGroup";

export interface WalkFormProps {
  defaultValues?: {
    miles?: number | string;
    minutes?: number | string;
    seconds?: number | string;
  };
  submitLabel?: string;
}

export const WalkForm = ({ defaultValues = {}, submitLabel = "Add" }: WalkFormProps = {}) => {
  return (
    <HxForm
      action="/walks"
      method="post"
      hx-post="/walks"
      hx-target="#walks-list"
      hx-swap="innerHTML"
      hx-on--after-request="this.reset()"
    >
      <div className="input-row">
        <InputGroup
          type={"number"}
          name={"miles"}
          label={"Mi"}
          step={0.1}
          min={0}
          max={100}
          placeholder={"0.0"}
          value={defaultValues.miles}
        />
        <InputGroup
          type={"number"}
          name={"minutes"}
          label={"Min"}
          min={0}
          max={100}
          placeholder={"0"}
          value={defaultValues.minutes}
        />
        <InputGroup
          type={"number"}
          name={"seconds"}
          label={"Sec"}
          min={0}
          max={59}
          placeholder={"0"}
          value={defaultValues.seconds}
        />
        <Button type="submit">{submitLabel}</Button>
      </div>
    </HxForm>
  );
};
