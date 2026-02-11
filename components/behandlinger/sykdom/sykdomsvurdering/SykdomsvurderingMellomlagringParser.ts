import { SykdomsvurderingerForm } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingPeriodisert';

export function parseOgMigrerMellomlagretData(data: string): SykdomsvurderingerForm {
  const parsedData = JSON.parse(data);
  if (isNewSchema(parsedData)) {
    return parsedData;
  }
  return mapFromOldFormToNewForm(parsedData as any);
}

function mapFromOldFormToNewForm(oldData: any): SykdomsvurderingerForm {
  return {
    vurderinger: [
      {
        ...oldData,
        fraDato: oldData.vurderingenGjelderFra,
      },
    ],
  };
}

function isNewSchema(object: any): object is SykdomsvurderingerForm {
  return object instanceof Object && object['vurderinger'] != null;
}
