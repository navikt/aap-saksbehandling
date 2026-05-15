import {
  OvergangArbeidForm,
  OvergangArbeidFormOld,
} from 'components/behandlinger/sykdom/overgangarbeid/OvergangArbeid-types';

export function parseOgMigrerMellomlagretData(data: string): OvergangArbeidForm {
  const parsedData = JSON.parse(data);
  if (isNewSchema(parsedData)) {
    return parsedData;
  }
  return mapFromOldFormToNewForm(parsedData as OvergangArbeidFormOld);
}

function mapFromOldFormToNewForm(oldData: OvergangArbeidFormOld): OvergangArbeidForm {
  return {
    vurderinger: [
      {
        fraDato: oldData.fom,
        begrunnelse: oldData.begrunnelse,
        brukerRettPåAAP: oldData.brukerRettPåAAP || '',
        erNyVurdering: false,
        behøverVurdering: false,
      },
    ],
  };
}

function isNewSchema(object: unknown): object is OvergangArbeidForm {
  return typeof object === 'object' && object !== null && 'vurderinger' in object && object.vurderinger != null;
}
