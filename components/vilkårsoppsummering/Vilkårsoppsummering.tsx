import { BehandlingResultat, Vilkår, Vilkårsperiode } from 'lib/types/types';
import { BodyShort } from '@navikt/ds-react';
import { VilkårsoppsummeringItem } from 'components/vilkårsoppsummering/VilkårsoppsummeringItem';

interface Props {
  behandlingResultat: BehandlingResultat;
}

export const Vilkårsoppsummering = ({ behandlingResultat }: Props) => {
  const antallStegSomErFullført = behandlingResultat.vilkårene.filter((v) => vilkårErOppfylt(v) !== 'NEI');

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

function periodeErOppfylt(periode: Vilkårsperiode): boolean {
  return periode.utfall === 'OPPFYLT';
}

export function vilkårErOppfylt(vilkår: Vilkår): 'JA' | 'NEI' | 'DELVIS' {
  if (vilkår.perioder.every(periodeErOppfylt)) {
    return 'JA';
  }
  if (vilkår.perioder.some(periodeErOppfylt)) {
    return 'DELVIS';
  }
  return 'NEI';
}
