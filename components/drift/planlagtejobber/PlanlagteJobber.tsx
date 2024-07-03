'use client';

import { Heading } from '@navikt/ds-react';
import { JobbInfo } from 'lib/types/types';
import { JobbTabell } from 'components/drift/jobbtabell/JobbTabell';

interface Props {
  planlagteJobber: JobbInfo[];
}

export const PlanlagteJobber = ({ planlagteJobber }: Props) => {
  return (
    <div>
      <Heading size={'small'} level={'2'}>
        Planlagte jobber
      </Heading>
      <JobbTabell jobber={planlagteJobber} />
    </div>
  );
};
