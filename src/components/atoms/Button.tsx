import type { HtmxProps } from "../model";
import { styleRegistry } from "../style-registry";

interface ButtonProps extends HtmxProps {
  type: 'submit' | 'reset' | 'button';
  children: unknown;
  className?: string;
}

const buttonStyles = /* css */`
button {
  padding: var(--size-2) var(--size-4);
  background: var(--gray-0);
  color: var(--blue-6);
  border: none;
  border-radius: var(--radius-2);
  font-weight: var(--font-weight-7);
  cursor: pointer;
  font-size: var(--font-size-1);
  transition: background var(--speed-2);
}

button:hover {
  background: var(--gray-2);
}

button:active {
  transform: scale(0.98);
}
`;

export const Button = ({
  className, 
  type, 
  children,
  hxGet,
  hxPost,
  hxOn,
  hxPushUrl,
  hxSelect,
  hxSelectOob,
  hxSwap,
  hxSwapOob,
  hxTarget,
  hxTrigger,
  hxVals,
  hxBoost,
  hxConfirm,
  hxDelete,
  hxDisable,
  hxDisabledElt,
  hxDisinherit,
  hxEncoding,
  hxExt,
  hxHeaders,
  hxHistory,
  hxHistoryElt,
  hxInclude,
  hxIndicator,
  hxInherit,
  hxParams,
  hxPatch,
  hxPreserve,
  hxPrompt,
  hxPut,
  hxReplaceUrl,
  hxRequest,
  hxSync,
  hxValidate,
  hxVars,
}: ButtonProps) => {
  styleRegistry.register(buttonStyles);

  return (
    <button
      className={className}
      type={type}
      hx-get={hxGet}
      hx-post={hxPost}
      hx-on={hxOn}
      hx-push-url={hxPushUrl}
      hx-select={hxSelect}
      hx-select-oob={hxSelectOob}
      hx-swap={hxSwap}
      hx-swap-oob={hxSwapOob}
      hx-target={hxTarget}
      hx-trigger={hxTrigger}
      hx-vals={hxVals}
      hx-boost={hxBoost}
      hx-confirm={hxConfirm}
      hx-delete={hxDelete}
      hx-disable={hxDisable}
      hx-disabled-elt={hxDisabledElt}
      hx-disinherit={hxDisinherit}
      hx-encoding={hxEncoding}
      hx-ext={hxExt}
      hx-headers={hxHeaders}
      hx-history={hxHistory}
      hx-history-elt={hxHistoryElt}
      hx-include={hxInclude}
      hx-indicator={hxIndicator}
      hx-inherit={hxInherit}
      hx-params={hxParams}
      hx-patch={hxPatch}
      hx-preserve={hxPreserve}
      hx-prompt={hxPrompt}
      hx-put={hxPut}
      hx-replace-url={hxReplaceUrl}
      hx-request={hxRequest}
      hx-sync={hxSync}
      hx-validate={hxValidate}
      hx-vars={hxVars}
    >
      {children}
    </button>
  );
}