import {
  hentFeilendeJObber,
  hentPlanlagteJobber,
  hentSisteKjørteJobber,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Heading } from '@navikt/ds-react';
import { Jobboversikt } from 'components/drift/jobboversikt/Jobboversikt';

const Page = async () => {
  const feilendeJobber = await hentFeilendeJObber();
  const planlagteJobber = await hentPlanlagteJobber();
  const sisteKjørteJobber = await hentSisteKjørteJobber();

  return (
    <div className={'flex-column'} style={{ padding: '1rem' }}>
      <Heading size={'large'}>Drift console</Heading>
      <Jobboversikt
        feilendeJobber={feilendeJobber}
        planlagteJobber={planlagteJobber}
        sisteKjørteJobber={sisteKjørteJobber}
      />
    </div>
  );
};

export default Page;
