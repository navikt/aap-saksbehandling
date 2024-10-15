'use client';

import Image from 'next/image';
import { Button, Heading } from '@navikt/ds-react';
import ErrorBilde from '../public/error.jpg';

interface Props {
  error: Error & { digest?: string };

  reset: () => void;
}

//500 Page
const Error = ({ error, reset }: Props) => {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        marginBlockStart: '2rem',
      }}
    >
      <Heading level="2" size="medium" spacing>
        Det har oppstått en feil 🙃. {JSON.stringify(error)}
      </Heading>
      <Image src={ErrorBilde} alt="404" width={500} height={500} />
      <Button onClick={() => reset()}>Prøv igjen</Button>
    </div>
  );
};

export default Error;
