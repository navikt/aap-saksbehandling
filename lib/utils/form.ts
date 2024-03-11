import { SubmitErrorHandler, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types';

export enum Behovstype {
  MANUELT_SATT_PÅ_VENT_KODE = '9001',
  AVKLAR_STUDENT_KODE = '5001',
  AVKLAR_SYKDOM_KODE = '5003',
  FASTSETT_ARBEIDSEVNE_KODE = '5004',
  FRITAK_MELDEPLIKT_KODE = '5005',
  AVKLAR_BISTANDSBEHOV_KODE = '5006',
  VURDER_SYKEPENGEERSTATNING_KODE = '5007',
  FASTSETT_BEREGNINGSTIDSPUNKT_KODE = '5008',
  FORESLÅ_VEDTAK_KODE = '5098',
  FATTE_VEDTAK_KODE = '5099',
}

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
