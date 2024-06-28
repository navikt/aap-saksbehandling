'use client';

import { BodyShort, Button } from '@navikt/ds-react';
import { rekjørFeiledeJobber } from 'lib/clientApi';
import { useState } from 'react';

export const RekjørFeiledeJobber = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  async function onClick() {
    setIsLoading(true);
    try {
      const rekjørRes = await rekjørFeiledeJobber();
      if (rekjørRes.ok) {
        const message = await rekjørRes.text();
        setMessage(message);
      } else {
        const message = await rekjørRes.text();
        setMessage(message);
      }
    } catch (err) {
      setMessage('Noe gikk galt');
      setIsLoading(false);
    }
    setIsLoading(false);
  }
  return (
    <div>
      <Button onClick={() => onClick()} loading={isLoading}>
        Rekjør alle feilede jobber
      </Button>
      {message && <BodyShort>{message}</BodyShort>}
    </div>
  );
};
