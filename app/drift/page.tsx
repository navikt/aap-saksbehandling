import { hentFeilendeJObber, hentPlanlagteJobber } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Heading } from '@navikt/ds-react';
import { FeilendeJobber } from 'components/drift/feilendejobber/FeilendeJobber';
import { PlanlagteJobber } from 'components/drift/planlagtejobber/PlanlagteJobber';

const Page = async () => {
  const feilendeJobber = await hentFeilendeJObber();
  const planlagteJobber = await hentPlanlagteJobber();

  return (
    <div className={'flex-column'} style={{ padding: '1rem' }}>
      <Heading size={'large'}>Drift console</Heading>
      <PlanlagteJobber planlagteJobber={planlagteJobber} />
      <FeilendeJobber jobber={feilendeJobber} />
    </div>
  );
};

export default Page;
