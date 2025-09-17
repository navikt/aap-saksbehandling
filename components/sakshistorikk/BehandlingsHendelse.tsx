import { BehandlingsHistorikk, Vurderingsbehov } from 'lib/types/types';
import { BodyShort, Detail, Label, Process, VStack } from '@navikt/ds-react';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { HistorikkEvent, mapEventTilIkon, mapEventTilString } from 'components/sakshistorikk/oversettelser';
import { mapGrunnTilString, mapTilVenteÅrsakTekst } from 'lib/utils/oversettelser';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';

interface Props {
  hendelse: BehandlingsHistorikk['hendelser'][number];
}

export const BehandlingsHendelse = ({ hendelse }: Props) => {
  const finnesÅrsak = !!(hendelse.årsakTilSattPåVent || hendelse.årsakerTilRetur.length);
  const finnesVurderingsbehov = !!hendelse.årsakerTilOpprettelse.length;
  const ikon = mapEventTilIkon(hendelse.hendelse as HistorikkEvent);
  const ikonProp = ikon ? { bullet: ikon } : {};
  return (
    <Process.Event {...ikonProp}>
      <div>
        <Label size={'medium'}>{mapEventTilString(hendelse.hendelse as HistorikkEvent)}</Label>
        <BodyShort size={'small'} textColor={'subtle'}>
          {`${formaterDatoMedTidspunktForFrontend(hendelse.tidspunkt)} ${mapUtførtAvTilTekst(hendelse.utførtAv) && '· '}${mapUtførtAvTilTekst(hendelse.utførtAv)}`}
        </BodyShort>
        <VStack gap={'2'} paddingBlock={'2 2'}>
          {finnesÅrsak && (
            <VStack>
              <Detail weight={'semibold'}>Årsak</Detail>
              {hendelse.årsakTilSattPåVent && <Detail>{mapTilVenteÅrsakTekst(hendelse.årsakTilSattPåVent)}</Detail>}
              <ul style={{ listStyleType: 'none', margin: '0', padding: '0' }}>
                {hendelse.årsakerTilRetur.map((årsak, i) => (
                  <li key={i}>
                    <Detail> {årsak.årsak === 'ANNET' ? årsak.årsakFritekst : mapGrunnTilString(årsak.årsak)}</Detail>
                  </li>
                ))}
              </ul>
            </VStack>
          )}
          {finnesVurderingsbehov && (
            <VStack>
              <Detail weight={'semibold'}>Vurderingsbehov</Detail>
              <ul style={{ listStyleType: 'none', margin: '0', padding: '0' }}>
                {hendelse.årsakerTilOpprettelse.map((årsak, i) => (
                  <li key={i}>
                    <Detail>{formaterVurderingsbehov(årsak as Vurderingsbehov)}</Detail>
                  </li>
                ))}
              </ul>
            </VStack>
          )}
          {hendelse.begrunnelse && (
            <VStack>
              <Detail weight={'semibold'}>Begrunnelse</Detail>
              <Detail>{hendelse.begrunnelse}</Detail>
            </VStack>
          )}
        </VStack>
      </div>
    </Process.Event>
  );
};

function mapUtførtAvTilTekst(utførtAv?: string | null) {
  switch (utførtAv) {
    case 'Kelvin':
      return 'Automatisk';
    case null:
      return '';
    default:
      return utførtAv;
  }
}
