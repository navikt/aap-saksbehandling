'use client';

import { Buldings2Icon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Label } from '@navikt/ds-react';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { format } from 'date-fns';
import { SykdomsGrunnlag } from 'lib/types/types';
import { Yrkesskade } from './yrkesskade/Yrkesskade';
import { Sykdomsvurdering } from './sykdomsvurdering/Sykdomsvurdering';

interface Props {
  sykdomsGrunnlag?: SykdomsGrunnlag;
  behandlingsReferanse: string;
  readOnly?: boolean;
}

export const Sykdom = ({ sykdomsGrunnlag, behandlingsReferanse, readOnly }: Props) => {
  return (
    <div>
      {readOnly && <Alert variant="warning">Du har kun lesetilgang til dette steget</Alert>}
      <VilkårsKort heading={'Yrkesskade - § 11-22'} icon={<Buldings2Icon />}>
        <Alert variant="warning">Vi har funnet en eller flere registrerte yrkesskader</Alert>
        <div>
          <Label as="p" spacing>
            Har søker oppgitt at de har en yrkesskade i søknaden?
          </Label>
          <BodyShort>{sykdomsGrunnlag?.opplysninger.oppgittYrkesskadeISøknad ? 'Ja' : 'Nei'}</BodyShort>
        </div>
        <div>
          <Label as="p" spacing>
            Saksopplysninger
          </Label>
          {sykdomsGrunnlag?.opplysninger.innhentedeYrkesskader.map((innhentetYrkesskade) => (
            <div key={innhentetYrkesskade.ref}>
              <BodyShort spacing>{innhentetYrkesskade.kilde}</BodyShort>
              <Label as="p" spacing>
                Periode
              </Label>
              <BodyShort spacing>Fra: {format(new Date(innhentetYrkesskade.periode.fom), 'dd.MM.yyyy')}</BodyShort>
              <BodyShort spacing>Til: {format(new Date(innhentetYrkesskade.periode.tom), 'dd.MM.yyyy')}</BodyShort>
            </div>
          ))}
          {sykdomsGrunnlag?.opplysninger.innhentedeYrkesskader.length === 0 && (
            <BodyShort>Ingen innhentede yrkesskader</BodyShort>
          )}
        </div>
      </VilkårsKort>

      <Yrkesskade behandlingsReferanse={behandlingsReferanse} sykdomsgrunnlag={sykdomsGrunnlag} />

      <Sykdomsvurdering behandlingsReferanse={behandlingsReferanse} sykdomsgrunnlag={sykdomsGrunnlag} />
    </div>
  );
};
