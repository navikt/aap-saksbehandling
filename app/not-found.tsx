'use client';

import Image from 'next/image';
import { Heading } from '@navikt/ds-react';

import ErrorBilde from '../public/error.jpg';

//404 Page
const NotFound = () => {
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
        Denne siden finnes ikke.
      </Heading>
      <Image src={ErrorBilde} alt="404" width={500} height={500} />
    </div>
  );
};

export default NotFound;
