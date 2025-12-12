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
        fraDato: oldData.vurderingenGjelderFra,
        begrunnelse: oldData.begrunnelse,
        harSkadeSykdomEllerLyte: oldData.harSkadeSykdomEllerLyte,
        erArbeidsevnenNedsatt: oldData.erArbeidsevnenNedsatt,
        erNedsettelseIArbeidsevneMerEnnHalvparten: oldData.erNedsettelseIArbeidsevneMerEnnHalvparten,
        erSkadeSykdomEllerLyteVesentligdel: oldData.erSkadeSykdomEllerLyteVesentligdel,
        kodeverk: oldData.kodeverk,
        hoveddiagnose: oldData.hoveddiagnose,
        bidiagnose: oldData.bidiagnose,
        erNedsettelseIArbeidsevneAvEnVissVarighet: oldData.erNedsettelseIArbeidsevneAvEnVissVarighet,
        erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: oldData.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense,
        erNedsettelseIArbeidsevneMerEnnFørtiProsent: oldData.erNedsettelseIArbeidsevneMerEnnFørtiProsent,
        yrkesskadeBegrunnelse: oldData.yrkesskadeBegrunnelse,
      },
    ],
  };
}

function isNewSchema(object: any): object is Sykdomsvurderinger {
  return object instanceof Object && object['vurderinger'] != null;
}
