import { SykdomsvurderingerForm } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingPeriodisert';
import { SykdomsvurderingFormFields } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { v4 as uuidv4 } from 'uuid';

export function parseOgMigrerMellomlagretData(data: string): SykdomsvurderingerForm {
  const parsedData = JSON.parse(data);
  if (isNewSchema(parsedData)) {
    return parsedData;
  }
  return mapFromOldFormToNewForm(parsedData as SykdomsvurderingFormFields);
}

function mapFromOldFormToNewForm(oldData: SykdomsvurderingFormFields): SykdomsvurderingerForm {
  return {
    vurderinger: [
      {
        ...oldData,
        fraDato: oldData.vurderingenGjelderFra,
        accordionId: uuidv4(),
      },
    ],
  };
}

function isNewSchema(object: any): object is SykdomsvurderingerForm {
  return object instanceof Object && object['vurderinger'] != null;
}
