import { Alert, BodyShort } from '@navikt/ds-react';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { parse } from 'date-fns';
import { RefusjonskravGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  grunnlag: RefusjonskravGrunnlag;
}

export const SamordningSosialhjelp = ({ grunnlag }: Props) => {
  if (!grunnlag.gjeldendeVurderinger?.[0]?.harKrav) return null;

  return (
    <VilkårsKort heading="§11-29 Refusjonskrav sosialstønad" steg="REFUSJON_KRAV" defaultOpen={true}>
      <BodyShort spacing>
        Vi har funnet perioder med sosialstønad eller tjenestepensjonsordning. Disse kan føre til refusjonskrav på
        etterbetaling.
      </BodyShort>

      <BodyShort spacing>
        Refusjonskravet gjelder fra{' '}
        {grunnlag.gjeldendeVurderinger?.[0].fom
          ? formaterDatoForFrontend(parse(grunnlag.gjeldendeVurderinger?.[0].fom, 'yyyy-MM-dd', new Date()))
          : '-'}{' '}
        {grunnlag.gjeldendeVurderinger?.[0].tom
          ? `til ${formaterDatoForFrontend(parse(grunnlag.gjeldendeVurderinger?.[0].tom, 'yyyy-MM-dd', new Date()))}`
          : ''}
      </BodyShort>
      <Alert variant={'info'}>Det er ikke støtte for refusjonskrav enda. Sett saken på vent og kontakt team AAP.</Alert>
    </VilkårsKort>
  );
};
