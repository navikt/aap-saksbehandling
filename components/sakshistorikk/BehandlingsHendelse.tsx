import { BehandlingsHistorikk } from 'lib/types/types';
import { BodyShort, Detail, Process, VStack } from '@navikt/ds-react';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { HistorikkEvent, mapEventTilIkon, mapEventTilString } from 'components/sakshistorikk/oversettelser';
import { mapGrunnTilString, mapTilVenteÅrsakTekst, mapTilÅrsakTilOpprettelseTilTekst } from 'lib/utils/oversettelser';

interface Props {
  hendelse: BehandlingsHistorikk['hendelser'][number];
}

export const BehandlingsHendelse = ({ hendelse }: Props) => {
  const finnesÅrsak = !!(
    hendelse.årsakTilSattPåVent ||
    hendelse.årsakerTilRetur.length ||
    hendelse.årsakerTilOpprettelse.length
  );
  const ikon = mapEventTilIkon(hendelse.hendelse as HistorikkEvent);
  const ikonProp = ikon ? { bullet: ikon } : {};
  return (
    <Process.Event {...ikonProp}>
      <div>
        <BodyShort size={'small'}>{mapEventTilString(hendelse.hendelse as HistorikkEvent)}</BodyShort>
        <Detail textColor={'subtle'}>
          {`${formaterDatoMedTidspunktForFrontend(hendelse.tidspunkt)} ${mapUtførtAvTilTekst(hendelse.utførtAv) && '· '}${mapUtførtAvTilTekst(hendelse.utførtAv)}`}
        </Detail>
        {finnesÅrsak && (
          <VStack gap={'2'} paddingBlock={'2 2'}>
            <section>
              <Detail weight={'semibold'}>Årsak</Detail>
              {hendelse.årsakTilSattPåVent && <Detail>{mapTilVenteÅrsakTekst(hendelse.årsakTilSattPåVent)}</Detail>}
              {
                <ul style={{ listStyleType: 'none', margin: '0', padding: '0' }}>
                  {hendelse.årsakerTilOpprettelse.map((årsak, i) => (
                    <li key={i}>
                      <Detail>
                        {
                          // @ts-ignore
                          mapTilÅrsakTilOpprettelseTilTekst(årsak)
                        }
                      </Detail>
                    </li>
                  ))}
                </ul>
              }
              {
                <ul style={{ listStyleType: 'none', margin: '0', padding: '0' }}>
                  {hendelse.årsakerTilRetur.map((årsak, i) => (
                    <li key={i}>
                      <Detail> {årsak.årsak === 'ANNET' ? årsak.årsakFritekst : mapGrunnTilString(årsak.årsak)}</Detail>
                    </li>
                  ))}
                </ul>
              }
            </section>
            {hendelse.begrunnelse && (
              <VStack>
                <Detail weight={'semibold'}>Begrunnelse</Detail>
                <BodyShort size={'small'}>{hendelse.begrunnelse}</BodyShort>
              </VStack>
            )}
          </VStack>
        )}
      </div>
    </Process.Event>
  );
};

function mapUtførtAvTilTekst(utførtAv?: string | null) {
  switch (utførtAv) {
    case 'Kelvin':
      return 'Automatisk';
    default:
      return '';
  }
}
