'use client';

import { VilkRskort } from 'components/vilkårskort/Vilkårskort';
import { FatteVedtakGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

type Props = {
  grunnlag: FatteVedtakGrunnlag;
};

export const FatteVedtak = ({ grunnlag }: Props) => {
  if (grunnlag.besluttetAv == null) {
    return (
      <VilkRskort heading={'Fatte vedtak'} steg={'FATTE_VEDTAK'}>
        Fullfør besluttersteget i høyre kolonne.
      </VilkRskort>
    );
  }

  return (
    <VilkRskort heading={'Fatte vedtak'} steg={'FATTE_VEDTAK'}>
      Besluttet av {grunnlag.besluttetAv.navn} ({grunnlag.besluttetAv.kontor}),{' '}
      {formaterDatoForFrontend(grunnlag.besluttetAv.tidspunkt)}
    </VilkRskort>
  );
};
