import { ReadMore } from '@navikt/ds-react';
import React from 'react';

export const HvordanLeggeTilSluttdatoReadMore = () => {
  return (
    <ReadMore style={{ maxWidth: '90ch' }} size={'small'} header="Hvordan legge til sluttdato?">
      For å legge til en sluttdato på denne vurderingen velger du “Legg til ny vurdering”. Det oppretter en ny
      vurdering, der du kan ha et annet utfall og en ny “gjelder fra” dato, som da vil gi sluttdato på den foregående
      (denne) vurderingen. Sluttdatoen for denne vurderingen blir satt til dagen før den nye vurderingen sin “gjelder
      fra” dato.
    </ReadMore>
  );
};
