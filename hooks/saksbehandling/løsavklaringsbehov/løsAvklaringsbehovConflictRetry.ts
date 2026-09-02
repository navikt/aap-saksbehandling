import { clientHentFlyt, clientLøsBehov, clientLøsPeriodisertBehov } from 'lib/clientApi';
import { isError, isSuccess, FetchResponse } from 'lib/utils/api';
import { LøsAvklaringsbehovPåBehandling, LøsPeriodisertBehovPåBehandling } from 'lib/types/types';

export const løsAvklaringsbehovMedRetry = async (
  avklaringsbehov: LøsAvklaringsbehovPåBehandling | LøsPeriodisertBehovPåBehandling,
  erPeriodisert: boolean,
  behandlingsreferanse: string
): Promise<FetchResponse<unknown>> => {
  const res = erPeriodisert
    ? await clientLøsPeriodisertBehov(avklaringsbehov as LøsPeriodisertBehovPåBehandling)
    : await clientLøsBehov(avklaringsbehov);

  if (isError(res) && res.status === 409) {
    const flytResponse = await clientHentFlyt(behandlingsreferanse);

    if (isSuccess(flytResponse)) {
      return erPeriodisert
        ? await clientLøsPeriodisertBehov({
            ...(avklaringsbehov as LøsPeriodisertBehovPåBehandling),
            behandlingVersjon: flytResponse.data.behandlingVersjon,
          })
        : await clientLøsBehov({
            ...avklaringsbehov,
            behandlingVersjon: flytResponse.data.behandlingVersjon,
          });
    }
  }

  return res;
};
