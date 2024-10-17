'use client';

import Image from 'next/image';
import { Heading } from '@navikt/ds-react';
import ErrorBilde from '../public/error.jpg';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

//500 Page
const Error = ({ error }: Props) => {
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
        Det har oppstått en feil 🙃. Gi denne identifikatoren til en frontend-utvikler: {error?.digest}
      </Heading>
      <Image src={ErrorBilde} alt="404" width={500} height={500} />
    </div>
  );
};

export default Error;
