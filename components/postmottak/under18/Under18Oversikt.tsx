import { BodyShort, Link, VStack } from '@navikt/ds-react';
import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import { Under18Grunnlag } from 'lib/types/postmottakTypes';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { mapBehovskodeTilBehovstype } from 'lib/utils/oversettelser';
import styles from './Under18.module.css';

function fremdrift(behandling: Under18Grunnlag['behandling']) {
  if (behandling.prosesseringFeilet) return 'Prosesseringen har feilet';
  if (behandling.vent.length) {
    return behandling.vent
      .map(({ frist }) => (frist ? `På vent til ${formaterDatoForFrontend(frist)}` : 'På vent'))
      .join(', ');
  }
  if (behandling.status === 'AVSLUTTET') return 'Avsluttet i postmottak';
  if (behandling.åpneBehov.length) {
    return behandling.åpneBehov.map(({ kode }) => mapBehovskodeTilBehovstype(kode)).join(', ');
  }
  switch (behandling.aktivtSteg) {
    case 'AVKLAR_UNDER18':
      return 'Avklar søknaden';
    case 'AVKLAR_UNDER18_SAMTYKKE':
      return 'Avklar samtykke';
    case 'OPPRETT_UNDER18_SAK':
      return 'Oppretter Kelvin-sak';
    case 'OPPRETT_UNDER18_DOKUMENTBEHANDLINGER':
      return 'Oppretter dokumentbehandlinger';
    case 'DIGITALISER_DOKUMENT':
      return 'Digitalisering';
    case 'OVERLEVER_TIL_FAGSYSTEM':
      return 'Overlevering til fagsystem';
    case 'IVERKSETTES':
      return 'Avslutter behandlingen';
    default:
      return 'Under behandling';
  }
}

export function Under18Oversikt({ grunnlag }: { grunnlag: Under18Grunnlag }) {
  const henlagt = grunnlag.behandling.status === 'AVSLUTTET' && grunnlag.søknadsavklaring?.søkerVilFortsette === false;
  return (
    <div className={styles.arbeidsflate}>
      <VilkårsKort heading="Under 18 år" titleSize="small">
        <VStack gap="space-16">
          <BodyShort size="small">{henlagt ? 'Søknaden er henlagt' : fremdrift(grunnlag.behandling)}</BodyShort>
          {grunnlag.saksnummer && <BodyShort size="small">Kelvin-sak: {grunnlag.saksnummer}</BodyShort>}
          {grunnlag.søknader.length > 0 && (
            <details open className={styles.søknader}>
              <summary>Søknader ({grunnlag.søknader.length})</summary>
              <ul>
                {grunnlag.søknader.map(({ journalpostId, tilknyttetJournalpostId, dokumentbehandling }) => (
                  <li key={journalpostId}>
                    <BodyShort size="small">
                      Journalpost {journalpostId}
                      {tilknyttetJournalpostId && ` · Tilknyttet journalpost ${tilknyttetJournalpostId}`}
                    </BodyShort>
                    {dokumentbehandling ? (
                      <>
                        <BodyShort size="small">{fremdrift(dokumentbehandling)}</BodyShort>
                        <Link href={`/postmottak/${dokumentbehandling.referanse}`}>
                          Åpne dokumentbehandling for journalpost {journalpostId}
                        </Link>
                      </>
                    ) : (
                      <BodyShort size="small">Ingen dokumentbehandling opprettet</BodyShort>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </VStack>
      </VilkårsKort>
    </div>
  );
}
