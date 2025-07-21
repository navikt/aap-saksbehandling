'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FatteVedtakGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

type Props = {
  grunnlag: FatteVedtakGrunnlag;
};

export const FatteVedtak = ({ grunnlag }: Props) => {
  if (grunnlag.besluttetAv == null) {
    return (
      <VilkårsKort heading={'Fatte vedtak'} steg={'FATTE_VEDTAK'}>
        Fullfør besluttersteget i høyre kolonne.
      </VilkårsKort>
    );
  }

  return (
    <VilkårsKort heading={'Fatte vedtak'} steg={'FATTE_VEDTAK'}>
      Besluttet av {grunnlag.besluttetAv.navn} ({grunnlag.besluttetAv.kontor}),{' '}
      {formaterDatoForFrontend(grunnlag.besluttetAv.tidspunkt)}
    </VilkårsKort>
  );
};
