export interface CommandItem {
  current?: boolean;
  description?: string;
  href: string;
  label: string;
  value: string;
}

export interface CommandProps {
  action?: string;
  className?: string;
  emptyText?: string;
  helpText?: string;
  id: string;
  inputName?: string;
  items: CommandItem[];
  label: string;
  method?: "get" | "post";
  placeholder?: string;
  query?: string;
}

export const Command = ({
  action = "",
  className,
  emptyText = "No matching commands.",
  helpText,
  id,
  inputName = "q",
  items,
  label,
  method = "get",
  placeholder,
  query,
}: CommandProps) => {
  const classes = ["command", className].filter(Boolean).join(" ");
  const inputId = `${id}-input`;
  const helpId = helpText ? `${id}-help` : undefined;
  const resultsId = `${id}-results`;

  return (
    <search className={classes} data-empty={items.length === 0 ? "true" : undefined}>
      <form action={action} method={method}>
        <div className="command-field">
          <label htmlFor={inputId}>{label}</label>
          {helpText ? <small id={helpId}>{helpText}</small> : undefined}
          <input
            id={inputId}
            name={inputName}
            type="search"
            value={query}
            placeholder={placeholder}
            aria-controls={resultsId}
            aria-describedby={helpId}
          />
        </div>
        {items.length > 0 ? (
          <div
            id={resultsId}
            className="command-results"
            role="listbox"
            aria-label={`${label} results`}
          >
            {items.map((item) => (
              <a
                href={item.href}
                role="option"
                aria-current={item.current ? "page" : undefined}
                aria-selected={item.current ? "true" : "false"}
                data-current={item.current ? "true" : undefined}
                data-value={item.value}
              >
                <span>{item.label}</span>
                {item.description ? <small>{item.description}</small> : undefined}
              </a>
            ))}
          </div>
        ) : (
          <p id={resultsId} className="command-empty" role="status">
            {emptyText}
          </p>
        )}
      </form>
    </search>
  );
};
