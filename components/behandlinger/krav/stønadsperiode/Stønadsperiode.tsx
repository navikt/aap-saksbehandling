'use client';

import { List } from '@navikt/ds-react';
import { StønadsperiodeGrunnlag } from 'lib/types/types';

import { StønadsperiodeTabell } from 'components/behandlinger/krav/stønadsperiode/StønadsperiodeTabell';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';

interface Props {
  behandlingVersjon: number;
  grunnlag: StønadsperiodeGrunnlag;
  readOnly: boolean;
}
export const Stønadsperiode = ({ grunnlag }: Props) => {
  return (
    <VilkårsKort heading={'Forskrift om AAP § 12. Ny stønadsperiode'} steg={'AVKLAR_STØNADSPERIODE'}>
      <List size={'small'}>
        <List.Item>
          For hvert relevante krav vurderes det om det er et krav om gjenopptak av en tidligere stønadsperiode eller ny
          periode basert på gjenværende ordinær kvote og over / under 52 uker siden bruker har hatt ytelse.
        </List.Item>
        <List.Item>
          Et krav kan også avslås på § 12 i AAP-forskriften hvis det ikke er mulig å forutse om brukeren kan bruke opp
          en eksisterende stønadsperiode.
        </List.Item>
        <List.Item>Automatisk vurdering er basert på forrige vedtatte behandling.</List.Item>
      </List>
      <StønadsperiodeTabell grunnlag={grunnlag} />
    </VilkårsKort>
  );
};
