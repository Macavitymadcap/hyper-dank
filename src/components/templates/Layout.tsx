import { styleRegistry } from "./style-registry";


export const globalStyles = /* css */`
body {
  font-family: var(--font-sans);
  background: var(--gray-1);
  padding: var(--size-4);
  max-width: 600px;
  margin: 0 auto;
}

.htmx-indicator {
  opacity: 0;
  transition: opacity var(--speed-2) ease-in;
}

.htmx-request .htmx-indicator {
  opacity: 1;
}
`;

export const Layout = ({ children }: { children: unknown }) => {
  const componentStyles = styleRegistry.reset();
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Walking Pace Tracker</title>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <link rel="stylesheet" href="https://unpkg.com/open-props" />
        <link rel="stylesheet" href="https://unpkg.com/open-props/normalize.min.css" />
        <style>{globalStyles}{componentStyles}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
};