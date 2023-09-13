'use client';

import { Button, TextField } from '@navikt/ds-react';
import { Dokument, DokumentTabell } from 'components/DokumentTabell/DokumentTabell';
import { løsBehov } from 'lib/api';
import { LøsAvklaringsbehovPåBehandling } from 'lib/types/types';
import { useState } from 'react';

interface Props {
  className: string;
  behandlingsReferanse: string;
}

const dokumenter: Dokument[] = [{
  journalpostId: '123',
  dokumentId: '123',
  tittel: 'Tittel',
  åpnet: new Date(),
  erTilknyttet: false
}]

export const OppgaveKolonne = ({ className, behandlingsReferanse }: Props) => {
  const initialAvklaringsbehov: LøsAvklaringsbehovPåBehandling = {
    behandlingVersjon: 0,
    behov: {
      begrunnelse: '',
      endretAv: '',
    },
    referanse: behandlingsReferanse,
  };
  const [begrunnelse, setBegrunnelse] = useState<string>('');

  const onButtonClick = async () => {
    await løsBehov({ ...initialAvklaringsbehov, behov: { ...initialAvklaringsbehov.behov, begrunnelse: begrunnelse } });
  };

  return (
    <div className={className}>
      <DokumentTabell dokumenter={dokumenter} onTilknyttetClick={() => {}} onVedleggClick={() => {}} />
      <TextField
        label="Løs et avklaringsbehov med begrunnelse"
        value={begrunnelse}
        onChange={(event) => setBegrunnelse(event.target.value)}
      />
      <Button onClick={onButtonClick}>Løs avklaringsbehov</Button>
    </div>
  );
};
