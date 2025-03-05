'use client';

import { Button } from '@navikt/ds-react';

export const BestillBrevTestKnapp = ({ behandlingReferanse }: { behandlingReferanse: string }) => {
  const bestillBrev = async () => {
    const response = await fetch('/api/test/bestill/brev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ behandlingReferanse }),
    });

    if (response.ok) {
      alert('Brev bestilt');
    } else {
      alert('Noe gikk galt');
    }
  };

  return <Button size="small" variant="secondary" onClick={async () => bestillBrev()}>Bestill testbrev</Button>;
};
