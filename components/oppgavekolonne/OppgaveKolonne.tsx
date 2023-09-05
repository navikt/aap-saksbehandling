'use client';

import { Button, TextField } from '@navikt/ds-react';
import { løsBehov } from 'lib/api';
import { LøsAvklaringsbehovPåBehandling } from 'lib/types/types';
import { useState } from 'react';

interface Props {
  className: string;
  behandlingsReferanse: string;
}

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
      <TextField
        label="Løs et avklaringsbehov med begrunnelse"
        value={begrunnelse}
        onChange={(event) => setBegrunnelse(event.target.value)}
      />
      <Button onClick={onButtonClick}>Løs avklaringsbehov</Button>
    </div>
  );
};
