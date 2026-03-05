import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { Alert } from '@navikt/ds-react';

export const ManglendeOpphold = () => {
  return (
    <VilkårsKort heading={'§ 11-25 Helseinstitusjon'} steg={'DU_ER_ET_ANNET_STED'}>
      <Alert size={'small'} aria-label={'Institusjonsopphold'} variant={'info'}>
        Brukeren har et institusjonsopphold, men brukeren kan enten ha barnetillegg, eller at oppholdet varer for kort
        til at AAP kan reduseres.
      </Alert>
    </VilkårsKort>
  );
};
