import { ApiException } from '../../../saksbehandling/apiexception/ApiException';
import { isError } from '../../../../lib/utils/api';
import { Mottaker } from '../../../../lib/types/types';
import { kanDistribuereBrev } from '../../../../lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  mottakere: Mottaker[];
}

interface MottakerDistStatus {
  mottaker: Mottaker,
  kanDistribuere: Boolean
}

export const BrevDistribusjonStatus = async ({ mottakere }: Props) => {
  const response = await kanDistribuereBrev({ mottakere })

  if (isError(response)) {
    return <ApiException apiResponses={[response]} />;
  }

  const mottakerDistStatuser = response.data as MottakerDistStatus[];

  // TODO AAP-838 Legg inn riktig visning
  return mottakerDistStatuser
    .map(status => `Mottaker ${status.mottaker.ident} ${status.kanDistribuere ? 'kan' : 'kan ikke'} distribuere`);
};
