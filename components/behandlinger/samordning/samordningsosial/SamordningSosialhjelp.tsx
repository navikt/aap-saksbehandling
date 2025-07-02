import { Alert, BodyShort } from '@navikt/ds-react';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { parse } from 'date-fns';
import { RefusjonskravGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  grunnlag: RefusjonskravGrunnlag;
}

export const SamordningSosialhjelp = ({ grunnlag }: Props) => {
  if (!grunnlag.gjeldendeVurdering?.harKrav) return null;

  const vurderinger = grunnlag.gjeldendeVurderinger;
  return (
    vurderinger && (
      <VilkårsKort heading="§11-29 Refusjonskrav sosialstønad" steg="REFUSJON_KRAV" defaultOpen={true}>
        <BodyShort spacing>
          Vi har funnet perioder med sosialstønad eller tjenestepensjonsordning. Disse kan føre til refusjonskrav på
          etterbetaling.
        </BodyShort>
        <BodyShort spacing>
          Refusjonskrav gjelder for:{' '}
          {vurderinger.map((vurdering, index) => {
            const fom = vurdering.fom ? formaterDatoForFrontend(parse(vurdering.fom, 'yyyy-MM-dd', new Date())) : '-';
            const tom = vurdering.tom ? formaterDatoForFrontend(parse(vurdering.tom, 'yyyy-MM-dd', new Date())) : '';
            const navKontor = vurdering.navKontor ?? '';
            return (
              <div key={index}>
                {fom} {tom && `til ${tom}`} {navKontor}
                {index < vurderinger.length - 1 ? ', ' : ''}
              </div>
            );
          })}
        </BodyShort>
        <Alert variant={'info'}>
          Det er ikke støtte for refusjonskrav enda. Sett saken på vent og kontakt team AAP.
        </Alert>
      </VilkårsKort>
    )
  );
};
