export type StorySurfaceSize = "compact" | "wide" | "full";

export function renderStory(node: unknown, options: { size?: StorySurfaceSize } = {}) {
  return String(
    <div className="storybook-surface" data-size={options.size ?? "wide"}>
      {node}
    </div>,
  );
}

export type StoryActionHandler = (event: Event) => void;

interface StoryAction {
  event: string;
  handler: StoryActionHandler;
  preventDefault?: boolean;
  selector: string;
}

export function renderStoryWithActions(
  node: unknown,
  options: { size?: StorySurfaceSize } = {},
  actions: StoryAction[] = [],
) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = renderStory(node, options);
  const surface = wrapper.firstElementChild;

  for (const storyAction of actions) {
    wrapper.querySelectorAll<HTMLElement>(storyAction.selector).forEach((element) => {
      element.addEventListener(storyAction.event, (event) => {
        if (storyAction.preventDefault) event.preventDefault();
        storyAction.handler(event);
      });
    });
  }

  return surface ?? wrapper;
}
