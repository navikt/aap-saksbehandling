export function setFocusHtmlRef(ref: React.RefObject<HTMLElement | null>) {
  (ref?.current as HTMLElement | null)?.focus();
}
