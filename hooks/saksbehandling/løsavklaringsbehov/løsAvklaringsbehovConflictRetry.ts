import { clientHentFlyt, clientLøsBehov, clientLøsPeriodisertBehov } from 'lib/clientApi';
import { isError, isSuccess, FetchResponse } from 'lib/utils/api';
import { LøsAvklaringsbehovPåBehandling, LøsPeriodisertBehovPåBehandling } from 'lib/types/types';

export type LøsAvklaringsbehovRequest =
  | { erPeriodisert: true; avklaringsbehov: LøsPeriodisertBehovPåBehandling }
  | { erPeriodisert: false; avklaringsbehov: LøsAvklaringsbehovPåBehandling };

export const løsAvklaringsbehovMedRetry = async (
  request: LøsAvklaringsbehovRequest,
  behandlingsreferanse: string
): Promise<FetchResponse<unknown>> => {
  const res = request.erPeriodisert
    ? await clientLøsPeriodisertBehov(request.avklaringsbehov)
    : await clientLøsBehov(request.avklaringsbehov);

  if (isError(res) && res.status === 409) {
    const flytResponse = await clientHentFlyt(behandlingsreferanse);

    if (isSuccess(flytResponse)) {
      if (request.erPeriodisert) {
        return await clientLøsPeriodisertBehov({
          ...request.avklaringsbehov,
          behandlingVersjon: flytResponse.data.behandlingVersjon,
        });
      }

      return await clientLøsBehov({
        ...request.avklaringsbehov,
        behandlingVersjon: flytResponse.data.behandlingVersjon,
      });
    }
  }

  return res;
};
