import { hentFlyt } from 'lib/services/postmottakservice/postmottakservice';
import { redirect } from 'next/navigation';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface PageProps {
  behandlingsreferanse: string;
}

const Page = async (props: { params: Promise<PageProps> }) => {
  const params = await props.params;
  const flyt = await hentFlyt(params.behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  redirect(`/postmottak/${params.behandlingsreferanse}/${flyt.data.aktivGruppe}`);
};

export default Page;
