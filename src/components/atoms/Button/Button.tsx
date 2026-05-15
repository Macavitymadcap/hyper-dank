import type { HtmxProps } from "../../model";

interface ButtonProps extends HtmxProps {
  type: 'submit' | 'reset' | 'button';
  children: unknown;
  className?: string;
}

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
  const classes = ["button", className].filter(Boolean).join(" ");

  return (
    <button
      className={classes}
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
