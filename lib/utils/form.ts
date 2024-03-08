import { SubmitErrorHandler, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types';

export enum JaEllerNei {
  Ja = 'ja',
  Nei = 'nei',
}

export const getJaNeiEllerUndefined = (value?: boolean | null) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  return value ? JaEllerNei.Ja : JaEllerNei.Nei;
};

export const getStringEllerUndefined = (value?: number | string | null) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  return value.toString();
};
export function handleSubmitWithCallback<FormFields extends FieldValues>(
  form: UseFormReturn<FormFields>,
  onValid: SubmitHandler<FormFields>,
  onInvalid?: SubmitErrorHandler<FormFields>
) {
  return function (callbackSuccess: () => void, callbackError: () => void) {
    return form.handleSubmit(
      async (data) => {
        await onValid(data);
        callbackSuccess();
      },
      async (errors) => {
        onInvalid && (await onInvalid(errors));
        callbackError();
      }
    );
  };
}
