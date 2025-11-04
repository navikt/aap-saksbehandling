import { FieldError, FieldErrorsImpl, FieldValues, Merge } from 'react-hook-form';

export interface VurderingerErrors<T extends FieldValues> {
  vurderinger?: Merge<FieldError, (Merge<FieldError, FieldErrorsImpl<T>> | undefined)[]>;
}

interface ErrorListElement {
  ref: string;
  message: string;
}
type ErrorList = ErrorListElement[];

export function mapPeriodiserteVurderingerErrorList<T extends FieldValues>(
  formstateErrors: VurderingerErrors<T>
): ErrorList {
  return formstateErrors.vurderinger && Array.isArray(formstateErrors.vurderinger)
    ? formstateErrors.vurderinger.reduce((acc, errVurdering) => {
        const nestedErrors = Object.values(errVurdering)
          // @ts-ignore
          .filter((val) => !val?.ref && !val?.message)
          .map((nestedErrorParent) =>
            // @ts-ignore
            Object.values(nestedErrorParent).map((errField) => ({
              // @ts-ignore
              ref: errField?.ref?.name,
              // @ts-ignore
              message: errField?.message,
            }))
          )
          .flat()
          .filter((el) => el.message);
        const errors = Object.values(errVurdering || {})
          // @ts-ignore
          .map((errField) => ({ ref: errField?.ref?.name, message: errField?.message }))
          .filter((el) => el.message);
        return [...acc, ...errors, ...nestedErrors];
      }, [])
    : [];
}
