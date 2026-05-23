export interface KbdProps {
  children: unknown;
  className?: string;
}

export const Kbd = ({ children, className }: KbdProps) => {
  const classes = ["kbd", className].filter(Boolean).join(" ");

  return <kbd className={classes}>{children}</kbd>;
};
