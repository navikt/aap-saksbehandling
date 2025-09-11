import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { OppholdskravStegMedDataFatching } from 'components/behandlinger/oppholdskrav/OppholdskravStegMedDataFatching';
import { getStegSomSkalVises } from 'lib/utils/steg';

interface Props {
  behandlingsreferanse: string;
}

export const OppholdskravStegGruppe = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  const stegSomSkalVises = getStegSomSkalVises('OPPHOLDSKRAV', flyt.data);

  return (
    <GruppeSteg
      behandlingVersjon={flyt.data.behandlingVersjon}
      behandlingReferanse={behandlingsreferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {stegSomSkalVises.includes('VURDER_OPPHOLDSKRAV') && (
        <StegSuspense>
          <OppholdskravStegMedDataFatching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={flyt.data.behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
