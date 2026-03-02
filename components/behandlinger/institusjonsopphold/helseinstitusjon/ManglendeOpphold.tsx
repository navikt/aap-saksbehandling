import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { Alert } from '@navikt/ds-react';
import styles from './Helseinstitusjon.module.css';

export const ManglendeOpphold = () => {
  return (
    <VilkårsKort heading={'§ 11-25 Helseinstitusjon'} steg={'DU_ER_ET_ANNET_STED'}>
      <Alert size={'small'} aria-label={'Institusjonsopphold'} variant={'info'} className={styles.infobox}>
        <div className={styles.content}>
          <span>
            Brukeren har et institusjonsopphold, men brukeren kan enten ha barnetillegg, eller at oppholdet varer for
            kort til at AAP kan reduseres.
          </span>
        </div>
      </Alert>
    </VilkårsKort>
  );
};
