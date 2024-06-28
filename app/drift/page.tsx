import { hentFeilendeJObber, hentPlanlagteJobber } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Heading } from '@navikt/ds-react';
import { Jobboversikt } from 'components/drift/jobboversikt/Jobboversikt';

const Page = async () => {
  const feilendeJobber = await hentFeilendeJObber();
  const planlagteJobber = await hentPlanlagteJobber();

  return (
    <div className={'flex-column'} style={{ padding: '1rem' }}>
      <Heading size={'large'}>Drift console</Heading>
      <Jobboversikt feilendeJobber={feilendeJobber} planlagteJobber={planlagteJobber} />
    </div>
  );
};

export default Page;
