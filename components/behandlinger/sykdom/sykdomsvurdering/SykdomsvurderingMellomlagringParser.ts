import { Sykdomsvurderinger } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingPeriodisert';
import { SykdomsvurderingFormFields } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';

export function parseOgMigrerMellomlagretData(data: string): Sykdomsvurderinger {
  const parsedData = JSON.parse(data);
  if (isNewSchema(parsedData)) {
    return parsedData;
  }
  return mapFromOldFormToNewForm(parsedData as SykdomsvurderingFormFields);
}

function mapFromOldFormToNewForm(oldData: SykdomsvurderingFormFields): Sykdomsvurderinger {
  return {
    vurderinger: [
      {
        ...oldData,
        fraDato: oldData.vurderingenGjelderFra,
      },
    ],
  };
}

function isNewSchema(object: any): object is Sykdomsvurderinger {
  return object instanceof Object && object['vurderinger'] != null;
}
