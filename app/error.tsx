'use client';

import Image from 'next/image';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';
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
        Det har oppstått en feil 🙃.
      </Heading>
      <VStack align={'start'} gap={'4'}>
        <BodyShort>{error.message}</BodyShort>
        <BodyShort>Gi denne identifikatoren til en frontend-utvikler: {error?.digest}</BodyShort>
        <Image src={ErrorBilde} alt="404" width={500} height={500} />
      </VStack>
    </div>
  );
};

export default Error;
