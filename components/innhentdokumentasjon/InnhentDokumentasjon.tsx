import { Button } from '@navikt/ds-react';
import { useState } from 'react';

import { InnhentDokumentasjonSkjema } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';

export const InnhentDokumentasjon = () => {
  const [visSkjema, oppdaterVisSkjema] = useState<boolean>(false);
  return (
    <section>
      {!visSkjema && (
        <>
          <Button type="button" variant={'secondary'} onClick={() => oppdaterVisSkjema(true)} size={'small'}>
            Etterspør informasjon fra lege
          </Button>
        </>
      )}
      {visSkjema && <InnhentDokumentasjonSkjema onCancel={() => oppdaterVisSkjema(false)} />}
    </section>
  );
};
