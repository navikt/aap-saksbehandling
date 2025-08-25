import { BehandlingsHistorikk } from 'lib/types/types';
import { BodyShort, HGrid, HStack, Link, VStack } from '@navikt/ds-react';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { HistorikkEvent, mapEventTilIkon, mapEventTilString } from 'components/behandlingshistorikk/oversettelser';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

interface Props {
  hendelse: BehandlingsHistorikk['hendelser'][number];
  førsteHendelse: boolean;
  sisteHendelse: boolean;
  visLinje: boolean;
  medKollapsKnapp?: boolean;
  erKollapset?: boolean;
  toggleKollaps?: () => void;
}

export const BehandlingsHendelse = ({
  hendelse,
  visLinje,
  medKollapsKnapp,
  erKollapset,
  toggleKollaps,
  førsteHendelse,
  sisteHendelse,
}: Props) => {
  return (
    <>
      <li style={{ listStyleType: 'none' }}>
        <HGrid columns={'1fr 5fr'}>
          <HGrid columns={'1fr'}>
            {!førsteHendelse && (
              <HStack align={'center'} justify={'center'}>
                <span
                  style={{
                    borderLeft: '1px solid #071A3636',
                    height: '100%',
                    width: '0',
                  }}
                />
              </HStack>
            )}
            <HStack align={'center'} justify={'center'}>
              <HStack
                align={'center'}
                justify={'center'}
                style={{
                  width: '3rem',
                  height: '3rem',
                  border: '1px solid #071A3636',
                  borderRadius: '50%',
                }}
              >
                {mapEventTilIkon(hendelse.hendelse as HistorikkEvent)}
              </HStack>
            </HStack>

            {!sisteHendelse && (
              <HStack align={'center'} justify={'center'}>
                <span
                  style={{
                    borderLeft: '1px solid #071A3636',
                    height: '100%',
                    width: '0',
                  }}
                />
              </HStack>
            )}
          </HGrid>
          <div>
            <BodyShort>{mapEventTilString(hendelse.hendelse as HistorikkEvent)}</BodyShort>
            <BodyShort size={'small'}>
              {`${formaterDatoMedTidspunktForFrontend(hendelse.tidspunkt)} · ${hendelse.utførtAv}`}
            </BodyShort>
            {hendelse.årsakTilSattPåVent && <BodyShort size={'small'}>{hendelse.årsakTilSattPåVent}</BodyShort>}
            {
              <ul style={{ listStyleType: 'none', margin: '0', padding: '0' }}>
                {hendelse.årsakerTilOpprettelse.map((årsak, i) => (
                  <li key={i}>
                    <BodyShort size={'small'}>{årsak}</BodyShort>
                  </li>
                ))}
              </ul>
            }
            {
              <ul style={{ listStyleType: 'none', margin: '0', padding: '0' }}>
                {hendelse.årsakerTilRetur.map((årsak, i) => (
                  <li key={i}>
                    <BodyShort size={'small'}> {årsak.årsak === 'ANNET' ? årsak.årsakFritekst : årsak.årsak}</BodyShort>
                  </li>
                ))}
              </ul>
            }
            {hendelse.begrunnelse && <BodyShort size={'small'}>{hendelse.begrunnelse}</BodyShort>}
          </div>
          {visLinje && (
            <HStack align={'center'} justify={'center'}>
              <span
                style={{
                  borderLeft: '1px solid #071A3636',
                  height: '2.5rem',
                  width: '0',
                }}
              />
            </HStack>
          )}
        </HGrid>
      </li>
      {medKollapsKnapp && (
        <li style={{ listStyleType: 'none' }}>
          <HGrid columns={'1fr 5fr'}>
            <VStack justify={'center'} align={'center'}>
              <HStack
                align={'center'}
                justify={'center'}
                height={'2rem'}
                width={'2rem'}
                style={{
                  border: '1px solid #071A3636',
                  borderRadius: '50%',
                }}
              >
                {erKollapset ? (
                  <ChevronDownIcon title="a11y-title" fontSize="1.1rem" />
                ) : (
                  <ChevronUpIcon title="a11y-title" fontSize="1.1rem" />
                )}
              </HStack>
            </VStack>
            <Link
              as={'button'}
              style={{ border: '0', margin: '0', padding: '0', backgroundColor: 'white' }}
              onClick={() => toggleKollaps && toggleKollaps()}
            >
              {erKollapset ? `Se all historikk i behandlingen` : `Skjul all historikk i behandlingen`}
            </Link>
            {visLinje && (
              <HStack align={'center'} justify={'center'}>
                <span
                  style={{
                    borderLeft: '1px solid #071A3636',
                    height: '2.5rem',
                    width: '0',
                  }}
                />
              </HStack>
            )}
          </HGrid>
        </li>
      )}
    </>
  );
};
