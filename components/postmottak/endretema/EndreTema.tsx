import { HourglassBottomFilledIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';
import { VilkårsKort } from '../vilkårskort/VilkårsKort';

export const EndreTema = () => {
  return (
    <VilkårsKort heading={'Endre tema'} icon={<HourglassBottomFilledIcon />}>
      <BodyShort>En oppgave for å endre temaet er opprettet i gosys.</BodyShort>
    </VilkårsKort>
  );
};
