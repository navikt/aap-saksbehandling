import { FlytGruppe, FlytSteg } from 'lib/types/types';
import { Accordion, BodyShort } from '@navikt/ds-react';

import styles from './Vilkårsoppsummering.module.css';
import { VilkårsoppsummeringItem } from 'components/vilkårsoppsummering/VilkårsoppsummeringItem';

interface Props {
  flytGrupper: FlytGruppe[];
}

export const Vilkårsoppsummering = ({ flytGrupper }: Props) => {
  return (
    <div>
      <BodyShort>
        {flytGrupper.filter(gruppeStegErOppfylt).length} av {flytGrupper.length} vilkår oppfylt
      </BodyShort>
      <Accordion aria-label={'vilkårsoppsummering'} className={styles.vilkårsoppsummering} size={'small'}>
        {flytGrupper.map((gruppeSteg) => {
          return <VilkårsoppsummeringItem key={gruppeSteg.stegGruppe} gruppeSteg={gruppeSteg} />;
        })}
      </Accordion>
    </div>
  );
};

export function stegErOppfylt(steg: FlytSteg): boolean {
  return !!steg.vilkårDTO?.perioder.find((periode) => periode.utfall === 'OPPFYLT');
}

export function gruppeStegErOppfylt(gruppeSteg: FlytGruppe): boolean {
  return gruppeSteg.steg.every(stegErOppfylt);
}
