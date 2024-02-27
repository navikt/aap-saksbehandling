'use client';

import Image from 'next/image';
import { Heading } from '@navikt/ds-react';

//500 Page
const Error = () => {
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
      <Image src="/error.jpg" alt="404" width={500} height={500} />
    </div>
  );
};

export default Error;
