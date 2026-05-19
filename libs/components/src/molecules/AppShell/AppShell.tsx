export interface AppShellProps {
  children: unknown;
  className?: string;
  footer?: unknown;
  header?: unknown;
  id?: string;
  navigation?: unknown;
}

export const AppShell = ({
  children,
  className,
  footer,
  header,
  id,
  navigation,
}: AppShellProps) => {
  const classes = ["app-shell", className].filter(Boolean).join(" ");

  return (
    <div id={id} className={classes}>
      {header ? <header className="app-shell-header">{header}</header> : undefined}
      <div className="app-shell-body">
        {navigation ? <aside className="app-shell-navigation">{navigation}</aside> : undefined}
        <main className="app-shell-main">{children}</main>
      </div>
      {footer ? <footer className="app-shell-footer">{footer}</footer> : undefined}
    </div>
  );
};
