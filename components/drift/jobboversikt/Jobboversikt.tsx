'use client';

import { PlanlagteJobber } from 'components/drift/planlagtejobber/PlanlagteJobber';
import { FeilendeJobber } from 'components/drift/feilendejobber/FeilendeJobber';
import { JobbInfo } from 'lib/types/types';
import { RekjørFeiledeJobber } from 'components/drift/rekjørfeiledejobber/RekjørFeiledeJobber';
import { SisteKjørteJobber } from 'components/drift/sistekjørtejobber/SisteKjørteJobber';

interface Props {
  planlagteJobber: JobbInfo[];
  feilendeJobber: JobbInfo[];
  sisteKjørteJobber: JobbInfo[];
}
export const Jobboversikt = ({ planlagteJobber, feilendeJobber, sisteKjørteJobber }: Props) => {
  return (
    <div className={'flex-column'}>
      <PlanlagteJobber planlagteJobber={planlagteJobber} />
      <FeilendeJobber jobber={feilendeJobber} />
      <RekjørFeiledeJobber />
      <SisteKjørteJobber sisteKjørteJobber={sisteKjørteJobber} />
    </div>
  );
};
