'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { KlagebehandlingKontorGrunnlag, KlagebehandlingNayGrunnlag, TypeBehandling } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { hjemmelMap } from 'lib/utils/hjemmel';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { BodyShort, Detail, VStack } from '@navikt/ds-react';
import { mapInnstillingTilTekst } from 'lib/utils/oversettelser';
import styles from './KlagebehandlingOppsummering.module.css';
import { FormEvent } from 'react';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårskortMedForm';

interface Props {
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  grunnlagNay: KlagebehandlingNayGrunnlag;
  grunnlagKontor: KlagebehandlingKontorGrunnlag;
}

const utledInnstilling = (
  grunnlagNay: KlagebehandlingNayGrunnlag,
  grunnlagKontor: KlagebehandlingKontorGrunnlag
): 'OPPRETTHOLD' | 'OMGJØR' | 'DELVIS_OMGJØR' | undefined => {
  const innstillingKontor = grunnlagKontor.vurdering?.innstilling;
  const innstillingNay = grunnlagNay.vurdering?.innstilling;

  if (!innstillingNay || !innstillingKontor) {
    return undefined;
  } else if (innstillingNay === 'OMGJØR' && innstillingKontor === 'OMGJØR') {
    return 'OMGJØR';
  } else if (innstillingKontor === 'OPPRETTHOLD' && innstillingNay === 'OPPRETTHOLD') {
    return 'OPPRETTHOLD';
  } else {
    return 'DELVIS_OMGJØR';
  }
};

const utledVilkårSomOpprettholdes = (
  grunnlagKontor: KlagebehandlingKontorGrunnlag,
  grunnlagNay: KlagebehandlingNayGrunnlag
) => {
  const kontorVilkårOpprettholdes = grunnlagKontor.vurdering?.vilkårSomOpprettholdes || [];
  const nayVilkårOppretteholdes = grunnlagNay.vurdering?.vilkårSomOpprettholdes || [];
  return [...kontorVilkårOpprettholdes, ...nayVilkårOppretteholdes];
};

const utledVilkårSomOmgjøres = (
  grunnlagKontor: KlagebehandlingKontorGrunnlag,
  grunnlagNay: KlagebehandlingNayGrunnlag
) => {
  const kontorVilkårOmgjøres = grunnlagKontor.vurdering?.vilkårSomOmgjøres || [];
  const nayVilkårOmgjøres = grunnlagNay.vurdering?.vilkårSomOmgjøres || [];
  return [...kontorVilkårOmgjøres, ...nayVilkårOmgjøres];
};

export const KlagebehandlingOppsummering = ({ behandlingVersjon, readOnly, grunnlagNay, grunnlagKontor }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('KLAGEBEHANDLING_OPPSUMMERING');

  const { visningModus, visningActions } = useVilkårskortVisning(readOnly, 'KLAGEBEHANDLING_OPPSUMMERING', undefined);

  const utledetInnstilling = utledInnstilling(grunnlagNay, grunnlagKontor);
  const vilkårSomOmgjøres = utledVilkårSomOmgjøres(grunnlagKontor, grunnlagNay);
  const vilkårSomOpprettholdes = utledVilkårSomOpprettholdes(grunnlagKontor, grunnlagNay);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    løsBehovOgGåTilNesteSteg({
      behandlingVersjon: behandlingVersjon,
      behov: {
        behovstype: Behovstype.KLAGE_OPPSUMMERING,
      },
      referanse: behandlingsreferanse,
    });
  };
  return (
    <VilkårskortMedForm
      heading={'Oppsummering av klagebehandlingen'}
      steg={'KLAGEBEHANDLING_OPPSUMMERING'}
      onSubmit={handleSubmit}
      vilkårTilhørerNavKontor={false}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      knappTekst={'Bekreft og send til beslutter'}
      visningModus={visningModus}
      visningActions={visningActions}
    >
      <VStack gap={'1'}>
        <BodyShort size={'small'} weight={'semibold'}>
          Hva er innstillingen til klagen fra NAY og Nav-kontor?
        </BodyShort>
        <BodyShort size={'small'}>{utledetInnstilling && mapInnstillingTilTekst(utledetInnstilling)}</BodyShort>
      </VStack>

      {vilkårSomOmgjøres.length > 0 && (
        <VStack gap={'1'}>
          <BodyShort size={'small'} weight={'semibold'}>
            Hvilke vilkår skal omgjøres?
          </BodyShort>
          <Detail className={styles.detailgray}>Alle påklagde vilkår som skal omgjøres som følge av klagen</Detail>
          {vilkårSomOmgjøres.map((vilkår, index) => {
            return (
              <BodyShort key={vilkår + index} size={'small'}>
                {hjemmelMap[vilkår]}
              </BodyShort>
            );
          })}
        </VStack>
      )}

      {vilkårSomOpprettholdes.length > 0 && (
        <VStack gap={'1'}>
          <BodyShort size={'small'} weight={'semibold'}>
            Hvilke vilkår er blitt vurdert til å opprettholdes?{' '}
          </BodyShort>
          <Detail className={styles.detailgray}>Alle påklagde vilkår som blir opprettholdt</Detail>
          {vilkårSomOpprettholdes.map((vilkår, index) => {
            return (
              <BodyShort key={vilkår + index} size={'small'}>
                {hjemmelMap[vilkår]}
              </BodyShort>
            );
          })}
        </VStack>
      )}
    </VilkårskortMedForm>
  );
};
