import { Button } from "../atoms/Button";
import { InputGroup } from "../molecules/InputGroup"

export const WalkForm = () => {
  return (
    <form 
      hx-post="/walks" 
      hx-target="#walks-list" 
      hx-swap="innerHTML"
      hx-on="htmx:afterRequest: this.reset(); htmx.trigger('#stats', 'refresh')"
    >
      <div className="input-row">
        <InputGroup type={"number"} name={"miles"} label={"Mi"} step={0.1} min={0} max={100} placeholder={"0.0"}/>
        <InputGroup type={"number"} name={"minutes"} label={"Min"} min={0} max={100} placeholder={"0"} />
        <InputGroup type={"number"} name={"seconds"} label={"Sec"} min={0} max={59} placeholder={"0"} />
        <Button type="submit">Add</Button>
      </div>
    </form>
  );
};
