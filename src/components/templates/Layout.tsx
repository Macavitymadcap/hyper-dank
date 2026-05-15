import { raw } from "hono/html";
import { appStyles } from "../styles";

export const Layout = ({ children }: { children: unknown }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Walking Pace Tracker</title>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <link rel="stylesheet" href="https://unpkg.com/open-props" />
        <link rel="stylesheet" href="https://unpkg.com/open-props/normalize.min.css" />
        <style>{raw(appStyles)}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
};
