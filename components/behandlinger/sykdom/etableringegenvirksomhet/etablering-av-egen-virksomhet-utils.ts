import {
  EtableringEgenVirksomhetGrunnlagResponse,
  EtableringEgenVirksomhetLøsningDto,
  EtableringEgenVirksomhetVurderingResponse,
} from 'lib/types/types';
import {
  EtableringAvEgenVirksomhetForm,
  EtableringAvEgenVirksomhetVurderingForm,
} from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhet';
import { hentPerioderSomTrengerVurdering, trengerVurderingsForslag } from 'lib/utils/periodisering';
import { getJaNeiEllerUndefined, getTrueFalseEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { Dato } from 'lib/types/Dato';
import { subDays } from 'date-fns';

export function getDefaultValuesFromGrunnlag(
  grunnlag: EtableringEgenVirksomhetGrunnlagResponse
): EtableringAvEgenVirksomhetForm {
  if (grunnlag.behøverVurderinger.length > 0) {
    return {
      ...hentPerioderSomTrengerVurdering<EtableringAvEgenVirksomhetVurderingForm>(
        grunnlag,
        tomEtableringAvEgenVirksomhetVurdering
      ),
      virksomhetNavn: '',
    };
  }

  // Vi har allerede data lagret, vis enten de som er lagret i grunnlaget her eller tom liste
  return {
    virksomhetNavn: grunnlag.nyeVurderinger.find((e) => e.virksomhetNavn)?.virksomhetNavn || '',
    vurderinger: grunnlag.nyeVurderinger.map((vurdering) => ({
      fraDato: new Dato(vurdering.fom).formaterForFrontend(),
      begrunnelse: vurdering.begrunnelse,
      erVirksomhetenNy: getJaNeiEllerUndefined(vurdering.virksomhetErNy),
      foreliggerEnNæringsfagligVurdering: getJaNeiEllerUndefined(vurdering.foreliggerFagligVurdering),
      eierBrukerVirksomheten: vurdering.brukerEierVirksomheten,
      antasDetAtEtableringenFørerTilSelvforsørgelse: getJaNeiEllerUndefined(vurdering.kanFøreTilSelvforsørget),
      utviklingsperioder: vurdering.utviklingsPeriode.map((periode) => ({
        fom: new Dato(periode.fom).formaterForFrontend(),
        tom: periode.tom ? new Dato(periode.tom).formaterForFrontend() : '',
      })),
      oppstartsperioder: vurdering.oppstartsPeriode.map((periode) => ({
        fom: new Dato(periode.fom).formaterForFrontend(),
        tom: periode.tom ? new Dato(periode.tom).formaterForFrontend() : '',
      })),
    })),
  };
}
export function mapEtableringEgenVirksomhetVurderingTilDto(
  vurdering: EtableringAvEgenVirksomhetVurderingForm,
  virksomhetNavn: string,
  tilDato: string | undefined
): EtableringEgenVirksomhetLøsningDto {
  return {
    fom: new Dato(vurdering.fraDato!).formaterForBackend(),
    tom: tilDato ? new Dato(subDays(new Dato(tilDato).dato, 1)).formaterForBackend() : null,
    begrunnelse: vurdering.begrunnelse,
    virksomhetErNy: vurdering.erVirksomhetenNy === JaEllerNei.Ja,
    brukerEierVirksomheten: vurdering.eierBrukerVirksomheten || null,
    foreliggerFagligVurdering: vurdering.foreliggerEnNæringsfagligVurdering === JaEllerNei.Ja,
    kanFøreTilSelvforsørget: getTrueFalseEllerUndefined(vurdering.antasDetAtEtableringenFørerTilSelvforsørgelse),
    oppstartsPerioder: vurdering.oppstartsperioder.map((periode) => ({
      fom: new Dato(periode.fom).formaterForBackend(),
      tom: new Dato(periode.tom).formaterForBackend(),
    })),
    utviklingsPerioder: vurdering.utviklingsperioder.map((periode) => ({
      fom: new Dato(periode.fom).formaterForBackend(),
      tom: new Dato(periode.tom).formaterForBackend(),
    })),
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
    fraDato: undefined,
    oppstartsperioder: [],
    utviklingsperioder: [],
    erNyVurdering: true,
  };
}

export function nyVurderingErOppfylt(vurdering: EtableringAvEgenVirksomhetVurderingForm): boolean | undefined {
  if (
    vurdering.foreliggerEnNæringsfagligVurdering === JaEllerNei.Nei ||
    vurdering.erVirksomhetenNy === JaEllerNei.Nei ||
    vurdering.eierBrukerVirksomheten === 'NEI' ||
    vurdering.antasDetAtEtableringenFørerTilSelvforsørgelse === JaEllerNei.Nei
  ) {
    return false;
  }

  if (
    vurdering.foreliggerEnNæringsfagligVurdering === JaEllerNei.Ja &&
    vurdering.erVirksomhetenNy === JaEllerNei.Ja &&
    (vurdering.eierBrukerVirksomheten === 'EIER_MINST_50_PROSENT' ||
      vurdering.eierBrukerVirksomheten === 'EIER_MINST_50_PROSENT_MED_FLER') &&
    vurdering.antasDetAtEtableringenFørerTilSelvforsørgelse === JaEllerNei.Ja
  ) {
    return true;
  }
}

export function tidligereVurderingErOppfylt(vurdering: EtableringEgenVirksomhetVurderingResponse): boolean | undefined {
  if (
    vurdering.foreliggerFagligVurdering === false ||
    vurdering.virksomhetErNy === false ||
    vurdering.brukerEierVirksomheten === 'NEI' ||
    vurdering.kanFøreTilSelvforsørget === false
  ) {
    return false;
  }

  if (
    vurdering.foreliggerFagligVurdering === true &&
    vurdering.virksomhetErNy === true &&
    (vurdering.brukerEierVirksomheten === 'EIER_MINST_50_PROSENT' ||
      vurdering.brukerEierVirksomheten === 'EIER_MINST_50_PROSENT_MED_FLER') &&
    vurdering.kanFøreTilSelvforsørget === true
  ) {
    return true;
  }
}
