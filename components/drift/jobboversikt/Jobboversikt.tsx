'use client';

import { PlanlagteJobber } from 'components/drift/planlagtejobber/PlanlagteJobber';
import { FeilendeJobber } from 'components/drift/feilendejobber/FeilendeJobber';
import { JobbInfo } from 'lib/types/types';
import { RekjørFeiledeJobber } from 'components/drift/rekjørfeiledejobber/RekjørFeiledeJobber';

interface Props {
  planlagteJobber: JobbInfo[];
  feilendeJobber: JobbInfo[];
}
export const Jobboversikt = ({ planlagteJobber, feilendeJobber }: Props) => {
  return (
    <div>
      <RekjørFeiledeJobber />
      <PlanlagteJobber planlagteJobber={planlagteJobber} />
      <FeilendeJobber jobber={feilendeJobber} />
    </div>
  );
};
