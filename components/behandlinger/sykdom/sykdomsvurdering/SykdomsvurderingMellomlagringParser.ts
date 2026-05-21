import {
  Sykdomsvurdering,
  SykdomsvurderingerForm,
} from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';

export function parseOgMigrerMellomlagretData(data: string): SykdomsvurderingerForm {
  const parsedData = JSON.parse(data);
  if (isNewSchema(parsedData)) {
    return parsedData;
  }
  return mapFromOldFormToNewForm(parsedData);
}

function mapFromOldFormToNewForm(oldData: Omit<Sykdomsvurdering, 'fraDato'>): SykdomsvurderingerForm {
  return {
    vurderinger: [
      {
        ...oldData,
        fraDato: oldData.vurderingenGjelderFra!,
      },
    ],
  };
}

function isNewSchema(object: unknown): object is SykdomsvurderingerForm {
  return typeof object === 'object' && object !== null && 'vurderinger' in object && object.vurderinger != null;
}
