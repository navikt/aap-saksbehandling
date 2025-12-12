import { BistandForm } from 'components/behandlinger/sykdom/bistandsbehov/BistandsbehovPeriodisert';
import { JaEllerNei } from 'lib/utils/form';

interface BistandFormOld {
  begrunnelse: string;
  erBehovForAktivBehandling: string;
  erBehovForArbeidsrettetTiltak: string;
  erBehovForAnnenOppfølging?: string;
  overgangBegrunnelse?: string;
  skalVurdereAapIOvergangTilArbeid?: string;
}

export function parseOgMigrerMellomlagretData(data: string, foersteFraDato: string | undefined): BistandForm {
  const parsedData = JSON.parse(data);
  if (isNewSchema(parsedData)) {
    return parsedData;
  }
  return mapFromOldFormToNewForm(parsedData as BistandFormOld, foersteFraDato);
}

function mapFromOldFormToNewForm(oldData: BistandFormOld, foersteFraDato: string | undefined): BistandForm {
  return {
    vurderinger: [
      {
        fraDato: foersteFraDato || '',
        begrunnelse: oldData.begrunnelse,
        erBehovForAktivBehandling: oldData.erBehovForAktivBehandling as JaEllerNei,
        erBehovForArbeidsrettetTiltak: oldData.erBehovForArbeidsrettetTiltak as JaEllerNei,
        erBehovForAnnenOppfølging: oldData.erBehovForAnnenOppfølging as JaEllerNei,
        overgangBegrunnelse: oldData.overgangBegrunnelse,
        skalVurdereAapIOvergangTilArbeid: oldData.skalVurdereAapIOvergangTilArbeid as JaEllerNei,
      },
    ],
  };
}

function isNewSchema(object: any): object is BistandForm {
  return object instanceof Object && object['vurderinger'] != null;
}
