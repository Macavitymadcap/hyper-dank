export interface AccordionItem {
  body: unknown;
  controls?: unknown;
  id: string;
  meta?: string;
  title: string;
}

export interface AccordionProps {
  className?: string;
  items: AccordionItem[];
  name: string;
}

export const Accordion = ({ className, items, name }: AccordionProps) => {
  const classes = ["accordion", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {items.map((item) => (
        <details className="accordion-item" name={name}>
          <summary aria-controls={item.id}>
            <span>
              <strong>{item.title}</strong>
              {item.meta ? <small>{item.meta}</small> : null}
            </span>
          </summary>
          <div className="accordion-body" id={item.id}>
            {item.body}
            {item.controls ? <div className="accordion-controls">{item.controls}</div> : null}
          </div>
        </details>
      ))}
    </div>
  );
};
