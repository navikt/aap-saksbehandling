import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SvarFraAndreinstansMedDatafetching } from 'components/behandlinger/svarfraandreinstans/SvarFraAndreinstansMedDatafetching';

interface Props {
  behandlingsreferanse: string;
}

export const SvarFraAndreinstansGruppe = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }
  const stegSomSkalVises = getStegSomSkalVises('SVAR_FRA_ANDREINSTANS', flyt.data);

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {stegSomSkalVises.includes('SVAR_FRA_ANDREINSTANS') && (
        <StegSuspense>
          <SvarFraAndreinstansMedDatafetching
            behandlingsreferanse={behandlingsreferanse}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
            behandlingVersjon={flyt.data.behandlingVersjon}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
