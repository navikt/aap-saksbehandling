import { Button } from '@navikt/ds-react';
import {
  Behandler,
  formaterBehandlernavn,
} from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';

type Props = {
  velgBehandler: (behandler: Behandler) => void;
  behandlere?: Behandler[];
};

export const Behandlerliste = ({ behandlere, velgBehandler }: Props) => {
  if (!behandlere) {
    return null;
  }
  if (behandlere.length === 0) {
    return <div>Ingen treff</div>;
  }

  return (
    <>
      {behandlere.map((behandler) => (
        <div key={behandler.behandlerRef}>
          <Button type={'button'} variant={'tertiary-neutral'} onClick={() => velgBehandler(behandler)}>
            {formaterBehandlernavn(behandler)}
          </Button>
        </div>
      ))}
    </>
  );
};
