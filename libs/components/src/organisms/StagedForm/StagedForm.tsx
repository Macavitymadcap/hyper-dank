import { type HtmxProps, htmxAttributes } from "../../model";

export type StagedFormStepStatus = "complete" | "current" | "available" | "unavailable" | "error";

export interface StagedFormStep extends HtmxProps {
  description?: unknown;
  href?: string;
  id: string;
  label: unknown;
  status?: StagedFormStepStatus;
}

export interface StagedFormProps extends HtmxProps {
  actions?: unknown;
  children: unknown;
  className?: string;
  currentStepId: string;
  heading?: unknown;
  id?: string;
  progressLabel?: string;
  steps: StagedFormStep[];
  validation?: unknown;
}

export const StagedForm = ({
  actions,
  children,
  className,
  currentStepId,
  heading,
  id,
  progressLabel,
  steps,
  validation,
  ...hxProps
}: StagedFormProps) => {
  const classes = ["staged-form", className].filter(Boolean).join(" ");
  const currentStep = steps.find((step) => step.id === currentStepId);
  const resolvedProgressLabel =
    progressLabel ??
    (typeof heading === "string" || typeof heading === "number"
      ? `${heading} progress`
      : "Form progress");
  const panelId = id ? `${id}-panel` : undefined;
  const panelHeadingId = id ? `${id}-panel-heading` : undefined;
  const panelDescriptionId =
    currentStep?.description && id ? `${id}-${currentStep.id}-description` : undefined;

  return (
    <section
      id={id}
      className={classes}
      aria-labelledby={heading && id ? `${id}-heading` : undefined}
      {...htmxAttributes(hxProps)}
    >
      {heading ? (
        <header className="staged-form-header">
          <h2 id={id ? `${id}-heading` : undefined}>{heading}</h2>
        </header>
      ) : undefined}
      <nav className="staged-form-progress" aria-label={resolvedProgressLabel}>
        <ol>
          {steps.map((step, index) => {
            const isCurrent = step.id === currentStepId;
            const status = resolveStepStatus(step, isCurrent);
            const isDisabled = status === "unavailable";
            const stepClasses = [
              "staged-form-step",
              `staged-form-step--${status}`,
              isCurrent ? "staged-form-step--current" : undefined,
            ]
              .filter(Boolean)
              .join(" ");
            const content = (
              <>
                <span className="staged-form-step-marker" aria-hidden="true">
                  {status === "complete" ? "done" : index + 1}
                </span>
                <span className="staged-form-step-copy">
                  <span className="staged-form-step-label">{step.label}</span>
                  <span className="staged-form-step-status">
                    {stepStatusLabel(status, isCurrent)}
                  </span>
                  {step.description ? (
                    <span className="staged-form-step-description">{step.description}</span>
                  ) : undefined}
                </span>
              </>
            );

            return (
              <li className={stepClasses} data-status={status}>
                {step.href && !isDisabled ? (
                  <a
                    href={step.href}
                    aria-current={isCurrent ? "step" : undefined}
                    {...htmxAttributes(step)}
                  >
                    {content}
                  </a>
                ) : (
                  <span
                    aria-current={isCurrent ? "step" : undefined}
                    aria-disabled={isDisabled ? "true" : undefined}
                  >
                    {content}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <section
        id={panelId}
        className="staged-form-panel"
        aria-labelledby={panelHeadingId}
        aria-describedby={panelDescriptionId}
      >
        {currentStep ? (
          <header className="staged-form-panel-header">
            <p className="staged-form-panel-kicker">Current step</p>
            <h3 id={panelHeadingId}>{currentStep.label}</h3>
            {currentStep.description ? (
              <p id={panelDescriptionId}>{currentStep.description}</p>
            ) : undefined}
          </header>
        ) : undefined}
        {validation ? <div className="staged-form-validation">{validation}</div> : undefined}
        <div className="staged-form-body">{children}</div>
        {actions ? <div className="staged-form-actions">{actions}</div> : undefined}
      </section>
    </section>
  );
};

function resolveStepStatus(step: StagedFormStep, isCurrent: boolean): StagedFormStepStatus {
  return step.status ?? (isCurrent ? "current" : "available");
}

function stepStatusLabel(status: StagedFormStepStatus, isCurrent: boolean) {
  if (isCurrent && status === "error") return "Current step, needs attention";
  if (isCurrent) return "Current step";

  switch (status) {
    case "complete":
      return "Complete";
    case "error":
      return "Needs attention";
    case "unavailable":
      return "Unavailable";
    default:
      return "Available";
  }
}
