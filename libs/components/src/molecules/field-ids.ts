export interface FieldDescriptionIds {
  describedBy?: string;
  errorId?: string;
  helpId?: string;
}

export function fieldDescriptionIds(
  id: string,
  helpText?: string,
  error?: string,
): FieldDescriptionIds {
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return { describedBy, errorId, helpId };
}
