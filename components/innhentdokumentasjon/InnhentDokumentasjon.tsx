import { Alert, Button, Loader } from '@navikt/ds-react';
import { useState } from 'react';

import { InnhentDokumentasjonSkjema } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import { hentAlleDialogmeldingerPåSak } from 'lib/clientApi';
import useSWR from 'swr';
import { Dialogmeldinger } from 'components/innhentdokumentasjon/dialogmeldinger/Dialogmeldinger';
import { useSaksnummer } from 'hooks/BehandlingHook';
import { LegeerklæringStatus } from 'lib/types/types';

export const InnhentDokumentasjon = () => {
  const saksnummer = useSaksnummer();
  const { data, isLoading, error } = useSWR(`api/dokumentinnhenting/status/${saksnummer}`, () =>
    hentAlleDialogmeldingerPåSak(saksnummer)
  );
  const [visSkjema, oppdaterVisSkjema] = useState<boolean>(false);
  return (
    <section>
      {!visSkjema && (
        <>
          <Button type="button" variant={'secondary'} onClick={() => oppdaterVisSkjema(true)} size={'small'}>
            Etterspør informasjon fra lege
          </Button>
          {isLoading && (
            <div>
              <Loader title="Ser etter dialogmeldinger..." />
            </div>
          )}
          {error && <Alert variant="error">Noe gikk galt under henting av dialogmeldinger</Alert>}
          {data && <Dialogmeldinger dialogmeldinger={data as LegeerklæringStatus[]} />}
        </>
      )}
      {visSkjema && <InnhentDokumentasjonSkjema onCancel={() => oppdaterVisSkjema(false)} />}
    </section>
  );
};
