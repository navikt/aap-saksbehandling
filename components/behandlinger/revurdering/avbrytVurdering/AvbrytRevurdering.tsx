import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { AvbrytRevurderingMedDatafetching } from 'components/behandlinger/revurdering/avbrytVurdering/vurdering/AvbrytRevurderingMedDatafetching';

interface props {
  behandlingsreferanse: string;
}

export const AvbrytRevurdering = async ({ behandlingsreferanse }: props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }
  const stegSomSkalVises = getStegSomSkalVises('AVBRYT_REVURDERING', flyt.data);
  const behandlingVersjon = flyt.data.behandlingVersjon;

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={behandlingVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {stegSomSkalVises.includes('AVBRYT_REVURDERING') && (
        <StegSuspense>
          <AvbrytRevurderingMedDatafetching
            behandlingsreferanse={behandlingsreferanse}
            behandlingVersjon={behandlingVersjon}
            readOnly={flyt.data.visning.saksbehandlerReadOnly}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};