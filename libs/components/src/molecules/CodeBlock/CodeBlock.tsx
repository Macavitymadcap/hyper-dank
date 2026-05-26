export interface CodeBlockProps {
  className?: string;
  code: string;
  language?: string;
}

const tokenPattern =
  /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|<\/?[A-Za-z][\w.:-]*|\/?>|\b(?:as|async|await|const|else|export|false|from|function|if|import|interface|let|return|true|type|undefined|var)\b|\b\d+(?:\.\d+)?\b|[A-Za-z_$][\w$-]*(?==))/g;

const classifyToken = (token: string): string => {
  if (token.startsWith("//") || token.startsWith("/*")) {
    return "comment";
  }

  if (/^["'`]/.test(token)) {
    return "string";
  }

  if (/^<\/?[A-Za-z]/.test(token)) {
    return "tag";
  }

  if (token === ">" || token === "/>") {
    return "punctuation";
  }

  if (/^\d/.test(token)) {
    return "number";
  }

  if (/^[A-Za-z_$][\w$-]*$/.test(token)) {
    if (
      /^(as|async|await|const|else|export|false|from|function|if|import|interface|let|return|true|type|undefined|var)$/.test(
        token,
      )
    ) {
      return "keyword";
    }

    return "attribute";
  }

  return "punctuation";
};

const highlightedCode = (code: string, language?: string): unknown[] | string => {
  if (!language || !/^(j|t)sx?$/.test(language)) {
    return code;
  }

  const parts: unknown[] = [];
  let cursor = 0;

  for (const match of code.matchAll(tokenPattern)) {
    const token = match[0];
    const index = match.index ?? 0;

    if (index > cursor) {
      parts.push(code.slice(cursor, index));
    }

    const tokenType = classifyToken(token);
    parts.push(
      <span className={`code-token code-token--${tokenType}`} data-token={tokenType}>
        {token}
      </span>,
    );
    cursor = index + token.length;
  }

  if (cursor < code.length) {
    parts.push(code.slice(cursor));
  }

  return parts.length > 0 ? parts : code;
};

export const CodeBlock = ({ className, code, language }: CodeBlockProps) => {
  const classes = ["code-block", className].filter(Boolean).join(" ");
  const codeClass = language ? `language-${language}` : undefined;

  return (
    <pre className={classes}>
      <code className={codeClass}>{highlightedCode(code, language)}</code>
    </pre>
  );
};
