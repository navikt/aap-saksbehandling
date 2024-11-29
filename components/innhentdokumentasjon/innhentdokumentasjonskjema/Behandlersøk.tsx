import { Loader, Popover, TextField } from '@navikt/ds-react';
import { Behandlerliste } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/Behandlerliste';
import {
  Behandler,
  formaterBehandlernavn,
} from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import { clientSøkPåBehandler } from 'lib/clientApi';
import { FormEvent, useRef, useState } from 'react';

type Props = {
  velgBehandler: (val?: Behandler) => void;
  behandlerError?: string;
};

export const Behandlersøk = ({ velgBehandler, behandlerError }: Props) => {
  const [behandlere, setBehandlere] = useState<Behandler[]>();
  const [søker, setSøker] = useState<boolean>(false);
  const [visPopover, settVisPopover] = useState<boolean>(false);
  const [fieldValue, setFieldValue] = useState<string>('');
  const searchRef = useRef<HTMLInputElement>(null);

  const oppdaterBehandlerliste = (behandlere: Behandler[]) => {
    setSøker(false);
    setBehandlere(behandlere);
  };

  const onChange = async (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    velgBehandler(undefined);
    setFieldValue(value);
    if (value && value.length >= 3) {
      settVisPopover(true);
      setSøker(true);
      const res = await clientSøkPåBehandler(value);
      oppdaterBehandlerliste(res ?? []);
    }
  };

  const velgEnBehandler = (behandler: Behandler) => {
    settVisPopover(false);
    setFieldValue(formaterBehandlernavn(behandler));
    velgBehandler(behandler);
  };

  return (
    <>
      <TextField
        label="Behandler"
        size="small"
        onChange={onChange}
        ref={searchRef}
        value={fieldValue}
        error={behandlerError}
      />
      <Popover
        anchorEl={searchRef.current}
        placement="bottom-start"
        open={visPopover}
        onClose={() => settVisPopover(false)}
        arrow={false}
      >
        <Popover.Content>
          <>
            {søker && <Loader />}
            <Behandlerliste behandlere={behandlere} velgBehandler={velgEnBehandler} />
          </>
        </Popover.Content>
      </Popover>
    </>
  );
};
