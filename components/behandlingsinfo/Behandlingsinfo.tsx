import { BodyShort, HGrid, Label, VStack } from '@navikt/ds-react';
import { DetaljertBehandling, Klageresultat, RettighetsinfoDto, SaksInfo } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

import { formaterKlageresultat } from 'lib/utils/klageresultat';
import Link from 'next/link';

import styles from './Behandlingsinfo.module.css';

interface Props {
  behandling: DetaljertBehandling;
  sak: SaksInfo;
  klageresultat?: Klageresultat;
  rettighetsinfo?: RettighetsinfoDto | null;
}

export const Behandlingsinfo = ({ behandling, sak, klageresultat, rettighetsinfo }: Props) => {
  const vedtaksdato = behandling.vedtaksdato;
  const erFørstegangsbehandlingEllerRevurdering =
    behandling.type === 'Førstegangsbehandling' || behandling.type === 'Revurdering';
  const erKlagebehandling = behandling.type === 'Klage';
  const erSvarFraKabal = behandling.type === 'SvarFraAndreinstans';

  return (
    <VStack gap={'space-16'} className={styles.behandlingsinformasjon}>
      <HGrid columns={'1fr 1fr'} gap="space-4" margin={'space-16'}>
        <Label as="p" size={'small'}>
          Behandling opprettet:
        </Label>
        <BodyShort size={'small'}>{formaterDatoForFrontend(behandling.opprettet)}</BodyShort>
        {vedtaksdato && (
          <>
            <Label as="p" size={'small'}>
              Vedtaksdato:
            </Label>
            <BodyShort size={'small'}>{formaterDatoForFrontend(vedtaksdato)}</BodyShort>
          </>
        )}
        {erFørstegangsbehandlingEllerRevurdering && (
          <>
            <Label as="p" size={'small'}>
              Virkningstidspunkt{behandling.virkningstidspunkt == null && ' (foreløpig)'}:
            </Label>
            <BodyShort size={'small'}>
              {behandling.virkningstidspunkt == null
                ? formaterDatoForFrontend(sak.periode.fom)
                : formaterDatoForFrontend(behandling.virkningstidspunkt)}
            </BodyShort>
            {rettighetsinfo?.sisteDagMedRett && (
              <>
                <Label as="p" size={'small'}>
                  AAP maksdato:
                </Label>
                <BodyShort size={'small'}>{formaterDatoForFrontend(rettighetsinfo.sisteDagMedRett)}</BodyShort>
              </>
            )}
          </>
        )}
        {erSvarFraKabal && behandling.tilhørendeKlagebehandling && (
          <>
            <BodyShort size={'small'}>
              <Link
                prefetch={false}
                href={`/saksbehandling/sak/${sak.saksnummer}/${behandling.tilhørendeKlagebehandling}`}
              >
                Tilhørende klagebehandling
              </Link>
            </BodyShort>
          </>
        )}
        {erKlagebehandling && (
          <>
            {behandling.kravMottatt && (
              <>
                <Label as="p" size={'small'}>
                  Krav mottatt:
                </Label>
                <BodyShort size={'small'}>{formaterDatoForFrontend(behandling.kravMottatt)}</BodyShort>
              </>
            )}
            <Label as="p" size={'small'}>
              Resultat:
            </Label>
            <BodyShort size={'small'}>{formaterKlageresultat(klageresultat)}</BodyShort>
          </>
        )}
      </HGrid>
    </VStack>
  );
};
