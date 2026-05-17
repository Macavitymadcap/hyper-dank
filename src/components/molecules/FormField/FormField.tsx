export interface FormFieldProps {
  children: unknown;
  htmlFor: string;
  label: string;
}

export const FormField = ({ children, htmlFor, label }: FormFieldProps) => {
  return (
    <label className="form-field" htmlFor={htmlFor}>
      <span>{label}</span>
      {children}
    </label>
  );
};
