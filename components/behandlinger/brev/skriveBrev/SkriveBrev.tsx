'use client';

import { Brevbygger } from '@navikt/aap-breveditor/';
import { Heading } from '@navikt/ds-react';
import { Brev } from 'lib/types/types';
import { useSearchParams } from 'next/navigation';

import NavLogo from 'public/nav_logo.png';

export const SkriveBrev = ({ grunnlag }: { grunnlag: Brev }) => {
  const visBrev = useSearchParams().get('visBrev') ?? '';
  if (visBrev != 'enabled') {
    return (
      <div>
        <Heading level="2" size="large">
          Brev (Ikke implementert)
        </Heading>
      </div>
    );
  }
  return <Brevbygger brevmal={grunnlag} logo={NavLogo} />;
};
