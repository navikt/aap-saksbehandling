import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { PadlockLockedIcon } from '@navikt/aksel-icons';
import { Alert } from '@navikt/ds-react';

export const Soningsvurdering = () => {
  return (
    <VilkårsKort heading={'Soning § 11-26'} steg={'DU_ER_ET_ANNET_STED'} icon={<PadlockLockedIcon />}>
      <Alert variant={'warning'}>Vi har fått informasjon om at søker har soningsforhold</Alert>
    </VilkårsKort>
  );
};
