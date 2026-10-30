import { subDays } from 'date-fns';
import { Dato } from 'lib/types/Dato';
import {
  EtableringEgenVirksomhetGrunnlagResponse,
  EtableringEgenVirksomhetLøsningDto,
  EtableringEgenVirksomhetVurderingResponse,
} from 'lib/types/types';
import { getJaNeiEllerUndefined, getTrueFalseEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { hentPerioderSomTrengerVurdering } from 'lib/utils/periodisering';

import {
  EtableringAvEgenVirksomhetForm,
  EtableringAvEgenVirksomhetVurderingForm,
} from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhetNy';

export function getDefaultValuesFromGrunnlag(
  grunnlag: EtableringEgenVirksomhetGrunnlagResponse
): EtableringAvEgenVirksomhetForm {
  if (grunnlag.behøverVurderinger.length > 0) {
    return {
      ...hentPerioderSomTrengerVurdering(grunnlag, tomEtableringAvEgenVirksomhetVurdering),
      virksomhetNavn: '',
    };
  }

  // Vi har allerede data lagret, vis enten de som er lagret i grunnlaget her eller tom liste
  return {
    virksomhetNavn: grunnlag.nyeVurderinger.find((e) => e.virksomhetNavn)?.virksomhetNavn || '',
    vurderinger: grunnlag.nyeVurderinger.map((vurdering) => ({
      fraDato: new Dato(vurdering.fom).formaterForFrontend(),
      begrunnelse: vurdering.begrunnelse,
      versjon: vurdering.versjon,
      erVirksomhetenNy: getJaNeiEllerUndefined(vurdering.virksomhetErNy),
      foreliggerEnNæringsfagligVurdering: getJaNeiEllerUndefined(vurdering.foreliggerFagligVurdering),
      eierBrukerVirksomheten: vurdering.brukerEierVirksomheten,
      antasDetAtEtableringenFørerTilSelvforsørgelse: getJaNeiEllerUndefined(vurdering.kanFøreTilSelvforsørget),
      jobberBrukerAktivMedVirksomheten: getJaNeiEllerUndefined(vurdering.jobberBrukerAktivMedVirksomheten),
      erNyVurdering: false,
      behøverVurdering: false,
      fase: vurdering.fase,
      erRegistrertINødvendigeOffentligeRegister: getJaNeiEllerUndefined(
        vurdering.erRegistrertINødvendigeOffentligeRegister
      ),
    })),
  };
}
export function mapEtableringEgenVirksomhetVurderingTilDto(
  vurdering: EtableringAvEgenVirksomhetVurderingForm,
  virksomhetNavn: string,
  tilDato: string | undefined,
  versjon: EtableringEgenVirksomhetLøsningDto['versjon']
): EtableringEgenVirksomhetLøsningDto {
  return {
    fom: new Dato(vurdering.fraDato).formaterForBackend(),
    tom: tilDato ? new Dato(subDays(new Dato(tilDato).dato, 1)).formaterForBackend() : null,
    begrunnelse: vurdering.begrunnelse,
    versjon,
    virksomhetErNy: vurdering.erVirksomhetenNy === JaEllerNei.Ja,
    brukerEierVirksomheten: vurdering.eierBrukerVirksomheten || null,
    foreliggerFagligVurdering: vurdering.foreliggerEnNæringsfagligVurdering === JaEllerNei.Ja,
    kanFøreTilSelvforsørget: getTrueFalseEllerUndefined(vurdering.antasDetAtEtableringenFørerTilSelvforsørgelse),
    fase: vurdering.fase || null,
    erRegistrertINødvendigeOffentligeRegister: getTrueFalseEllerUndefined(
      vurdering.erRegistrertINødvendigeOffentligeRegister
    ),
    jobberBrukerAktivMedVirksomheten: getTrueFalseEllerUndefined(vurdering.jobberBrukerAktivMedVirksomheten),
    virksomhetNavn,
  };
}

export function tomEtableringAvEgenVirksomhetVurdering(): EtableringAvEgenVirksomhetVurderingForm {
  return {
    antasDetAtEtableringenFørerTilSelvforsørgelse: undefined,
    begrunnelse: '',
    eierBrukerVirksomheten: undefined,
    erVirksomhetenNy: undefined,
    foreliggerEnNæringsfagligVurdering: undefined,
    fraDato: '',
    fase: undefined,
    erRegistrertINødvendigeOffentligeRegister: undefined,
    erNyVurdering: true,
    behøverVurdering: false,
    jobberBrukerAktivMedVirksomheten: undefined,
  };
}

export function nyVurderingErOppfylt(vurdering?: EtableringAvEgenVirksomhetVurderingForm): boolean | undefined {
  if (!vurdering) {
    return undefined;
  }
  if (
    vurdering.foreliggerEnNæringsfagligVurdering === JaEllerNei.Nei ||
    vurdering.erVirksomhetenNy === JaEllerNei.Nei ||
    vurdering.eierBrukerVirksomheten === 'NEI' ||
    vurdering.jobberBrukerAktivMedVirksomheten === JaEllerNei.Nei ||
    vurdering.antasDetAtEtableringenFørerTilSelvforsørgelse === JaEllerNei.Nei ||
    (vurdering.fase === 'OPPSTART' && vurdering.erRegistrertINødvendigeOffentligeRegister === JaEllerNei.Nei) ||
    vurdering.fase === undefined
  ) {
    return false;
  }

  if (
    vurdering.foreliggerEnNæringsfagligVurdering === JaEllerNei.Ja &&
    vurdering.erVirksomhetenNy === JaEllerNei.Ja &&
    vurdering.jobberBrukerAktivMedVirksomheten === JaEllerNei.Ja &&
    (vurdering.eierBrukerVirksomheten === 'EIER_MINST_50_PROSENT' ||
      vurdering.eierBrukerVirksomheten === 'EIER_MINST_50_PROSENT_MED_FLER') &&
    vurdering.antasDetAtEtableringenFørerTilSelvforsørgelse === JaEllerNei.Ja &&
    (vurdering.fase === 'UTVIKLING' ||
      (vurdering.fase === 'OPPSTART' && vurdering.erRegistrertINødvendigeOffentligeRegister === JaEllerNei.Ja))
  ) {
    return true;
  }
}

export function tidligereVurderingErOppfylt(vurdering: EtableringEgenVirksomhetVurderingResponse): boolean | undefined {
  return vurdering.oppfylt;
}
