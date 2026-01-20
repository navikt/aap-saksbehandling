import { BistandVurderingForm } from 'components/behandlinger/sykdom/bistandsbehov/BistandsbehovPeriodisert';
import { subDays } from 'date-fns';
import { formaterDatoForBackend } from 'lib/utils/date';
import { JaEllerNei } from 'lib/utils/form';
import { Dato } from 'lib/types/Dato';

export function mapBistandVurderingFormTilDto(vurdering: BistandVurderingForm, tilDato: string | undefined) {
  return {
    fom: new Dato(vurdering.fraDato).formaterForBackend(),
    tom: tilDato ? formaterDatoForBackend(subDays(new Dato(tilDato).dato, 1)) : null,
    begrunnelse: vurdering.begrunnelse,
    erBehovForAktivBehandling: vurdering.erBehovForAktivBehandling === JaEllerNei.Ja,
    erBehovForArbeidsrettetTiltak: vurdering.erBehovForArbeidsrettetTiltak === JaEllerNei.Ja,
    erBehovForAnnenOppfølging: vurdering.erBehovForAnnenOppfølging
      ? vurdering.erBehovForAnnenOppfølging === JaEllerNei.Ja
      : undefined,
    ...(vurdering.erBehovForAktivBehandling === JaEllerNei.Nei &&
      vurdering.erBehovForAktivBehandling === JaEllerNei.Nei &&
      vurdering.erBehovForAnnenOppfølging === JaEllerNei.Nei && {
        skalVurdereAapIOvergangTilArbeid: vurdering.skalVurdereAapIOvergangTilArbeid === JaEllerNei.Ja,
        overgangBegrunnelse: vurdering.overgangBegrunnelse,
      }),
  };
}
