import styles from 'components/vilkårsoppsummering/Vilkårsoppsummering.module.css';
import { Vilkår, VilkårType } from 'lib/types/types';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { vilkårErOppfylt } from 'components/vilkårsoppsummering/Vilkårsoppsummering';
import { BodyShort } from '@navikt/ds-react';

interface Props {
  vilkår: Vilkår;
}
export const VilkårsoppsummeringItem = ({ vilkår }: Props) => {
  return (
    <BodyShort className={styles.vilkårsitem}>
      {vilkårErOppfylt(vilkår) ? (
        <CheckmarkCircleFillIcon title="vilkår-oppfylt" className={styles.oppfyltIcon} />
      ) : (
        <XMarkOctagonFillIcon title={'vilkår-avslått'} className={styles.avslåttIcon} />
      )}
      {mapVilkårTypeTilVilkårNavn(vilkår.vilkårtype)}
    </BodyShort>
  );
};

function mapVilkårTypeTilVilkårNavn(steg: VilkårType): string {
  switch (steg) {
    case 'ALDERSVILKÅRET':
      return 'Alder';
    case 'SYKDOMSVILKÅRET':
      return 'Sykdom';
    case 'BISTANDSVILKÅRET':
      return 'Oppfølging';
    case 'MEDLEMSKAP':
      return 'Medlemskap';
    case 'GRUNNLAGET':
      return 'Grunnlaget';
    case 'SYKEPENGEERSTATNING':
      return 'Sykepengeerstatning';
  }
}
