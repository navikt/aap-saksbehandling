import { BehandlingResultat, Vilkår, Vilkårsperiode } from 'lib/types/types';
import { BodyShort } from '@navikt/ds-react';
import { VilkårsoppsummeringItem } from 'components/vilkårsoppsummering/VilkårsoppsummeringItem';

interface Props {
  behandlingResultat: BehandlingResultat;
}

export const Vilkårsoppsummering = ({ behandlingResultat }: Props) => {
  const antallStegSomErFullført = behandlingResultat.vilkårene.filter(vilkårErOppfylt);

  return (
    <>
      <BodyShort>
        {antallStegSomErFullført.length} av {behandlingResultat.vilkårene.length} vilkår oppfylt
      </BodyShort>
      <div>
        {behandlingResultat.vilkårene.map((vilkår) => {
          return <VilkårsoppsummeringItem key={vilkår.vilkårtype} vilkår={vilkår} />;
        })}
      </div>
    </>
  );
};

export function periodeErOppfylt(periode: Vilkårsperiode): boolean {
  return periode.utfall === 'OPPFYLT';
}

export function vilkårErOppfylt(vilkår: Vilkår): boolean {
  return vilkår.perioder.every(periodeErOppfylt);
}
