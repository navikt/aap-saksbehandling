import { FieldError, FieldErrorsImpl, FieldValues, Merge } from 'react-hook-form';

export interface VurderingerErrors<T extends FieldValues> {
  vurderinger?: Merge<FieldError, (Merge<FieldError, FieldErrorsImpl<T>> | undefined)[]>;
}

interface ErrorListElement {
  ref: string;
  message: string;
  index: number;
}
export type ErrorList = ErrorListElement[];

type ErrorParent = { errField?: { ref?: { name?: string }; message?: string } };

export function mapPeriodiserteVurderingerErrorList<T extends FieldValues>(
  formstateErrors: VurderingerErrors<T>
): ErrorList {
  return formstateErrors.vurderinger && Array.isArray(formstateErrors.vurderinger)
    ? formstateErrors.vurderinger.reduce((acc, errVurdering, index) => {
        const nestedErrors = Object.values(errVurdering || {})
          // @ts-expect-error
          .filter((val) => !val?.ref && !val?.message)
          .map((nestedErrorParent) =>
            Object.values(nestedErrorParent as ErrorListElement).map((errField) => ({
              ref: `#${errField?.ref?.name}`,
              message: errField?.message,
              index,
            }))
          )
          .flat()
          .filter((el) => el.message);
        const errors = Object.values((errVurdering as ErrorParent) || {})
          .map((errField) => ({ ref: `#${errField?.ref?.name}`, message: errField?.message }))
          .filter((el) => el.message);
        return [...acc, ...errors, ...nestedErrors];
      }, [])
    : [];
}

export function finnesFeilForVurdering(index: number, errorList: ErrorList) {
  return !!errorList.find((err) => err.index === index);
}
