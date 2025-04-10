'use client';

import { Button } from '@navikt/ds-react';
import { isSuccess } from 'lib/utils/api';
import { clientBestillTestBrev } from 'lib/clientApi';

export const BestillBrevTestKnapp = ({ behandlingReferanse }: { behandlingReferanse: string }) => {
  const bestillBrev = async () => {
    const response = await clientBestillTestBrev(behandlingReferanse);

    if (isSuccess(response)) {
      alert('Brev bestilt');
    } else {
      alert('Noe gikk galt');
    }
  };

  return (
    <Button size="small" variant="secondary" onClick={async () => bestillBrev()}>
      Bestill testbrev
    </Button>
  );
};
