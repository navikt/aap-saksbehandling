import { ServerSentEventData } from 'app/saksbehandling/api/behandling/hent/[referanse]/[gruppe]/[steg]/nesteSteg/route';
import {
  FatteVedtakLøsning,
  KvalitetssikringLøsning,
  LøsAvklaringsbehovPåBehandling,
  LøsPeriodisertBehovPåBehandling,
} from 'lib/types/types';
import { clientHentTilgangForKvalitetssikring, clientSjekkTilgang } from 'lib/clientApi';
import { isSuccess } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

export const harUnderkjentVurdering = (
  behov: LøsAvklaringsbehovPåBehandling | LøsPeriodisertBehovPåBehandling
): boolean => {
  const brukerHarKvalitetssikret = behov.behov.behovstype === Behovstype.KVALITETSSIKRING_KODE;
  const brukerHarBesluttet = behov.behov.behovstype === Behovstype.FATTE_VEDTAK_KODE;

  if (brukerHarKvalitetssikret || brukerHarBesluttet) {
    const løsning = behov.behov as KvalitetssikringLøsning | FatteVedtakLøsning;
    return løsning.vurderinger.some((vurdering) => vurdering.godkjent === false);
  }
  return false;
};

export const skalViseIngenFlereOppgaverModal = async (
  eventData: ServerSentEventData,
  behandlingsreferanse: string,
  underkjennelseIKvalitetssikringEllerBeslutning: boolean
): Promise<boolean> => {
  const { gjeldendeSteg, skalBytteGruppe, aktivtStegBehovsKode, aktivtVisningSteg } = eventData;

  let kanFortsetteSaksbehandling = false;
  const skalKvalitetssikre = gjeldendeSteg === 'KVALITETSSIKRING';

  if (skalKvalitetssikre) {
    const respons = await clientHentTilgangForKvalitetssikring(behandlingsreferanse);
    if (isSuccess(respons)) {
      kanFortsetteSaksbehandling = respons.data.harTilgangTilÅKvalitetssikre;
    }
  } else if (aktivtStegBehovsKode) {
    kanFortsetteSaksbehandling = (
      await Promise.all(aktivtStegBehovsKode.map((kode) => clientSjekkTilgang(behandlingsreferanse, kode)))
    ).some((tilgangResponse) => isSuccess(tilgangResponse) && tilgangResponse.data.tilgang);
  }

  const saksbehandlerHarSendtTilBeslutter = gjeldendeSteg === 'FATTE_VEDTAK' && (skalBytteGruppe ?? false);

  // TODO Brev har ingen egen definisjonskode som vi kan hente ut fra steget. Må skrives om i backend
  return (
    (!kanFortsetteSaksbehandling && aktivtVisningSteg !== 'BREV') ||
    underkjennelseIKvalitetssikringEllerBeslutning ||
    saksbehandlerHarSendtTilBeslutter
  );
};
