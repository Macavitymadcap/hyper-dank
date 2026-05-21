export interface CodeBlockProps {
  className?: string;
  code: string;
  language?: string;
}

export const CodeBlock = ({ className, code, language }: CodeBlockProps) => {
  const classes = ["code-block", className].filter(Boolean).join(" ");
  const codeClass = language ? `language-${language}` : undefined;

  return (
    <pre className={classes}>
      <code className={codeClass}>{code}</code>
    </pre>
  );
};
