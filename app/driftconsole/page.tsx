import { hentFeilendeJObber } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Heading } from '@navikt/ds-react';
import { FeilendeJobber } from 'components/feilendejobber/FeilendeJobber';

const Page = async () => {
  const feilendeJobber = await hentFeilendeJObber();

  return (
    <div className={'flex-column'} style={{ padding: '1rem' }}>
      <Heading size={'large'}>Drift console</Heading>
      <FeilendeJobber jobber={feilendeJobber} />
    </div>
  );
};

export default Page;
